require('dotenv').config();
const { process } = require('../lib/correction-handler');

// Test updating the status of the pre-approval task we just created
process({
  subject: 'notion agent correction',
  from:    'john@libertygroupfunding.com',
  body: `LOAN: Maria Rodriguez
CONDITION: Pre-Approval Documents Received
ACTION: update_status
NEW_STATUS: In Progress`
}).then(() => {
  console.log('Correction test complete — check Notion and corrections.json.');
}).catch(err => {
  console.error('[ERROR]', err.message);
});
