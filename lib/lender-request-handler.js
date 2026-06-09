require('dotenv').config();
const { queryDatabase, createPage } = require('./notion-client');
const { sendToBothInboxes } = require('./send-email');

const LOANS_DB      = process.env.NOTION_LOANS_DB_ID;
const CONDITIONS_DB = process.env.NOTION_CONDITIONS_DB_ID;

function log(action, detail) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), handler: 'lender-request', action, ...detail }));
}

function extractLoanFromSubject(subject) {
  const trimmed = (subject ?? '').trim();

  const nameFirst = trimmed.match(/^(.+?)\s*[-–]\s*(\d{6,})\s*$/);
  if (nameFirst) return { borrower: nameFirst[1].trim(), loanNumber: nameFirst[2] };

  const loanFirst = trimmed.match(/^(\d{6,})\s*[-–]\s*(.+)$/);
  if (loanFirst) return { borrower: loanFirst[2].trim(), loanNumber: loanFirst[1] };

  const loanInSubject = trimmed.match(/\b(\d{6,})\b/);
  if (loanInSubject) {
    const borrower = trimmed.replace(loanInSubject[0], '').replace(/[-–]/g, ' ').trim() || null;
    return { borrower, loanNumber: loanInSubject[1] };
  }

  return {};
}

function extractSenderName(from) {
  const m = (from ?? '').match(/^([^<]+)</);
  return m ? m[1].trim().replace(/"/g, '') : (from ?? '').split('@')[0];
}

function detectSource(body, from) {
  const text = `${body} ${from}`.toLowerCase();
  if (text.includes('underwriter')) return 'Underwriter';
  if (text.includes('account manager') || text.includes('account executive')) return 'Lender';
  return 'Underwriter';
}

function extractRequestText(body) {
  const lines = (body ?? '').split('\n').map(l => l.trim()).filter(Boolean);
  const content = [];

  for (const line of lines) {
    if (/^(hello|hi|good morning|good afternoon|dear)\b/i.test(line)) continue;
    if (/^(thank|thanks|regards|sincerely|best|have a great|description automatically)/i.test(line)) break;
    if (/underwriter|account manager|account executive|processor|production partner/i.test(line) && line.length < 80) break;
    if (/@[a-z0-9.-]+\.[a-z]{2,}/i.test(line)) break;
    if (/^www\./i.test(line)) break;
    if (/^\d{3}[)\s.-]?\s*\d{3}[)\s.-]?\d{4}/.test(line)) break;
    if (line.length > 8) content.push(line);
  }

  const text = content.join(' ').replace(/\s+/g, ' ').trim();
  return text.slice(0, 500) || 'Lender request — see email';
}

function buildConditionTitle(borrower, requestText) {
  const cleaned = requestText
    .replace(/^the only item we need is (the )?/i, '')
    .replace(/\.\s*can you.*/i, '')
    .replace(/\.\s*please.*/i, '')
    .trim();

  const title = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  if (borrower) return `${borrower} — ${title}`;
  return title;
}

async function findLoan(borrowerName, loanNumber) {
  if (loanNumber) {
    const r = await queryDatabase(LOANS_DB, {
      property: 'Loan ID', rich_text: { equals: loanNumber }
    });
    if (r.results.length) return r.results[0];
  }

  if (borrowerName) {
    const r = await queryDatabase(LOANS_DB, {
      property: 'Borrower Name', title: { contains: borrowerName }
    });
    if (r.results.length) return r.results[0];

    const parts = borrowerName.trim().split(/\s+/);
    if (parts.length >= 2) {
      const byLast = await queryDatabase(LOANS_DB, {
        property: 'Borrower Name', title: { contains: parts[parts.length - 1] }
      });
      if (byLast.results.length === 1) return byLast.results[0];
    }
  }

  return null;
}

async function conditionExists(loanPageId, conditionText) {
  const filter = loanPageId
    ? { and: [
        { property: 'Loan', relation: { contains: loanPageId } },
        { property: 'Condition', title: { equals: conditionText } }
      ]}
    : { property: 'Condition', title: { equals: conditionText } };

  const r = await queryDatabase(CONDITIONS_DB, filter);
  return r.results.length > 0;
}

async function sendNotification({ borrower, loanNumber, conditionTitle, senderName }) {
  const subject = `[Mortgage Bot] URGENT — ${conditionTitle}`;
  const bodyText = [
    'A lender employee emailed a direct urgent request. A task was created in Notion.',
    '',
    `Borrower: ${borrower ?? 'Unknown'}`,
    `Loan: ${loanNumber ?? 'Unknown'}`,
    `From: ${senderName ?? 'Unknown'}`,
    `Request: ${conditionTitle}`,
    'Urgent: Yes',
    'Status: Open'
  ].join('\n');
  await sendToBothInboxes(subject, bodyText);
}

async function handle({ subject, from, body }) {
  log('start', { subject, from });

  const { borrower, loanNumber } = extractLoanFromSubject(subject);
  const requestText = extractRequestText(body);
  const conditionTitle = buildConditionTitle(borrower, requestText);
  const source = detectSource(body, from);
  const senderName = extractSenderName(from);

  log('parsed', { borrower, loanNumber, conditionTitle, source, senderName });

  const loan = await findLoan(borrower, loanNumber);
  if (!loan) log('loan-not-found', { borrower, loanNumber });

  if (loan && await conditionExists(loan.id, conditionTitle)) {
    log('skipped-duplicate', { conditionTitle });
    return;
  }

  const properties = {
    'Condition':  { title:    [{ text: { content: conditionTitle } }] },
    'Status':     { select:   { name: 'Open' } },
    'Source':     { select:   { name: source } },
    'Urgent':     { checkbox: true },
    'Date Added': { date:     { start: new Date().toISOString().split('T')[0] } }
  };
  if (loan) properties['Loan'] = { relation: [{ id: loan.id }] };

  try {
    await createPage(CONDITIONS_DB, properties);
  } catch (err) {
    if (properties.Urgent && /urgent/i.test(err.message)) {
      log('urgent-field-missing', { error: err.message });
      const { Urgent, ...withoutUrgent } = properties;
      await createPage(CONDITIONS_DB, withoutUrgent);
    } else {
      throw err;
    }
  }
  log('notion-created', { conditionTitle, loanLinked: !!loan, urgent: true });

  await sendNotification({ borrower, loanNumber, conditionTitle, senderName });
  log('done', { conditionTitle });
}

module.exports = {
  process: handle,
  extractLoanFromSubject,
  extractRequestText,
  buildConditionTitle
};
