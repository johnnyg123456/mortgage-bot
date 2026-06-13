require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pdfParse = require('pdf-parse');
const { getClients } = require('../lib/gmail-client');
const {
  isNewrezApprovalEmail,
  extractApprovalPdfUrl,
  downloadApprovalPdf
} = require('../lib/newrez-client');

const MONTHS_BACK = Number(process.argv[2]) || 6;
const OUT_ROOT = path.join(__dirname, '..', 'samples', 'archived-approvals');
const INDEX_FILE = path.join(OUT_ROOT, '_index.json');

const APPROVAL_SUBJECT_RE = /approval|conditional\s+loan|underwriting\s+approval|loan\s+approval|approval\s+letter|approval\s+certificate|notice\s+of\s+loan/i;
const SKIP_FILENAME_RE = /invoice|receipt|credit[_\s-]?report|paystub|w[_-]?2|1099|disclosure|1003|urla|statement|flyer|qrg|questionnaire|ach[_\s-]?form|ecoa|agent[_\s-]?contact|vesting[_\s-]?form|ssa89|dataverify|mortgagee[_\s-]?clause|presale|certification|authorization|wellsfargo|vanguard|pnc_|bank[_\s-]?stmt|hoi_receipt|appraisal_inv|trans_history|free_and_clear|encrypted_|joint_account|airbnb|vacation_rental|advantages|prelim_seller|alta/i;

const APPROVAL_PDF_TEXT_RE = /CONDITIONAL LOAN APPROVAL|LOAN APPROVAL CONDITIONS|Conditional Loan Approval|APPROVAL CERTIFICATE|Notice of Conditional Loan Approval|TO CLEAR\s*#\s*PTA|Prior to Approval \(Broker|PRIOR TO DOC|Underwriting Approval Certificate/i;

const SKIP_PDF_TEXT_RE = /broker price opinion|this is not a commitment|pre-approval letter|preapproval letter/i;

const SKIP_SUBJECT_RE = /condition\(s\)\s+cleared|lock confirmation|change of circumstance|\bcoc\b|relock|rate lock/i;

const LENDER_RULES = [
  { folder: 'UWM',          from: /uwm\.com|underwriting@uwm/i, text: /LOAN APPROVAL CONDITIONS|United Wholesale Mortgage/i },
  { folder: 'acra',         from: /acralending|acra lending/i, text: /Acra Lending|Conditional Loan Approval/i },
  { folder: 'newrez',       from: /newrez|myaccount\.newrez/i, text: /CONDITIONAL LOAN APPROVAL|Newrez/i },
  { folder: 'newfi',        from: /newfi\.com|nexera holding/i, text: /Newfi Lending|APPROVAL CERTIFICATE|Nexera Holding/i },
  { folder: 'amwest',       from: /amwest|americanwest/i, text: /AmWest|American West/i },
  { folder: 'plaza',        from: /plazahomemortgage|plaza/i, text: /Plaza Home Mortgage|Plaza/i },
  { folder: 'Resicentral',  from: /resicentral/i, text: /ResiCentral|Resi Central/i },
  { folder: 'thelender',    from: /thelender\.com|@tql\.com/i, text: /The Lender|TQL/i },
  { folder: 'acra',         from: /glide-noreply@acralending/i, text: /Acra/i },
];

function formatAfterDate(monthsBack) {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsBack);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

function sanitizeFilename(s) {
  return (s ?? 'unknown')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 120);
}

function getHeader(headers, name) {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';
}

function extractPart(payload, mimeType) {
  function search(part) {
    if (part.mimeType === mimeType && part.body?.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf8');
    }
    for (const child of part.parts ?? []) {
      const r = search(child);
      if (r) return r;
    }
    return null;
  }
  return search(payload);
}

function findPdfParts(payload, found = []) {
  if (
    payload.mimeType === 'application/pdf' ||
    (payload.filename ?? '').toLowerCase().endsWith('.pdf')
  ) {
    if (payload.body?.attachmentId || payload.body?.data) found.push(payload);
  }
  for (const child of payload.parts ?? []) findPdfParts(child, found);
  return found;
}

async function getAttachmentData(gmail, msgId, attachmentId) {
  const res = await gmail.users.messages.attachments.get({
    userId: 'me', messageId: msgId, id: attachmentId
  });
  return Buffer.from(res.data.data, 'base64');
}

