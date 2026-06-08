// Full implementation in Step 7
async function process({ subject, from, body }) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), handler: 'correction', subject, from }));
}
module.exports = { process };
