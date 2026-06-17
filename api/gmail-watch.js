require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const { getClients }  = require('../lib/gmail-client');
const { classify, isUwmLoanSubject, isBrokerApprovalBundle } = require('../lib/email-classifier');
const { isApprovalPdfFilename } = require('../lib/approval-letter');
const {
  isNewrezApprovalEmail,
  extractApprovalPdfUrl,
  downloadApprovalPdf
} = require('../lib/newrez-client');

const DRY_RUN = process.env.DRY_RUN === 'true';
const MAX_MESSAGES_PER_INBOX = Number(process.env.GMAIL_MAX_MESSAGES_PER_INBOX) || 25;
const MAX_TOTAL_PER_INBOX_PER_SCAN = Number(process.env.GMAIL_MAX_TOTAL_PER_INBOX_PER_SCAN) || 50;
const SCAN_TIMEZONE = process.env.GMAIL_SCAN_TIMEZONE || 'America/New_York';
const PROCESSED_LABEL = process.env.GMAIL_PROCESSED_LABEL || 'mortgage-bot-processed';
const PRESERVE_UNREAD = process.env.GMAIL_PRESERVE_UNREAD !== 'false';
const APPROVAL_PDF_ONLY = process.env.APPROVAL_PDF_ONLY !== 'false';
const labelIdCache = {};

// Writable state path: Vercel uses /tmp; Render/local use ./data
const STATE_FILE = process.env.GMAIL_STATE_FILE
  || (process.env.VERCEL
    ? '/tmp/.gmail-state.json'
    : path.join(__dirname, '..', 'data', '.gmail-state.json'));

function ensureStateDir() {
  try {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  } catch { /* ignore */ }
}

function log(inbox, msgId, classification, action) {
  console.log(JSON.stringify({
    ts: new Date().toISOString(), inbox, msgId, classification, action
  }));
}

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return {}; }
}

function saveState(state) {
  ensureStateDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function formatGmailAfterDate(epochMs) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SCAN_TIMEZONE,
    year:  'numeric',
    month: '2-digit',
    day:   '2-digit'
  }).formatToParts(new Date(epochMs));
  const y = parts.find(p => p.type === 'year').value;
  const m = parts.find(p => p.type === 'month').value;
  const d = parts.find(p => p.type === 'day').value;
  return `${y}/${m}/${d}`;
}

function getStartOfTodayMs() {
  const now = new Date();
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: SCAN_TIMEZONE,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).formatToParts(now).map(p => [p.type, p.value])
  );
  const msToday = (+parts.hour * 3600 + +parts.minute * 60 + +parts.second) * 1000;
  return now.getTime() - msToday;
}

function ensureScanCutoff(state) {
  if (process.env.GMAIL_SCAN_AFTER) {
    state.scanCutoffMs = Date.parse(process.env.GMAIL_SCAN_AFTER);
    return state;
  }
  // Default: start of today (Eastern) — not "right now", so earlier-today emails aren't skipped
  state.scanCutoffMs = getStartOfTodayMs();
  return state;
}

function buildInboxQuery(cutoffMs) {
  return `in:inbox after:${formatGmailAfterDate(cutoffMs)} -label:${PROCESSED_LABEL}`;
}

async function getProcessedLabelId(gmail, inboxLabel) {
  if (labelIdCache[inboxLabel]) return labelIdCache[inboxLabel];

  const { data } = await gmail.users.labels.list({ userId: 'me' });
  const existing = (data.labels ?? []).find(l => l.name === PROCESSED_LABEL);
  if (existing) {
    labelIdCache[inboxLabel] = existing.id;
    if (existing.labelListVisibility === 'labelHide') {
      await ensureProcessedLabelVisible(gmail, inboxLabel, existing.id);
    }
    return existing.id;
  }

  const created = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: PROCESSED_LABEL,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show'
    }
  });
  labelIdCache[inboxLabel] = created.data.id;
  return created.data.id;
}

async function ensureProcessedLabelVisible(gmail, inboxLabel, labelId) {
  await gmail.users.labels.update({
    userId: 'me',
    id: labelId,
    requestBody: {
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show'
    }
  }).catch(() => { /* non-fatal */ });
}

