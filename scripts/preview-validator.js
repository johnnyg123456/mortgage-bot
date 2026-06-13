/**
 * Dry-run validator against archived approval PDFs (no Notion writes).
 *
 * Usage:
 *   node scripts/preview-validator.js [lender-folder]
 *   VALIDATOR_ENABLED=true node scripts/preview-validator.js UWM
 */
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { validateConditions, applyRulesFilter } = require('../lib/condition-validator');
const { excludePtfConditions, isPtfCondition } = require('../lib/condition-parser');

const ROOT = path.join(__dirname, '..', 'samples', 'archived-approvals');
const ONLY = process.argv[2];

const PARSERS = [
  ['UWM', () => require('../lib/condition-parser').parseUwmApprovalLetter],
  ['Newrez', () => require('../lib/newrez-parser').parseNewrezApprovalLetter],
  ['Acra', () => require('../lib/acra-parser').parseAcraApprovalLetter],
  ['Nations Direct', () => require('../lib/nations-direct-parser').parseNationsDirectApproval],
  ['Arc', () => require('../lib/arc-parser').parseArcApprovalLetter],
  ['Emporium/ResiCentral', () => require('../lib/open-conditions-parser').parseOpenConditionsApproval],
  ['Cake', () => require('../lib/cake-parser').parseCakeApprovalLetter],
  ['AmWest', () => require('../lib/amwest-parser').parseAmwestApprovalLetter],
  ['The Loan Store', () => require('../lib/theloanstore-parser').parseTheloanstoreApprovalLetter],
  ['The Lender', () => require('../lib/thelender-parser').parseThelenderApprovalLetter],
  ['Bluepoint', () => require('../lib/bluepoint-parser').parseBluepointApprovalLetter],
  ['Fundloans', () => require('../lib/fundloans-parser').parseFundloansApprovalLetter],
  ['Orion', () => require('../lib/orion-parser').parseOrionApprovalLetter]
];

function parsePdfText(text) {
  for (const [name, fn] of PARSERS) {
    const r = fn()(text);
    if (r) return { parser: name, parsed: r };
  }
  return null;
}

async function previewPdf(absPath, lender) {
  const text = (await pdfParse(fs.readFileSync(absPath))).text;
  const hit = parsePdfText(text);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${lender} / ${path.basename(absPath)}`);

  if (!hit) {
    console.log('  NO PARSE');
    return;
  }

  const { parser, parsed } = hit;
  const raw = (parsed.conditions ?? []).map(c => ({
    code: c.code ?? null,
    category: c.category ?? null,
    section: c.section ?? null,
    text: c.text,
    needs_review: c.needs_review ?? false
  }));
  const toAdd = excludePtfConditions(raw);
  const toClear = (parsed.cleared_conditions ?? []).map(c => ({
    code: c.code ?? null,
    category: c.category ?? null,
    section: c.section ?? null,
    text: c.text,
    needs_review: c.needs_review ?? false
  }));
  const excluded = raw.filter(c => isPtfCondition(c));

  console.log(`  Parser: ${parser}`);
  console.log(`  Borrower: ${parsed.borrower_name ?? '—'}  Loan: ${parsed.loan_number ?? '—'}`);
  console.log(`  Parsed: ${raw.length}  PTF excluded: ${excluded.length}  To validate: ${toAdd.length} add / ${toClear.length} clear`);

  const rulesOnly = applyRulesFilter(toAdd, []);
  console.log(`  Rules filter: ${rulesOnly.validatedAdd.length} pass, ${rulesOnly.ignored.length} ignored`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('  Skipping AI validator — ANTHROPIC_API_KEY not set');
    return;
  }

  const validation = await validateConditions({
    rawPdfText: text,
    conditionsToAdd: toAdd,
    conditionsToClear: toClear,
    existingNotionConditions: [],
    borrowerName: parsed.borrower_name,
    loanNumber: parsed.loan_number,
    subject: path.basename(absPath)
  });

  console.log(`  Outcome: ${validation.outcome}  Votes: ${validation.votes}/3  Confidence: ${(validation.confidence * 100).toFixed(0)}%`);
  console.log(`  Approved: ${validation.validatedAdd.length} add, ${validation.validatedClear.length} clear, ${validation.ignored.length} ignored`);
  if (validation.checkerResults?.length) {
    validation.checkerResults.forEach(c => {
      console.log(`    ${c.checker}: ${c.approved ? 'APPROVE' : 'REJECT'} (${((c.confidence || 0) * 100).toFixed(0)}%)`);
    });
  }
  if (validation.issues.length) {
    console.log('  Issues:');
    validation.issues.forEach(i => console.log(`    • ${i}`));
  }
}

async function main() {
  const folders = fs.readdirSync(ROOT)
    .filter(f => {
      const p = path.join(ROOT, f);
      return fs.statSync(p).isDirectory() && f !== 'other' && (!ONLY || f === ONLY);
    })
    .sort();

  if (!folders.length) {
    console.error('No lender folders found');
    process.exit(1);
  }

  console.log(`Preview validator — ${folders.join(', ')}`);

  for (const folder of folders) {
    const dir = path.join(ROOT, folder);
    const pdfs = fs.readdirSync(dir).filter(f => f.endsWith('.pdf')).sort();
    for (const f of pdfs.slice(0, 2)) {
      await previewPdf(path.join(dir, f), folder);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
