// Full implementation in Step 6
async function process({ subject, from, body }) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), handler: 'pre-approval', subject, from }));
}
module.exports = { process };