async function getPdfBuffer(gmail, msgId, part) {
  if (part.body?.data) {
    return Buffer.from(part.body.data, 'base64');
  }
  if (part.body?.attachmentId) {
    return getAttachmentData(gmail, msgId, part.body.attachmentId);
  }
  return null;
}

function isApprovalPdfFilename(name) {
  const n = (name ?? '').toLowerCase();
  if (!n.endsWith('.pdf')) return false;
  if (SKIP_FILENAME_RE.test(n)) return false;
  if (/pre[-\s]?approval/i.test(n)) return false;
  return /approval|conditional|underwriting|loan_approval|notice|certificate|approvalletter|broker_loan_approval|updated_approval|conditional_approval/i.test(n);
}

function isApprovalPdfContent(pdfText) {
  if (!pdfText || pdfText.length < 80) return false;
  if (SKIP_PDF_TEXT_RE.test(pdfText)) return false;
  return APPROVAL_PDF_TEXT_RE.test(pdfText);
}

function looksLikeApprovalEmail(subject, from) {
  if (SKIP_SUBJECT_RE.test(subject ?? '')) return false;
  if (isNewrezApprovalEmail(from, subject)) return true;
  return APPROVAL_SUBJECT_RE.test(subject ?? '');
}

async function detectLender(from, subject, pdfText) {
  const hay = `${from} ${subject} ${pdfText ?? ''}`;
  for (const rule of LENDER_RULES) {
    if (rule.from?.test(hay) || rule.text?.test(pdfText ?? '') || rule.text?.test(hay)) {
      return rule.folder;
    }
  }
  if (/CONDITIONAL LOAN APPROVAL/i.test(pdfText ?? '')) return 'newrez';
  if (/LOAN APPROVAL CONDITIONS/i.test(pdfText ?? '')) return 'UWM';
  if (/Conditional Loan Approval/i.test(pdfText ?? '')) return 'acra';
  if (/APPROVAL CERTIFICATE/i.test(pdfText ?? '')) return 'newfi';
  return 'other';
}

