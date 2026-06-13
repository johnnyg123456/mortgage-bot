/**
 * Run 3-checker validator on all archived approval PDFs (no Notion writes).
 *
 * Usage: node scripts/batch-validator-training.js [--limit N] [--rules-only]
 * Output: samples/archived-approvals/_validator-training-results.md
 */
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');

// Load Anthropic key before validator module initializes
if (!process.env.ANTHROPIC_API_KEY) {
  for (const rel of ['notionagent', 'Emailmonitoragent']) {
    const p = path.join(__dirname, '..', '..', rel, '.env');
    if (fs.existsSync(p)) {
      require('dotenv').config({ path: p, quiet: true, override: false });
      if (process.env.ANTHROPIC_API_KEY) break;
    }
  }
}

const pdfParse = require('pdf-parse');
const { validateConditions, applyRulesFilter } = require('../lib/condition-validator');
const { excludePtfConditions, isPtfCondition } = require('../lib/condition-parser');

const ROOT = path.join(__dirname, '..', 'samples', 'archived-approvals');
const OUT = path.join(ROOT, '_validator-training-results.md');
const SKIP = new Set(['other']);

const limitArg = process.argv.find((a, i) => process.argv[i - 1] === '--limit');
const LIMIT = limitArg ? parseInt(limitArg, 10) : Infinity;
const RULES_ONLY = process.argv.includes('--rules-only');
const ONLY_FOLDERS = process.argv.includes('--only')
  ? new Set(process.argv[process.argv.indexOf('--only') + 1].split(',').map(s => s.trim().toLowerCase()))
  : null;

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

function esc(s) {
  return String(s).replace(/\r?\n/g, ' ').trim();
}

