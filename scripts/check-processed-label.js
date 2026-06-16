#!/usr/bin/env node
/**
 * List mortgage-bot-processed label status for John + Christy inboxes.
 * Usage: node scripts/check-processed-label.js
 */
require('dotenv').config();
const { getClients } = require('../lib/gmail-client');

const PROCESSED_LABEL = process.env.GMAIL_PROCESSED_LABEL || 'mortgage-bot-processed';

async function checkInbox(account) {
  const { label, email, gmail } = account;
  const { data } = await gmail.users.labels.list({ userId: 'me' });
  const processed = (data.labels ?? []).find(l => l.name === PROCESSED_LABEL);

  if (!processed) {
    return { label, email, exists: false, message: 'Label not created yet — bot has not marked any email on this inbox' };
  }

  const list = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 5,
    q: `label:${PROCESSED_LABEL}`
  });
  const total = list.data.resultSizeEstimate ?? (list.data.messages ?? []).length;

  return {
    label,
    email,
    exists: true,
    labelId: processed.id,
    listVisibility: processed.labelListVisibility,
    messageVisibility: processed.messageListVisibility,
    messagesTagged: total,
    sampleIds: (list.data.messages ?? []).map(m => m.id)
  };
}

async function main() {
  const clients = getClients();
  for (const account of Object.values(clients)) {
    try {
      const result = await checkInbox(account);
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.log(JSON.stringify({ label: account.label, email: account.email, error: err.message }));
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
