require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { parseUwmApprovalLetter } = require('../lib/condition-parser');
const { parseNewrezApprovalLetter } = require('../lib/newrez-parser');
const { parseAcraApprovalLetter } = require('../lib/acra-parser');
const { parseNationsDirectApproval } = require('../lib/nations-direct-parser');
const { parseArcApprovalLetter } = require('../lib/arc-parser');
const { parseOpenConditionsApproval } = require('../lib/open-conditions-parser');
const { parseCakeApprovalLetter } = require('../lib/cake-parser');
const { parseAmwestApprovalLetter } = require('../lib/amwest-parser');
const { parseTheloanstoreApprovalLetter } = require('../lib/theloanstore-parser');
const { parseThelenderApprovalLetter } = require('../lib/thelender-parser');
const { parseBluepointApprovalLetter } = require('../lib/bluepoint-parser');
const { parseFundloansApprovalLetter } = require('../lib/fundloans-parser');
const { parseOrionApprovalLetter } = require('../lib/orion-parser');

const SKIP = new Set(['other']);
const ONLY = new Set(process.argv.slice(2));
const ROOT = path.join(__dirname, '..', 'samples', 'archived-approvals');

const PARSERS = [
  ['UWM', parseUwmApprovalLetter],
  ['Newrez', parseNewrezApprovalLetter],
  ['Acra', parseAcraApprovalLetter],
  ['Nations Direct', parseNationsDirectApproval],
  ['Arc', parseArcApprovalLetter],
  ['OpenConditions', parseOpenConditionsApproval],
  ['Cake', parseCakeApprovalLetter],
  ['AmWest', parseAmwestApprovalLetter],
  ['Theloanstore', parseTheloanstoreApprovalLetter],
  ['TheLender', parseThelenderApprovalLetter],
  ['Bluepoint', parseBluepointApprovalLetter],
  ['Fundloans', parseFundloansApprovalLetter],
  ['Orion', parseOrionApprovalLetter],
];

async function testFolder(folder, stats) {
  const dir = path.join(ROOT, folder);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf')).sort();
  console.log(`\n### ${folder} (${files.length} PDFs) ###`);

  for (const f of files) {
    const fp = path.join(dir, f);
    const text = (await pdfParse(fs.readFileSync(fp))).text;
    let matched = null;

    for (const [name, fn] of PARSERS) {
      const r = fn(text);
      if (r) {
        matched = { name, r };
        break;
      }
    }

    if (matched) {
      stats.parsed++;
      const { name, r } = matched;
      console.log(`  OK [${name}] ${f}`);
      console.log(`     Loan: ${r.loan_number ?? '—'} | Borrower: ${r.borrower_name ?? '—'} | Open: ${r.conditions.length}`);
      r.conditions.slice(0, 5).forEach((c, i) => {
        console.log(`     ${i + 1}. ${c.text.slice(0, 90)}`);
      });
      if (r.conditions.length > 5) console.log(`     ... +${r.conditions.length - 5} more`);
    } else {
      stats.failed++;
      const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 150);
      console.log(`  NO PARSE ${f}`);
      console.log(`     Text: ${snippet}...`);
    }
  }
}

async function main() {
  const stats = { parsed: 0, failed: 0 };

  const folders = fs.readdirSync(ROOT)
    .filter(f => {
      const p = path.join(ROOT, f);
      if (!fs.statSync(p).isDirectory() || SKIP.has(f)) return false;
      if (ONLY.size) return ONLY.has(f);
      return true;
    })
    .sort();

  for (const folder of folders) await testFolder(folder, stats);

  console.log(`\n${'='.repeat(72)}`);
  console.log(`SUMMARY: ${stats.parsed} parsed, ${stats.failed} no parse`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
