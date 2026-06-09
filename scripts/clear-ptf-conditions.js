require('dotenv').config();
const { clearPtfConditionsForLoan } = require('../lib/condition-parser');

const borrower = process.argv[2] || 'George';

clearPtfConditionsForLoan(borrower)
  .then(result => {
    console.log(`\nLoan: ${result.loan}`);
    console.log(`Cleared ${result.cleared} PTF condition(s), ${result.remaining} remaining open.\n`);
    if (result.clearedList.length) {
      result.clearedList.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
    }
  })
  .catch(err => {
    console.error('[ERROR]', err.message);
    process.exit(1);
  });
