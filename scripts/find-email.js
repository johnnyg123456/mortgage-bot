#!/usr/bin/env node
/** Find a specific email in John/Christy inboxes and show how the bot would classify it. */
require('dotenv').config();
const { getClients } = require('../lib/gmail-client');
const { classify } = require('../lib/email-classifier');

const q = process.argv[2] || '1226351896 Bujalski';

function getHeader(headers, name) {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';
}

function hasPdf(payload) {
  function search(part) {
    if (part.mimeType === 'application/pdf' || (part.filename ?? '').toLowerCase().endsWith('.pdf')) return true;
    return (part.parts ?? []).some(search);
  }
  return search(payload);
}

function listAttachments(payload, out = []) {
  if (payload.filename) {
    out.push({ filename: payload.filename, mimeType: payload.mimeType });
  }
  for (const p of payload.parts ?? []) listAttachments(p, out);
  return out;
}

function extractBody(payload) {
  function search(part) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf8');
    }
    for (const child of part.parts ?? []) {
      const r = search(child);
      if (r) return r;
    }
    return '';
  }
  return search(payload);
}

async function inspect(account) {
  const { label, email, gmail } = account;
  const list = await gmail.users.messages.list({ userId: 'me', maxResults: 5, q: q });
  const ids = list.data.messages ?? [];
  if (!ids.length) {
    console.log(JSON.stringify({ label, email, found: false }));
    return;
  }

  for (const { id } of ids) {
    const full = await gmail.users.messages.get({ userId: 'me', id, format: 'full' });
    const payload = full.data.payload;
    const subject = getHeader(payload.headers, 'subject');
    const from = getHeader(payload.headers, 'from');
    const body = extractBody(payload);
    const pdf = hasPdf(payload);
    const attachments = listAttachments(payload);
    const labelIds = full.data.labelIds ?? [];
    const processed = labelIds.some(l => l.startsWith('Label_'));

    console.log(JSON.stringify({
      label,
      email,
      msgId: id,
      subject,
      from,
      internalDate: new Date(Number(full.data.internalDate)).toISOString(),
      hasPdf: pdf,
      attachments,
      labelIds,
      classified: classify(subject, body, { hasPdf: pdf, from }),
      bodyPreview: body.slice(0, 400),
      hasProcessedLabel: labelIds.length > 0
    }, null, 2));
  }
}

(async () => {
  for (const account of Object.values(getClients())) {
    await inspect(account);
  }
})().catch(err => {
  console.error(err.message);
  process.exit(1);
});
