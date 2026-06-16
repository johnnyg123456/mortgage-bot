// Classify incoming emails into categories the handlers understand

const {
  extractLoanInfo,
  hasActionableLenderRequest
} = require('./lender-request-handler');
const { isNewrezApprovalEmail } = require('./newrez-client');
const { isApprovalPdfFilename } = require('./approval-letter');
const {
  LENDER_ROLE_KEYWORDS,
  isTitleOrClosingEmail,
  isKnownLenderEmployeeEmail,
  isBrokerEmail
} = require('./email-parties');

const IGNORE_KEYWORDS = [
  'lock confirmation', 'lock update', 'lock extension', 'relock', 're-lock',
  'rate lock confirmation', 'successfully locked', 'lock expiration date',
  'change of circumstance', 'change of circumstances', 'changed circumstance',
  'changed circumstances', 'notice of change of circumstance', 'coc notice',
  'coc confirmation', 'coc submitted', 'coc received', 'change in circumstance',
  'change of circumstance has been processed', 'your change of circumstance',
  'loan change request', 'change request has been submitted', 'reason(s) for this change request'
];

const CONDITION_KEYWORDS = [
  'conditions', 'condition list', 'prior to', 'suspense', 'uwm conditions',
  'underwriting conditions', 'loan conditions', 'items needed', 'outstanding items',
  'conditionally approved', 'conditional approval',
  'initial loan approval', 'conditional loan approval'
];

const PRE_APPROVAL_KEYWORDS = [
  'pre-approval', 'pre approval', 'preapproval', 'prequal', 'pre-qual',
  'pre qualification', 'prequalification'
];

const TASK_KEYWORDS = [
  'action required', 'please review', 'follow up', 'follow-up',
  'reminder', 'urgent', 'time sensitive'
];

function isUwmLoanSubject(subject) {
  return /^\d{6,}\s*[-–]\s*\S+/i.test((subject ?? '').trim());
}

function isIgnorableEmail(subject, body) {
  if (/\[mortgage bot\]/i.test(subject ?? '')) return true;
  const text = `${subject} ${body}`.toLowerCase();
  if (IGNORE_KEYWORDS.some(k => text.includes(k))) return true;
  if (/lock confirmation for the/i.test(subject ?? '')) return true;
  if (/\[lock update\]/i.test(subject ?? '')) return true;
  if (/loan change request/i.test(subject ?? '')) return true;
  return false;
}

function isApprovalPdfSubject(subject) {
  return /approval\s*letter|conditional\s+approval|loan\s+approval|initial\s+loan\s+approval/i.test(subject ?? '');
}

function isApprovalPdfCandidate(subject, body, { hasPdf = false, pdfFilename = '' } = {}) {
  if (!hasPdf) return false;
  if (isUwmLoanSubject(subject)) return true;
  if (isApprovalPdfSubject(subject)) return true;
  if (/approvalletter/i.test(`${subject} ${body}`)) return true;
  if (pdfFilename && isApprovalPdfFilename(pdfFilename)) return true;
  const text = `${subject} ${body}`.toLowerCase();
  return CONDITION_KEYWORDS.some(k => text.includes(k));
}

function isLenderUrgentRequest(subject, body, from) {
  if (isBrokerEmail(from)) return false;
  if (isTitleOrClosingEmail(from, subject, body)) return false;
  if (!isKnownLenderEmployeeEmail(from, body)) return false;

  const { loanNumber } = extractLoanInfo(subject, body);
  if (!loanNumber) return false;

  const text = `${subject} ${body}`.toLowerCase();
  const hasRole = LENDER_ROLE_KEYWORDS.some(k => text.includes(k));
  return hasRole || hasActionableLenderRequest(subject, body);
}

function classify(subject, body, { hasPdf = false, from = '', pdfFilename = '' } = {}) {
  const text = `${subject} ${body}`.toLowerCase();

  if (isIgnorableEmail(subject, body))                         return 'IGNORE';
  if (isTitleOrClosingEmail(from, subject, body))              return 'OTHER';
  if (PRE_APPROVAL_KEYWORDS.some(k => text.includes(k)))       return 'PRE_APPROVAL';
  if (isNewrezApprovalEmail(from, subject))                    return 'CONDITION_LIST';
  if (isApprovalPdfCandidate(subject, body, { hasPdf, pdfFilename })) return 'CONDITION_LIST';
  if (isLenderUrgentRequest(subject, body, from))              return 'LENDER_REQUEST';
  if (TASK_KEYWORDS.some(k => text.includes(k)))               return 'TASK';
  return 'OTHER';
}

module.exports = {
  classify,
  isUwmLoanSubject,
  isIgnorableEmail,
  isLenderUrgentRequest,
  isTitleOrClosingEmail,
  isKnownLenderEmployeeEmail,
  isApprovalPdfCandidate
};
