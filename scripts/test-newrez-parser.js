require('dotenv').config();
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { parseNewrezApprovalLetter } = require('../lib/newrez-parser');

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('Usage: node scripts/test-newrez-parser.js <path-to-pdf>');
  process.exit(1);
}

(async () => {
  const buf = fs.readFileSync(pdfPath);
  const { text } = await pdfParse(buf);
  const parsed = parseNewrezApprovalLetter(text);

  if (!parsed) {
    console.error('Newrez parser returned null.');
    process.exit(1);
  }

  console.log(`Borrower: ${parsed.borrower_name}`);
  console.log(`Loan #:   ${parsed.loan_number}`);
  console.log(`Conditions (${parsed.conditions.length}):\n`);

  const bySection = {};
  for (const c of parsed.conditions) {
    bySection[c.section] = (bySection[c.section] ?? 0) + 1;
  }
  console.log('By section:', bySection, '\n');

  parsed.conditions.forEach((c, i) => {
    console.log(`${i + 1}. [${c.section}] ${c.text.slice(0, 100)}${c.text.length > 100 ? '...' : ''}`);
  });
})().catch(err => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