async function processPdf(absPath, lender) {
  const basename = path.basename(absPath);
  const text = (await pdfParse(fs.readFileSync(absPath))).text;
  const hit = parsePdfText(text);

  if (!hit) {
    return {
      lender,
      file: basename,
      status: 'no_parse',
      parser: null,
      borrower: null,
      loan: null,
      parsed: 0,
      ptfExcluded: 0,
      toAdd: 0,
      toClear: 0,
      outcome: null,
      votes: null,
      confidence: null,
      approvedAdd: 0,
      approvedClear: 0,
      ignored: 0,
      checkers: [],
      issues: [],
      addItems: [],
      clearItems: [],
      ignoredItems: []
    };
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
  const ptfExcluded = raw.filter(c => isPtfCondition(c)).length;

  const rulesOnly = applyRulesFilter(toAdd, []);

  if (RULES_ONLY || !process.env.ANTHROPIC_API_KEY) {
    return {
      lender,
      file: basename,
      status: 'rules_only',
      parser,
      borrower: parsed.borrower_name,
      loan: parsed.loan_number,
      parsed: raw.length,
      ptfExcluded,
      toAdd: toAdd.length,
      toClear: toClear.length,
      outcome: 'rules_only',
      votes: null,
      confidence: 1,
      approvedAdd: rulesOnly.validatedAdd.length,
      approvedClear: toClear.length,
      ignored: rulesOnly.ignored.length + ptfExcluded,
      checkers: [{ checker: 'Checker C (rules)', approved: true, confidence: 1 }],
      issues: !process.env.ANTHROPIC_API_KEY ? ['ANTHROPIC_API_KEY not set — AI checkers skipped'] : [],
      addItems: rulesOnly.validatedAdd.map(c => c.text),
      clearItems: toClear.map(c => c.text),
      ignoredItems: rulesOnly.ignored.map(c => `${c.text} (${c.reason})`)
    };
  }

  const validation = await validateConditions({
    rawPdfText: text,
    conditionsToAdd: toAdd,
    conditionsToClear: toClear,
    existingNotionConditions: [],
    borrowerName: parsed.borrower_name,
    loanNumber: parsed.loan_number,
    subject: basename
  });

  return {
    lender,
    file: basename,
    status: 'validated',
    parser,
    borrower: parsed.borrower_name,
    loan: parsed.loan_number,
    parsed: raw.length,
    ptfExcluded,
    toAdd: toAdd.length,
    toClear: toClear.length,
    outcome: validation.outcome,
    votes: validation.votes,
    confidence: validation.confidence,
    approvedAdd: validation.proceed ? validation.validatedAdd.length : validation.proposedAdd?.length ?? 0,
    approvedClear: validation.proceed ? validation.validatedClear.length : validation.proposedClear?.length ?? 0,
    ignored: validation.ignored.length,
    checkers: (validation.checkerResults || []).map(c => ({
      checker: c.checker,
      approved: c.approved,
      confidence: c.confidence
    })),
    issues: validation.issues,
    addItems: (validation.proceed ? validation.validatedAdd : validation.proposedAdd || []).map(c => c.text),
    clearItems: (validation.proceed ? validation.validatedClear : validation.proposedClear || []).map(c => c.text),
    ignoredItems: validation.ignored.map(c => `${c.text} (${c.reason})`)
  };
}

function buildReport(results) {
  const lines = [];
  lines.push('# Validator training results — archived approvals');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Mode: ${RULES_ONLY || !process.env.ANTHROPIC_API_KEY ? 'rules-only (Checker C)' : 'full 3-checker ensemble'}`);
  lines.push(`PDFs processed: ${results.length}`);
  lines.push('');

  const parsed = results.filter(r => r.status !== 'no_parse');
  const noParse = results.filter(r => r.status === 'no_parse');
  const auto = results.filter(r => r.outcome === 'auto_approved');
  const dissent = results.filter(r => r.outcome === 'approved_with_dissent');
  const held = results.filter(r => r.outcome === 'held_for_review');
  const rulesOnly = results.filter(r => r.outcome === 'rules_only');

  lines.push('## Summary');
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total PDFs | ${results.length} |`);
  lines.push(`| Parsed | ${parsed.length} |`);
  lines.push(`| No parse | ${noParse.length} |`);
  if (!RULES_ONLY && process.env.ANTHROPIC_API_KEY) {
    lines.push(`| 3/3 auto-approved | ${auto.length} |`);
    lines.push(`| 2/3 approved with dissent | ${dissent.length} |`);
    lines.push(`| 0–1/3 held for review | ${held.length} |`);
  } else {
    lines.push(`| Rules-only pass | ${rulesOnly.length} |`);
  }
  lines.push('');

  lines.push('## Quick index');
  lines.push('');
  lines.push('| Lender | PDF | Parser | Outcome | Votes | Add | Clear | Ignored |');
  lines.push('|--------|-----|--------|---------|-------|-----|-------|---------|');
  for (const r of results) {
    const short = r.file.length > 40 ? r.file.slice(0, 37) + '...' : r.file;
    lines.push(`| ${r.lender} | ${short} | ${r.parser ?? '—'} | ${r.outcome ?? 'no_parse'} | ${r.votes ?? '—'} | ${r.approvedAdd} | ${r.approvedClear} | ${r.ignored} |`);
  }
  lines.push('');

  for (const r of results) {
    lines.push(`## ${r.lender} — ${r.file}`);
    lines.push('');
    if (r.status === 'no_parse') {
      lines.push('**Status:** NO PARSE');
      lines.push('');
      lines.push('---');
      lines.push('');
      continue;
    }
    lines.push(`- **Parser:** ${r.parser}`);
    lines.push(`- **Borrower:** ${r.borrower ?? '—'}`);
    lines.push(`- **Loan #:** ${r.loan ?? '—'}`);
    lines.push(`- **Parsed conditions:** ${r.parsed} (${r.ptfExcluded} PTF excluded)`);
    lines.push(`- **Outcome:** ${r.outcome}${r.votes != null ? ` (${r.votes}/3 votes, ${((r.confidence || 0) * 100).toFixed(0)}% confidence)` : ''}`);
    lines.push('');

    if (r.checkers.length) {
      lines.push('**Checker votes:**');
      for (const c of r.checkers) {
        lines.push(`- ${c.checker}: ${c.approved ? 'APPROVE' : 'REJECT'} (${((c.confidence || 0) * 100).toFixed(0)}%)`);
      }
      lines.push('');
    }

    if (r.issues.length) {
      lines.push('**Issues:**');
      r.issues.forEach(i => lines.push(`- ${esc(i)}`));
      lines.push('');
    }

    lines.push(`**Approved ADD (${r.addItems.length}):**`);
    if (!r.addItems.length) lines.push('_None_');
    else r.addItems.forEach((t, i) => lines.push(`${i + 1}. ${esc(t)}`));
    lines.push('');

    lines.push(`**Approved CLEAR (${r.clearItems.length}):**`);
    if (!r.clearItems.length) lines.push('_None_');
    else r.clearItems.forEach((t, i) => lines.push(`${i + 1}. ${esc(t)}`));
    lines.push('');

    if (r.ignoredItems.length) {
      lines.push(`**Ignored (${r.ignoredItems.length}):**`);
      r.ignoredItems.forEach((t, i) => lines.push(`${i + 1}. ${esc(t)}`));
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const folders = fs.readdirSync(ROOT)
    .filter(f => {
      const p = path.join(ROOT, f);
      if (!fs.statSync(p).isDirectory() || SKIP.has(f)) return false;
      if (ONLY_FOLDERS && !ONLY_FOLDERS.has(f.toLowerCase())) return false;
      return true;
    })
    .sort();

  const allPdfs = [];
  for (const folder of folders) {
    const dir = path.join(ROOT, folder);
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.pdf')).sort()) {
      allPdfs.push({ folder, abs: path.join(dir, f) });
    }
  }

  const toRun = allPdfs.slice(0, LIMIT);
  console.log(`Processing ${toRun.length}/${allPdfs.length} PDFs…`);
  console.log(`AI mode: ${!RULES_ONLY && process.env.ANTHROPIC_API_KEY ? 'full ensemble' : 'rules-only'}`);

  const results = [];
  for (let i = 0; i < toRun.length; i++) {
    const { folder, abs } = toRun[i];
    process.stdout.write(`[${i + 1}/${toRun.length}] ${folder}/${path.basename(abs)}… `);
    try {
      const r = await processPdf(abs, folder);
      results.push(r);
      console.log(r.outcome ?? r.status);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      results.push({
        lender: folder,
        file: path.basename(abs),
        status: 'error',
        parser: null,
        outcome: 'error',
        issues: [err.message],
        approvedAdd: 0,
        approvedClear: 0,
        ignored: 0,
        addItems: [],
        clearItems: [],
        ignoredItems: [],
        checkers: []
      });
    }
  }

  const report = buildReport(results);
  fs.writeFileSync(OUT, report, 'utf8');
  console.log(`\nWritten: ${OUT}`);

  const parsed = results.filter(r => r.status !== 'no_parse' && r.status !== 'error').length;
  const auto = results.filter(r => r.outcome === 'auto_approved').length;
  const dissent = results.filter(r => r.outcome === 'approved_with_dissent').length;
  const held = results.filter(r => r.outcome === 'held_for_review').length;
  console.log(`Parsed: ${parsed}/${results.length} | 3/3: ${auto} | 2/3: ${dissent} | held: ${held}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
