/**
 * Preview what would sync to Notion for each archived approval PDF.
 * Does not call Notion — shows ADD list (after PTF filter) and CLEAR list (PDF cleared markers).
 *
 * Usage: node scripts/preview-notion-sync.js [lender-folder ...]
 * Output: samples/archived-approvals/_notion-sync-preview.md
 */
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const {
  parseUwmApprovalLetter,
  excludePtfConditions,
  isPtfCondition
} = require('../lib/condition-parser');
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

const ROOT = path.join(__dirname, '..', 'samples', 'archived-approvals');
const OUT = path.join(ROOT, '_notion-sync-preview.md');
const SKIP = new Set(['other']);
const ONLY = new Set(process.argv.slice(2));

const PARSERS = [
  ['UWM', parseUwmApprovalLetter],
  ['Newrez', parseNewrezApprovalLetter],
  ['Acra', parseAcraApprovalLetter],
  ['Nations Direct', parseNationsDirectApproval],
  ['Arc', parseArcApprovalLetter],
  ['Emporium/ResiCentral', parseOpenConditionsApproval],
  ['Cake', parseCakeApprovalLetter],
  ['AmWest', parseAmwestApprovalLetter],
  ['The Loan Store', parseTheloanstoreApprovalLetter],
  ['The Lender', parseThelenderApprovalLetter],
  ['Bluepoint', parseBluepointApprovalLetter],
  ['Fundloans', parseFundloansApprovalLetter],
  ['Orion', parseOrionApprovalLetter]
];

function fileUri(absPath) {
  return 'file:///' + absPath.replace(/\\/g, '/').replace(/ /g, '%20');
}

function parsePdfText(text) {
  for (const [name, fn] of PARSERS) {
    const r = fn(text);
    if (r) return { parser: name, parsed: r };
  }
  return null;
}

function mapCondition(c) {
  return {
    code: c.code ?? null,
    category: c.category ?? null,
    section: c.section ?? null,
    text: c.text,
    needs_review: c.needs_review ?? false
  };
}

function notionPreview(parsed) {
  const raw = (parsed.conditions ?? []).map(mapCondition);
  const excluded = raw.filter(c => isPtfCondition(c));
  const toAdd = excludePtfConditions(raw);
  const toClear = (parsed.cleared_conditions ?? []).map(mapCondition);
  return { toAdd, toClear, excluded };
}

function esc(s) {
  return String(s).replace(/\r?\n/g, ' ').trim();
}

async function processPdf(absPath, relPath, lender) {
  const text = (await pdfParse(fs.readFileSync(absPath))).text;
  const hit = parsePdfText(text);
  const uri = fileUri(absPath);

  const lines = [];
  lines.push(`## ${lender} — ${path.basename(absPath)}`);
  lines.push('');
  lines.push(`- **PDF:** [${path.basename(absPath)}](${uri})`);
  lines.push(`- **Path:** \`${relPath.replace(/\\/g, '/')}\``);
  lines.push('');

  if (!hit) {
    lines.push('**Status:** NO PARSE (would skip — no Notion changes)');
    lines.push('');
    lines.push('---');
    lines.push('');
    return lines;
  }

  const { parser, parsed } = hit;
  const { toAdd, toClear, excluded } = notionPreview(parsed);

  lines.push(`- **Parser:** ${parser}`);
  lines.push(`- **Loan #:** ${parsed.loan_number ?? '—'}`);
  lines.push(`- **Borrower:** ${parsed.borrower_name ?? '—'}`);
  lines.push('');

  lines.push(`### Would ADD to Notion (${toAdd.length})`);
  lines.push('');
  lines.push('_Open conditions after PTF filter. On a real sync, any existing Notion open conditions **not** in this list would also be marked Cleared._');
  lines.push('');
  if (!toAdd.length) {
    lines.push('_None_');
  } else {
    toAdd.forEach((c, i) => lines.push(`${i + 1}. ${esc(c.text)}`));
  }
  lines.push('');

  lines.push(`### Would CLEAR in Notion — PDF cleared markers (${toClear.length})`);
  lines.push('');
  lines.push('_Conditions explicitly marked cleared on the approval (e.g. Acra cleared dates). Matched open Notion rows would be set to Cleared._');
  lines.push('');
  if (!toClear.length) {
    lines.push('_None_');
  } else {
    toClear.forEach((c, i) => {
      const date = c.cleared_date ? ` _(cleared ${c.cleared_date})_` : '';
      lines.push(`${i + 1}. ${esc(c.text)}${date}`);
    });
  }
  lines.push('');

  lines.push(`### Excluded by PTF filter (${excluded.length})`);
  lines.push('');
  lines.push('_Not sent to Notion — Prior to Funding / closing table items._');
  lines.push('');
  if (!excluded.length) {
    lines.push('_None_');
  } else {
    excluded.forEach((c, i) => lines.push(`${i + 1}. ${esc(c.text)}`));
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  return lines;
}

const indexRows = [];

async function main() {
  const folders = fs.readdirSync(ROOT)
    .filter(f => {
      const p = path.join(ROOT, f);
      if (!fs.statSync(p).isDirectory() || SKIP.has(f)) return false;
      if (ONLY.size) return ONLY.has(f);
      return true;
    })
    .sort();

  const out = [];
  out.push('# Notion sync preview — archived approvals');
  out.push('');
  out.push(`Generated: ${new Date().toISOString()}`);
  out.push('');
  out.push('Each PDF section shows what would be **added** as open conditions and what would be **cleared** from PDF cleared markers. A live PDF sync also clears any other open Notion conditions on that loan that are not in the ADD list.');
  out.push('');

  let pdfCount = 0;
  let parsedCount = 0;

  for (const folder of folders) {
    const dir = path.join(ROOT, folder);
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf')).sort();
    out.push(`# ${folder}`);
    out.push('');

    for (const f of files) {
      pdfCount++;
      const abs = path.join(dir, f);
      const rel = path.relative(path.join(__dirname, '..'), abs);
      const section = await processPdf(abs, rel, folder);
      const text = section.join('\n');
      if (!text.includes('NO PARSE')) parsedCount++;

      const addM = text.match(/Would ADD to Notion \((\d+)\)/);
      const clearM = text.match(/PDF cleared markers \((\d+)\)/);
      const exM = text.match(/PTF filter \((\d+)\)/);
      const uri = fileUri(abs);
      indexRows.push({
        label: `${folder} / ${f}`,
        uri,
        add: addM ? addM[1] : '—',
        clear: clearM ? clearM[1] : '—',
        ex: exM ? exM[1] : '—',
        noparse: text.includes('NO PARSE')
      });

      out.push(...section);
    }
  }

  out.push('');
  out.push(`**Summary:** ${parsedCount}/${pdfCount} PDFs parsed`);

  let index = '## Quick index (click PDF to open)\n\n';
  index += '| PDF | ADD | CLEAR | PTF excluded |\n';
  index += '|-----|-----|-------|--------------|\n';
  for (const r of indexRows) {
    const short = r.label.length > 55 ? r.label.slice(0, 52) + '...' : r.label;
    index += `| [${short}](${r.uri}) | ${r.add} | ${r.clear} | ${r.ex} |\n`;
  }
  index += '\n';

  const body = out.join('\n');
  const withIndex = body.replace(
    'Each PDF section shows what would be',
    `${index}Each PDF section shows what would be`
  );

  fs.writeFileSync(OUT, withIndex, 'utf8');
  console.log(`Written: ${OUT}`);
  console.log(`Parsed: ${parsedCount}/${pdfCount} PDFs`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
