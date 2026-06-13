require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { parseUwmApprovalLetter } = require('../lib/condition-parser');
const { parseNewrezApprovalLetter } = require('../lib/newrez-parser');
const { parseAcraApprovalLetter } = require('../lib/acra-parser');
const { parseNationsDirectApproval } = require('../lib/nations-direct-parser');

const SAMPLES = [
  ['UWM',         'samples/archived-approvals/UWM/unknown-loan_ApprovalLetter1226125243_2026-06-11.pdf'],
  ['Newrez',      'samples/archived-approvals/newrez/9758676861_9758676861_Loan_Approval_2026-06-11.pdf'],
  ['Acra',        'samples/archived-approvals/acra/7517183_Acra_-_Approval_2026-06-11.pdf'],
  ['Nations Direct', 'samples/archived-approvals/Nations Direct/8010187958_Broker_Loan_Approval_2026-06-11.pdf']
];

const PARSERS = [
  ['UWM', parseUwmApprovalLetter],
  ['Newrez', parseNewrezApprovalLetter],
  ['Acra', parseAcraApprovalLetter],
  ['Nations Direct', parseNationsDirectApproval]
];

async function parsePdf(filePath) {
  const text = (await pdfParse(fs.readFileSync(filePath))).text;
  for (const [, fn] of PARSERS) {
    const result = fn(text);
    if (result) return result;
  }
  return null;
}

function printResult(lender, filePath, parsed) {
  console.log('\n' + '='.repeat(72));
  console.log(`${lender} | ${path.basename(filePath)}`);
  console.log('='.repeat(72));

  if (!parsed) {
    console.log('NO PARSE');
    return;
  }

  console.log(`Loan: ${parsed.loan_number ?? '—'} | Borrower: ${parsed.borrower_name ?? '—'}`);
  console.log(`Open: ${parsed.conditions.length}` +
    (parsed.cleared_conditions?.length ? ` | Cleared: ${parsed.cleared_conditions.length}` : ''));

  parsed.conditions.forEach((c, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. ${c.text.slice(0, 110)}`);
  });

  if (parsed.cleared_conditions?.length) {
    console.log('  --- cleared (removed from Notion) ---');
    parsed.cleared_conditions.forEach((c, i) => {
      console.log(`  C${i + 1}. [${c.cleared_date}] ${c.text.slice(0, 90)}`);
    });
  }
}

async function main() {
  for (const [lender, rel] of SAMPLES) {
    const filePath = path.join(process.cwd(), rel);
    if (!fs.existsSync(filePath)) {
      console.log(`\nMISSING: ${rel}`);
      continue;
    }
    const parsed = await parsePdf(filePath);
    printResult(lender, filePath, parsed);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
