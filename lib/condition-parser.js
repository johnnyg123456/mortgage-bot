// Full implementation in Step 5
async function process({ subject, from, body, pdfBuffer, msgId }) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), handler: 'condition-parser', subject, msgId, hasPdf: !!pdfBuffer }));
}
module.exports = { process };