async function markMessageProcessed(gmail, inboxLabel, msgId, { wasUnread } = {}) {
  const labelId = await getProcessedLabelId(gmail, inboxLabel);
  const addLabelIds = [labelId];
  // Gmail API reads don't mark read, but re-apply UNREAD if anything cleared it during processing
  if (PRESERVE_UNREAD && wasUnread) addLabelIds.push('UNREAD');
  await gmail.users.messages.modify({
    userId: 'me',
    id: msgId,
    requestBody: { addLabelIds }
  });
}

function extractPart(payload, mimeType) {
  function search(part) {
    if (part.mimeType === mimeType && part.body?.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf8');
    }
    for (const child of part.parts ?? []) {
      const result = search(child);
      if (result) return result;
    }
    return null;
  }
  return search(payload);
}

function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractBody(payload) {
  const plain = extractPart(payload, 'text/plain');
  if (plain) return plain;
  const html = extractPart(payload, 'text/html');
  if (html) return stripHtml(html);
  return '';
}

function getHeader(headers, name) {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';
}

function hasPdf(payload) {
  // Recursively search all parts for a PDF attachment
  function search(part) {
    if (
      part.mimeType === 'application/pdf' ||
      (part.filename ?? '').toLowerCase().endsWith('.pdf')
    ) return true;
    return (part.parts ?? []).some(search);
  }
  return search(payload);
}

function findAllPdfParts(payload, out = []) {
  if (
    payload.mimeType === 'application/pdf' ||
    (payload.filename ?? '').toLowerCase().endsWith('.pdf')
  ) {
    out.push(payload);
  }
  for (const child of payload.parts ?? []) findAllPdfParts(child, out);
  return out;
}

function findApprovalPdfPart(payload) {
  const parts = listApprovalPdfParts(payload);
  return parts[0] ?? null;
}

function listApprovalPdfParts(payload, subject = '', from = '') {
  const pdfs = findAllPdfParts(payload);
  if (!pdfs.length) return [];

  const ranked = pdfs
    .map(part => {
      const filename = part.filename ?? '';
      let score = 0;
      if (isApprovalPdfFilename(filename)) score += 10;
      if (/approvalletter|conditional.?approval|loan.?approval/i.test(filename)) score += 5;
      if (/1003|1008|closing|settlement|alta|disclosure|invoice|wire|deed|note/i.test(filename)) score -= 5;
      return { part, score };
    })
    .sort((a, b) => b.score - a.score);

  const positives = ranked.filter(r => r.score > 0).map(r => r.part);
  if (positives.length) return positives;

  const names = pdfs.map(p => p.filename ?? '');
  if (isBrokerApprovalBundle(subject, '', { hasPdf: true, from, pdfFilenames: names })) {
    return pdfs.filter(p => !/1003|1008|closing|settlement|alta|disclosure|invoice|wire|deed|note|intro/i.test(p.filename ?? ''));
  }

  return ranked[0]?.part ? [ranked[0].part] : [];
}

function findPdfPart(payload) {
  return findApprovalPdfPart(payload) ?? findAllPdfParts(payload)[0] ?? null;
}

async function getAttachmentData(gmail, msgId, attachmentId) {
  const res = await gmail.users.messages.attachments.get({
    userId: 'me', messageId: msgId, id: attachmentId
  });
  return Buffer.from(res.data.data, 'base64');
}