function extractLoanHint(subject, pdfText) {
  const fromSubject = subject.match(/loan\s*#?\s*(\d{6,})|(\d{6,})\s*[-–]/i);
  if (fromSubject) return fromSubject[1] || fromSubject[2];
  const fromPdf = (pdfText ?? '').match(/Loan\s*#:\s*(\d+)/i);
  return fromPdf?.[1] ?? null;
}

function loadIndex() {
  try { return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8')); }
  catch { return { saved: {}, stats: {} }; }
}

function saveIndex(index) {
  fs.mkdirSync(OUT_ROOT, { recursive: true });
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

function hashBuffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

async function savePdf({ index, lender, loanHint, subject, from, inbox, msgId, buf, sourceName }) {
  const hash = hashBuffer(buf);
  if (index.saved[hash]) return { skipped: true, reason: 'duplicate', hash };

  const dir = path.join(OUT_ROOT, lender);
  fs.mkdirSync(dir, { recursive: true });

  const date = new Date().toISOString().slice(0, 10);
  const loan = loanHint ? sanitizeFilename(loanHint) : 'unknown-loan';
  const base = sanitizeFilename(sourceName?.replace(/\.pdf$/i, '') || `${loan}_approval`);
  let filename = `${loan}_${base}_${date}.pdf`;
  let n = 1;
  while (fs.existsSync(path.join(dir, filename))) {
    filename = `${loan}_${base}_${date}_${n++}.pdf`;
  }

  const fullPath = path.join(dir, filename);
  fs.writeFileSync(fullPath, buf);

  index.saved[hash] = {
    path: path.relative(path.join(__dirname, '..'), fullPath),
    lender, loan: loanHint, subject, from, inbox, msgId, savedAt: new Date().toISOString()
  };
  index.stats[lender] = (index.stats[lender] ?? 0) + 1;
  saveIndex(index);

  return { skipped: false, path: fullPath, lender, hash };
}

async function processMessage(gmail, inbox, msgRef, index, stats) {
  const full = await gmail.users.messages.get({ userId: 'me', id: msgRef.id, format: 'full' });
  const { payload } = full.data;
  const headers = payload.headers ?? [];
  const subject = getHeader(headers, 'Subject');
  const from = getHeader(headers, 'From');
  const html = extractPart(payload, 'text/html');
  const plain = extractPart(payload, 'text/plain') ?? '';

  if (!looksLikeApprovalEmail(subject, from)) {
    stats.skippedNotApproval++;
    return;
  }

  const pdfParts = findPdfParts(payload);
  let savedAny = false;

  for (const part of pdfParts) {
    const name = part.filename ?? 'attachment.pdf';
    if (!isApprovalPdfFilename(name) && !APPROVAL_SUBJECT_RE.test(subject)) continue;

    const buf = await getPdfBuffer(gmail, msgRef.id, part);
    if (!buf || buf.slice(0, 4).toString() !== '%PDF') continue;

    let pdfText = '';
    try { pdfText = (await pdfParse(buf)).text.slice(0, 12000); } catch { /* keep going */ }

    if (!isApprovalPdfContent(pdfText) && !isNewrezApprovalEmail(from, subject)) {
      stats.skippedNotApprovalPdf++;
      continue;
    }

    const lender = await detectLender(from, subject, pdfText);
    const loanHint = extractLoanHint(subject, pdfText);
    const result = await savePdf({
      index, lender, loanHint, subject, from, inbox,
      msgId: msgRef.id, buf, sourceName: name
    });

    if (result.skipped) stats.duplicates++;
    else { stats.saved++; savedAny = true; console.log(`  + [${lender}] ${path.basename(result.path)}`); }
  }

  if (!savedAny && isNewrezApprovalEmail(from, subject)) {
    const url = extractApprovalPdfUrl(html, plain, subject);
    if (!url) { stats.newrezNoLink++; return; }
    try {
      const buf = await downloadApprovalPdf(url);
      let pdfText = '';
      try { pdfText = (await pdfParse(buf)).text.slice(0, 8000); } catch { /* ok */ }
      const loanHint = extractLoanHint(subject, pdfText);
      const result = await savePdf({
        index, lender: 'newrez', loanHint, subject, from, inbox,
        msgId: msgRef.id, buf, sourceName: `${loanHint ?? 'newrez'}_Loan_Approval.pdf`
      });
      if (result.skipped) stats.duplicates++;
      else { stats.saved++; console.log(`  + [newrez] ${path.basename(result.path)} (link)`); }
    } catch (err) {
      stats.downloadErrors++;
      console.log(`  ! Newrez download failed: ${err.message}`);
    }
  }
}

async function scanInbox(account, index) {
  const { label, gmail } = account;
  const after = formatAfterDate(MONTHS_BACK);
  const query = `after:${after} (has:attachment OR from:notify@myaccount.newrez.com)`;

  console.log(`\n=== ${label} ===`);
  console.log(`Query: ${query}`);

  const stats = {
    scanned: 0, saved: 0, duplicates: 0,
    skippedNotApproval: 0, skippedNotApprovalPdf: 0,
    newrezNoLink: 0, downloadErrors: 0
  };

  let pageToken;
  do {
    const list = await gmail.users.messages.list({
      userId: 'me', q: query, maxResults: 100, pageToken
    });
    const messages = list.data.messages ?? [];
    pageToken = list.data.nextPageToken;

    for (const msg of messages) {
      stats.scanned++;
      if (stats.scanned % 25 === 0) console.log(`  … scanned ${stats.scanned} messages`);
      await processMessage(gmail, label, msg, index, stats);
    }
  } while (pageToken);

  console.log(`Done ${label}:`, stats);
  return stats;
}

async function main() {
  fs.mkdirSync(OUT_ROOT, { recursive: true });
  const index = loadIndex();
  const clients = getClients();

  console.log(`Archiving lender approval PDFs — last ${MONTHS_BACK} months`);
  console.log(`Output: ${OUT_ROOT}`);

  const totals = { saved: 0, scanned: 0 };
  for (const account of Object.values(clients)) {
    const stats = await scanInbox(account, index);
    totals.saved += stats.saved;
    totals.scanned += stats.scanned;
  }

  saveIndex(index);
  console.log('\n=== SUMMARY ===');
  console.log('By lender:', index.stats);
  console.log(`Total saved this run: ${totals.saved}`);
  console.log(`Index: ${INDEX_FILE}`);
}

main().catch(err => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
