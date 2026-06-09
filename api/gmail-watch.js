require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const { getClients }  = require('../lib/gmail-client');
const { classify }    = require('../lib/email-classifier');

const DRY_RUN = process.env.DRY_RUN === 'true';
const MAX_MESSAGES_PER_INBOX = 3;
const SCAN_TIMEZONE = process.env.GMAIL_SCAN_TIMEZONE || 'America/New_York';

// Vercel serverless: only /tmp is writable; fall back to local path for dev
const STATE_FILE = process.env.VERCEL
  ? '/tmp/.gmail-state.json'
  : path.join(__dirname, '..', '.gmail-state.json');

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

function ensureScanCutoff(state) {
  if (process.env.GMAIL_SCAN_AFTER) {
    state.scanCutoffMs = Date.parse(process.env.GMAIL_SCAN_AFTER);
    return state;
  }
  if (!state.scanCutoffMs) {
    state.scanCutoffMs = Date.now();
  }
  return state;
}

function buildInboxQuery(cutoffMs) {
  return `in:inbox after:${formatGmailAfterDate(cutoffMs)}`;
}

function extractBody(payload) {
  // Recursively search all parts for text/plain content
  function search(part) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf8');
    }
    for (const child of part.parts ?? []) {
      const result = search(child);
      if (result) return result;
    }
    return null;
  }
  return search(payload) ?? '';
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

function findPdfPart(payload) {
  function search(part) {
    if (
      part.mimeType === 'application/pdf' ||
      (part.filename ?? '').toLowerCase().endsWith('.pdf')
    ) return part;
    for (const child of part.parts ?? []) {
      const found = search(child);
      if (found) return found;
    }
    return null;
  }
  return search(payload);
}

async function getAttachmentData(gmail, msgId, attachmentId) {
  const res = await gmail.users.messages.attachments.get({
    userId: 'me', messageId: msgId, id: attachmentId
  });
  return Buffer.from(res.data.data, 'base64');
}

async function processMessage(gmail, inboxLabel, msg, cutoffMs) {
  const full = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' });
  if (Number(full.data.internalDate) < cutoffMs) {
    log(inboxLabel, msg.id, null, 'skipped-before-cutoff');
    return;
  }
  const { payload } = full.data;
  const headers = payload.headers ?? [];
  const subject = getHeader(headers, 'subject');
  const from    = getHeader(headers, 'from');
  const body    = extractBody(payload);
  const hasPDF  = hasPdf(payload);

  const classification = classify(subject, body);
  log(inboxLabel, msg.id, classification, 'classified');

  // Dry run — log only, no handler dispatch
  if (DRY_RUN) {
    log(inboxLabel, msg.id, classification, 'dry-run-skipped');
    return;
  }

  if (classification === 'CONDITION_LIST') {
    const conditionParser = require('../lib/condition-parser');
    let pdfBuffer = null;
    if (hasPDF) {
      const pdfPart = findPdfPart(payload);
      if (pdfPart?.body?.attachmentId) {
        pdfBuffer = await getAttachmentData(gmail, msg.id, pdfPart.body.attachmentId);
      }
    }
    await conditionParser.process({ subject, from, body, pdfBuffer, msgId: msg.id });
    log(inboxLabel, msg.id, classification, 'dispatched to condition-parser');

  } else if (classification === 'PRE_APPROVAL') {
    const preApproval = require('../lib/pre-approval-handler');
    await preApproval.process({ subject, from, body });
    log(inboxLabel, msg.id, classification, 'dispatched to pre-approval-handler');

  } else if (classification === 'CORRECTION') {
    const correction = require('../lib/correction-handler');
    await correction.process({ subject, from, body });
    log(inboxLabel, msg.id, classification, 'dispatched to correction-handler');

  } else {
    log(inboxLabel, msg.id, classification, 'skipped');
  }
}

async function watchInbox(account, state, cutoffMs) {
  const { label, gmail } = account;
  const lastId = state[label] ?? null;

  const listRes = await gmail.users.messages.list({
    userId:   'me',
    maxResults: 10,
    q: buildInboxQuery(cutoffMs)
  });

  const messages = listRes.data.messages ?? [];
  if (!messages.length) {
    log(label, null, null, 'no new messages');
    return state;
  }

  const newMessages = lastId
    ? messages.filter(m => m.id > lastId)
    : messages;

  const toProcess = newMessages.reverse().slice(0, MAX_MESSAGES_PER_INBOX);
  for (const msg of toProcess) {
    await processMessage(gmail, label, msg, cutoffMs);
    state[label] = msg.id;
    saveState(state);
  }

  return state;
}

module.exports = async (req, res) => {
  const clients = getClients();
  let state = loadState();
  state = ensureScanCutoff(state);
  saveState(state);

  const cutoffMs = state.scanCutoffMs;
  const results = {};

  log('system', null, null, `scan-cutoff:${new Date(cutoffMs).toISOString()}`);

  for (const [key, account] of Object.entries(clients)) {
    try {
      state = await watchInbox(account, state, cutoffMs);
      results[account.label] = 'ok';
    } catch (err) {
      console.error(JSON.stringify({ ts: new Date().toISOString(), inbox: account.label, error: err.message }));
      results[account.label] = `error: ${err.message}`;
    }
  }

  saveState(state);
  return res.status(200).json({
    ok: true,
    ts: new Date().toISOString(),
    scanCutoff: new Date(cutoffMs).toISOString(),
    scanQuery: buildInboxQuery(cutoffMs),
    results
  });
};
