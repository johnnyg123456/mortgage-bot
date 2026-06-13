require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const {
  parseUwmApprovalLetter,
  excludePtfConditions,
  isPtfCondition
} = require('../lib/condition-parser');

async function extractPdfText(buf) {
  const result = await pdfParse(buf);
  return result.text;
}

async function previewPdf(filePath) {
  const buf = fs.readFileSync(filePath);
  const text = await extractPdfText(buf);
  const rel = path.relative(process.cwd(), filePath);

  console.log('\n' + '='.repeat(72));
  console.log('FILE:', rel);
  console.log('TEXT LENGTH:', text.length, 'chars');
  console.log('='.repeat(72));

  const uwm = parseUwmApprovalLetter(text);
  if (uwm) {
    console.log('PARSER: UWM (structured)');
    printPreview(uwm.borrower_name, uwm.loan_number, uwm.conditions);
    return;
  }

  const { parseNewrezApprovalLetter } = require('../lib/newrez-parser');
  const newrez = parseNewrezApprovalLetter(text);
  if (newrez) {
    console.log('PARSER: Newrez (structured)');
    printPreview(newrez.borrower_name, newrez.loan_number, newrez.conditions);
    return;
  }

  console.log('PARSER: UWM not matched — showing raw text excerpt for manual review');
  console.log('\n--- TEXT PREVIEW (first 2500 chars) ---\n');
  console.log(text.slice(0, 2500));
  console.log('\n--- END EXCERPT ---');
}

function printPreview(borrower, loan, conditions) {
  console.log('\nWOULD SYNC TO NOTION:');
  console.log('  Loan #:   ', loan ?? '(not found)');
  console.log('  Borrower: ', borrower ?? '(not found)');
  console.log('  PTD conditions:', conditions.length);
  console.log('');
  conditions.forEach((c, i) => {
    console.log(`  ${i + 1}. [${c.code || '—'}] ${c.text}`);
  });
}

async function main() {
  const targets = process.argv.slice(2);
  if (!targets.length) {
    console.error('Usage: node scripts/preview-pdf.js <pdf-or-folder> [...]');
    process.exit(1);
  }

  const files = [];
  for (const t of targets) {
    const stat = fs.statSync(t);
    if (stat.isDirectory()) {
      fs.readdirSync(t).forEach(f => {
        if (f.toLowerCase().endsWith('.pdf')) files.push(path.join(t, f));
      });
    } else {
      files.push(t);
    }
  }

  for (const f of files.sort()) {
    await previewPdf(f);
  }
}

main().catch(err => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
