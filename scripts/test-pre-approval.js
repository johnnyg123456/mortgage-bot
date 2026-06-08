require('dotenv').config();
const { process } = require('../lib/pre-approval-handler');

process({
  subject: 'Pre-Approval for Maria Rodriguez',
  from:    'lender@bankofamerica.com',
  body:    'Please find the pre-approval documents attached for borrower Maria Rodriguez. Coverage amount: $450,000.'
}).then(() => {
  console.log('Test complete — check Notion Conditions database for pre-approval task.');
}).catch(err => {
  console.error('[ERROR]', err.message);
});