async function processMessage(gmail, inboxLabel, msg, cutoffMs, stats, processedLabelId) {
  const full = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' });
  const { payload } = full.data;
  const labelIds = full.data.labelIds ?? [];
  const wasUnread = labelIds.includes('UNREAD');

  if (processedLabelId && labelIds.includes(processedLabelId)) {
    log(inboxLabel, msg.id, null, 'already-processed');
    stats.alreadyProcessed = (stats.alreadyProcessed ?? 0) + 1;
    return { status: 'already-processed', wasUnread };
  }

  const headers = payload.headers ?? [];
  const subject = getHeader(headers, 'subject');
  const from    = getHeader(headers, 'from');
  const body    = extractBody(payload);
  const hasPDF  = hasPdf(payload);
  const pdfFilenames = findAllPdfParts(payload).map(p => p.filename ?? '');
  const pdfParts = hasPDF ? listApprovalPdfParts(payload, subject, from) : [];
  const pdfPart = pdfParts[0] ?? null;
  const pdfFilename = pdfPart?.filename ?? pdfFilenames[0] ?? '';
  const internalDate = Number(full.data.internalDate);

  // PDF approval letters with UWM subject pattern: always process if in today's inbox
  const bypassCutoff = (hasPDF && isUwmLoanSubject(subject)) || isNewrezApprovalEmail(from, subject);
  if (internalDate < cutoffMs && !bypassCutoff) {
    log(inboxLabel, msg.id, null, 'skipped-before-cutoff');
    stats.skippedCutoff++;
    return { status: 'skipped-cutoff', wasUnread };
  }

  const classification = classify(subject, body, { hasPdf: hasPDF, from, pdfFilename, pdfFilenames });
  log(inboxLabel, msg.id, classification, 'classified');
  stats.messages.push({ inbox: inboxLabel, msgId: msg.id, subject, classification, hasPdf: hasPDF });

  // Dry run — log only, no handler dispatch
  if (DRY_RUN) {
    log(inboxLabel, msg.id, classification, 'dry-run-skipped');
    stats.dryRun++;
    return { status: 'dry-run', wasUnread };
  }

  if (classification === 'CONDITION_LIST') {
    const conditionParser = require('../lib/condition-parser');
    const partsToProcess = pdfParts.length ? pdfParts : [];

    if (!partsToProcess.length && isNewrezApprovalEmail(from, subject)) {
      let pdfBuffer = null;
      const html = extractPart(payload, 'text/html');
      const url  = extractApprovalPdfUrl(html, body, subject);
      if (url) {
        try {
          pdfBuffer = await downloadApprovalPdf(url);
          log(inboxLabel, msg.id, classification, `newrez-pdf-downloaded:${url.slice(0, 80)}`);
        } catch (err) {
          log(inboxLabel, msg.id, classification, `newrez-pdf-error:${err.message}`);
        }
      } else {
        log(inboxLabel, msg.id, classification, 'newrez-pdf-link-not-found');
      }
      if (pdfBuffer) {
        await conditionParser.process({
          subject, from, body, pdfBuffer, msgId: msg.id,
          gmail, threadId: full.data.threadId, inboxLabel
        });
        log(inboxLabel, msg.id, classification, 'dispatched to condition-parser');
        stats.dispatched++;
        return { status: 'dispatched', wasUnread };
      }
    }

    if (!partsToProcess.length) {
      log(inboxLabel, msg.id, classification, 'skipped-no-approval-pdf');
      stats.skippedNoApprovalPdf = (stats.skippedNoApprovalPdf ?? 0) + 1;
      return { status: 'skipped-no-approval-pdf', wasUnread };
    }

    for (const part of partsToProcess) {
      let pdfBuffer = null;
      if (part?.body?.attachmentId) {
        pdfBuffer = await getAttachmentData(gmail, msg.id, part.body.attachmentId);
      }
      if (!pdfBuffer) continue;
      const partFilename = part.filename ?? '';
      await conditionParser.process({
        subject, from, body, pdfBuffer, msgId: msg.id,
        gmail, threadId: full.data.threadId, inboxLabel,
        attachmentFilename: partFilename
      });
      log(inboxLabel, msg.id, classification, `dispatched to condition-parser:${partFilename || 'pdf'}`);
      stats.dispatched++;
    }
    return { status: 'dispatched', wasUnread };

  } else if (!APPROVAL_PDF_ONLY && classification === 'PRE_APPROVAL') {
    const preApproval = require('../lib/pre-approval-handler');
    await preApproval.process({ subject, from, body });
    log(inboxLabel, msg.id, classification, 'dispatched to pre-approval-handler');
    stats.dispatched++;
    return { status: 'dispatched', wasUnread };

  } else if (!APPROVAL_PDF_ONLY && classification === 'LENDER_REQUEST') {
    const lenderRequest = require('../lib/lender-request-handler');
    await lenderRequest.process({ subject, from, body });
    log(inboxLabel, msg.id, classification, 'dispatched to lender-request-handler');
    stats.dispatched++;
    return { status: 'dispatched', wasUnread };

  } else {
    if (classification !== 'OTHER' && classification !== 'IGNORE' && classification !== 'TASK') {
      log(inboxLabel, msg.id, classification, 'skipped-approval-pdf-only');
    } else {
      log(inboxLabel, msg.id, classification, 'skipped');
    }
    stats.skippedOther++;
    return { status: 'skipped-other', wasUnread };
  }
}

