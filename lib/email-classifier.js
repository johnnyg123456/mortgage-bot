// Classify incoming emails into categories the handlers understand
const CONDITION_KEYWORDS = [
  'conditions', 'condition list', 'prior to', 'suspense', 'uwm conditions',
  'underwriting conditions', 'loan conditions', 'items needed', 'outstanding items',
  'conditionally approved', 'conditional approval', 'approved with conditions',
  'approved w/ conditions', 'initial loan approval', 'conditional loan approval'
];

const PRE_APPROVAL_KEYWORDS = [
  'pre-approval', 'pre approval', 'preapproval', 'prequal', 'pre-qual',
  'pre qualification', 'prequalification'
];

const CORRECTION_KEYWORDS = ['notion agent correction'];

const TASK_KEYWORDS = [
  'action required', 'please review', 'follow up', 'follow-up',
  'reminder', 'urgent', 'time sensitive'
];

function isUwmLoanSubject(subject) {
  return /^\d{6,}\s*[-–]\s*\S+/i.test((subject ?? '').trim());
}

function classify(subject, body, { hasPdf = false } = {}) {
  const text = `${subject} ${body}`.toLowerCase();

  if (CORRECTION_KEYWORDS.some(k => text.includes(k)))  return 'CORRECTION';
  if (PRE_APPROVAL_KEYWORDS.some(k => text.includes(k))) return 'PRE_APPROVAL';
  if (CONDITION_KEYWORDS.some(k => text.includes(k)))    return 'CONDITION_LIST';
  // UWM approval PDFs: subject is often "1226351896 - Bujalski" with keywords only in HTML body
  if (hasPdf && isUwmLoanSubject(subject))               return 'CONDITION_LIST';
  if (hasPdf && /approvalletter|conditional|conditions/i.test(subject ?? '')) return 'CONDITION_LIST';
  if (TASK_KEYWORDS.some(k => text.includes(k)))         return 'TASK';
  return 'OTHER';
}

module.exports = { classify, isUwmLoanSubject };
