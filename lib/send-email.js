require('dotenv').config();
const { getClients } = require('./gmail-client');

const DRY_RUN = process.env.DRY_RUN === 'true';
const SYNC_REPLY_BODY = 'Loan conditions synced to Notion';

function getHeader(headers, name) {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';
}

async function sendToBothInboxes(subject, bodyText) {
  if (DRY_RUN) {
    console.log(JSON.stringify({
      ts: new Date().toISOString(),
      action: 'email-suppressed-dry-run',
      subject,
      preview: bodyText.slice(0, 120)
    }));
    return;
  }

  const clients = getClients();
  await Promise.all(Object.values(clients).map(async (account) => {
    try {
      const raw = Buffer.from(
        `To: ${account.email}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${bodyText}`
      ).toString('base64url');
      await account.gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
      console.log(JSON.stringify({ ts: new Date().toISOString(), action: 'email-sent', inbox: account.label, subject }));
    } catch (err) {
      console.log(JSON.stringify({ ts: new Date().toISOString(), action: 'email-error', inbox: account.label, error: err.message }));
    }
  }));
}

async function replySyncToJohnAndChristy({ gmail, msgId, threadId, subject, inboxLabel }) {
  if (!gmail || !msgId) {
    console.log(JSON.stringify({ ts: new Date().toISOString(), action: 'sync-reply-skipped', reason: 'missing-gmail-context' }));
    return;
  }

  if (DRY_RUN) {
    console.log(JSON.stringify({
      ts: new Date().toISOString(),
      action: 'sync-reply-suppressed-dry-run',
      inbox: inboxLabel,
      msgId,
      body: SYNC_REPLY_BODY
    }));
    return;
  }

  const clients = getClients();
  const to = [clients.primary.email, clients.christy.email].filter(Boolean).join(', ');

  const meta = await gmail.users.messages.get({
    userId: 'me',
    id: msgId,
    format: 'metadata',
    metadataHeaders: ['Message-ID', 'Subject']
  });
  const headers = meta.data.payload?.headers ?? [];
  const messageId   = getHeader(headers, 'Message-ID');
  const origSubject = getHeader(headers, 'Subject') || subject || '';
  const reSubject   = /^re:/i.test(origSubject) ? origSubject : `Re: ${origSubject}`;

  const lines = [
    `To: ${to}`,
    `Subject: ${reSubject}`,
    'Content-Type: text/plain; charset=utf-8'
  ];
  if (messageId) {
    lines.push(`In-Reply-To: ${messageId}`);
    lines.push(`References: ${messageId}`);
  }
  lines.push('', SYNC_REPLY_BODY);

  const raw = Buffer.from(lines.join('\r\n')).toString('base64url');
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw, threadId: threadId || meta.data.threadId }
  });
  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    action: 'sync-reply-sent',
    inbox: inboxLabel,
    msgId,
    to
  }));
}

module.exports = { sendToBothInboxes, replySyncToJohnAndChristy };