async function watchInbox(account, state, cutoffMs, stats) {
  const { label, gmail } = account;
  const processedLabelId = await getProcessedLabelId(gmail, label);
  const query = buildInboxQuery(cutoffMs);
  let pageToken;
  let processedThisScan = 0;

  while (processedThisScan < MAX_TOTAL_PER_INBOX_PER_SCAN) {
    const batchSize = Math.min(
      MAX_MESSAGES_PER_INBOX,
      MAX_TOTAL_PER_INBOX_PER_SCAN - processedThisScan
    );
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      maxResults: batchSize,
      pageToken,
      q: query
    });

    const messages = listRes.data.messages ?? [];
    if (!messages.length) {
      if (processedThisScan === 0) log(label, null, null, 'no new messages');
      break;
    }

    // Gmail returns newest first; processed emails drop out via -label:mortgage-bot-processed
    for (const msg of messages) {
      const result = await processMessage(gmail, label, msg, cutoffMs, stats, processedLabelId);
      // Label in Gmail is the source of truth — excluded from future scans via -label:mortgage-bot-processed
      if (result.status !== 'skipped-cutoff' && result.status !== 'already-processed') {
        await markMessageProcessed(gmail, label, msg.id, { wasUnread: result.wasUnread });
      }
      processedThisScan += 1;
      if (processedThisScan >= MAX_TOTAL_PER_INBOX_PER_SCAN) break;
    }

    pageToken = listRes.data.nextPageToken;
    if (!pageToken) break;
  }

  if (processedThisScan > 0) {
    log(label, null, null, `processed-${processedThisScan}-this-scan`);
  }

  return state;
}

async function runScan(req) {
  const clients = getClients();
  let state = loadState();

  if (req.query?.reset === 'true') {
    state = {};
    saveState(state);
    log('system', null, null, 'state-reset-local-only');
  }

  state = ensureScanCutoff(state);
  saveState(state);

  const cutoffMs = state.scanCutoffMs;
  const results = {};
  const stats = { messages: [], dispatched: 0, skippedCutoff: 0, skippedOther: 0, dryRun: 0 };

  log('system', null, null, `scan-cutoff:${new Date(cutoffMs).toISOString()}`);

  for (const [, account] of Object.entries(clients)) {
    try {
      state = await watchInbox(account, state, cutoffMs, stats);
      results[account.label] = 'ok';
    } catch (err) {
      console.error(JSON.stringify({ ts: new Date().toISOString(), inbox: account.label, error: err.message }));
      results[account.label] = `error: ${err.message}`;
    }
  }

  saveState(state);
  const payload = {
    ok: true,
    ts: new Date().toISOString(),
    scanCutoff: new Date(cutoffMs).toISOString(),
    scanQuery: buildInboxQuery(cutoffMs),
    limits: {
      perBatch: MAX_MESSAGES_PER_INBOX,
      maxPerInboxPerScan: MAX_TOTAL_PER_INBOX_PER_SCAN,
      inboxes: Object.keys(clients).length,
      processedLabel: PROCESSED_LABEL,
      preserveUnread: PRESERVE_UNREAD,
      approvalPdfOnly: APPROVAL_PDF_ONLY
    },
    results,
    stats
  };
  console.log(JSON.stringify({ action: 'scan-complete', ...payload }));
  return payload;
}

function scheduleBackgroundScan(req) {
  const scan = runScan(req).catch(err => {
    console.error(JSON.stringify({ ts: new Date().toISOString(), action: 'scan-error', error: err.message }));
  });

  try {
    const { waitUntil } = require('@vercel/functions');
    waitUntil(scan);
  } catch {
    scan.catch(() => {});
  }
}

module.exports = async (req, res) => {
  // Render / explicit sync: wait for full scan (validator can take several minutes).
  // Vercel / cron-job.org: reply fast unless ?wait=true (background via waitUntil).
  const syncScan = req.query?.wait === 'true'
    || process.env.GMAIL_SCAN_SYNC === 'true'
    || process.env.RENDER === 'true';

  if (syncScan) {
    const payload = await runScan(req);
    return res.status(200).json(payload);
  }

  scheduleBackgroundScan(req);
  return res.status(202).json({
    ok: true,
    message: 'Scan started — check server logs for results',
    ts: new Date().toISOString()
  });
};
