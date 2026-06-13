const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const samples = process.argv.slice(2);
if (!samples.length) {
  console.error('Usage: node scripts/dump-pdf-text.js <pdf> [...]');
  process.exit(1);
}

(async () => {
  for (const s of samples) {
    const text = (await pdfParse(fs.readFileSync(s))).text;
    console.log('\n' + '='.repeat(60));
    console.log(path.basename(s));
    console.log('='.repeat(60));
    console.log(text.slice(0, 5000));
  }
})();
