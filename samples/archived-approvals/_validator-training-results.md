# Validator training results — archived approvals

Generated: 2026-06-13T15:21:48.999Z
Mode: full 3-checker ensemble
PDFs processed: 14

## Summary

| Metric | Count |
|--------|-------|
| Total PDFs | 14 |
| Parsed | 13 |
| No parse | 1 |
| 3/3 auto-approved | 3 |
| 2/3 approved with dissent | 10 |
| 0–1/3 held for review | 0 |

## Quick index

| Lender | PDF | Parser | Outcome | Votes | Add | Clear | Ignored |
|--------|-----|--------|---------|-------|-----|-------|---------|
| acra | 7517183_Acra_-_Approval_2026-06-11.pdf | Acra | approved_with_dissent | 2 | 25 | 0 | 3 |
| acra | unknown-loan_AS_Vacation_Rentals_LLC_... | Acra | approved_with_dissent | 2 | 20 | 0 | 2 |
| acra | unknown-loan_Acra_-_Approval_2026-06-... | Acra | approved_with_dissent | 2 | 16 | 0 | 1 |
| acra | unknown-loan_Elkoubi_Initial_Approval... | Acra | approved_with_dissent | 2 | 26 | 0 | 1 |
| acra | unknown-loan_Malki-_Outstanding_PTD_C... | Acra | approved_with_dissent | 2 | 22 | 0 | 0 |
| acra | unknown-loan_Malki_-_7516442_-_Approv... | Acra | approved_with_dissent | 2 | 28 | 1 | 0 |
| acra | unknown-loan_Malki_-_7516442_-_Initia... | Acra | approved_with_dissent | 2 | 28 | 0 | 0 |
| acra | unknown-loan_Ofir_Acra_approval_2026-... | Acra | approved_with_dissent | 2 | 24 | 0 | 1 |
| newrez | 9758676861_9758676861_Loan_Approval_2... | Newrez | auto_approved | 3 | 22 | 0 | 1 |
| newrez | 9758676861_9758676861_Loan_Approval_2... | Newrez | auto_approved | 3 | 22 | 0 | 0 |
| newrez | 9758676861_9758676861_Loan_Approval_2... | Newrez | approved_with_dissent | 2 | 23 | 0 | 0 |
| newrez | 9758676861_Loan_Approval.pdf | Newrez | approved_with_dissent | 2 | 23 | 0 | 0 |
| newrez | 9769720773_9769720773_Loan_Approval_2... | Newrez | auto_approved | 3 | 1 | 0 | 0 |
| newrez | Liberty Group Funding Inc. Mail - The... | — | no_parse | — | 0 | 0 | 0 |

## acra — 7517183_Acra_-_Approval_2026-06-11.pdf

- **Parser:** Acra
- **Borrower:** Diane Leclerc
- **Loan #:** 7517183
- **Parsed conditions:** 25 (0 PTF excluded)
- **Outcome:** approved_with_dissent (2/3 votes, 77% confidence)

**Checker votes:**
- Checker A (strict): REJECT (40%)
- Checker B (lenient): APPROVE (92%)
- Checker C (rules): APPROVE (100%)

**Issues:**
- [Checker A (strict)] All 10 ADD items are boilerplate/standard requirements, not loan-specific conditions requiring tracking
- [Checker A (strict)] ADD items 1-2 are internal notes/PTF items, not borrower-actionable conditions
- [Checker A (strict)] ADD items 3-10 are templated standard documentation requirements, not unique to this loan
- [Checker A (strict)] CLEAR item 1 (4700) shows cleared date 05/20/2026 in PDF - can be cleared
- [Checker A (strict)] CLEAR item 2 (4702) shows cleared date 05/20/2026 in PDF - can be cleared
- [Checker A (strict)] CLEAR item 3 (16002) shows cleared date 05/20/2026 in PDF - can be cleared
- [Checker A (strict)] Proposing to add boilerplate violates strict validation rules
- [Checker A (strict)] All 10 proposed ADD items are PTF/closing items or boilerplate — not loan conditions requiring tracking
- [Checker A (strict)] Items 4701, 4705, 4706, 4709, 4800, 15002, 15006, 16000, 16003, 16005 are standard closing/documentation requirements, not material loan conditions
- [Checker A (strict)] These belong in closing task management, not condition tracking system
- [Checker A (strict)] No material underwriting conditions extracted (e.g., no income verification conditions, no appraisal conditions, no credit repair conditions)
- [Checker A (strict)] Items reference closing disclosure, EMD documentation, asset verification — all PTF/closing logistics
- [Checker A (strict)] All 5 proposed ADD items are PTF (Prior to Funding)/closing document conditions, not loan conditions. Per validator rules, PTF/closing items must be rejected.
- [Checker A (strict)] These conditions belong in closing/funding workflow, not in active loan condition tracking.
- [Checker A (strict)] Condition 16006 text is truncated in the proposal (ends with 'm' instead of 'may not be a party to the transaction)').
- [Checker A (strict)] None of these items represent substantive loan underwriting conditions requiring document/action verification before approval.

**Approved ADD (25):**
1. PTD | NOTE:  Broker's Rework Request.
2. PTD | Once CD is provided with actual closing costs, analysis of ATR in Full will need to be updated.
3. PTD | Verification of mortgage covering the last 12 months to verify payments for [include lender/property address] documented as follows: 1.Institutional Financing: Mortgage payment history via one (or combination) of the following: Credit report, credit supplement, fully completed VOM form, bank statements or canceled checks. 2.Non-Institutional Financing (private contract/mortgage or non-institutional lender): Twelve (12) months cancelled checks (front and back) -OR- VOM/payment history provided by
4. PTD | Two forms of identification including at least one Unexpired Government Issued Picture Identification for all borrowers.
5. PTD | Copy of social security card OR fully completed and executed SSA-89 form (either electronic or wet signature) for all applicable borrowers.
6. PTD | Non-Permanent Resident Alien: 1. Copy of unexpired VISA 2. DHS Work Authorization for applicable borrowers, must be valid 12 months from closing date or provide proof of renewal eligibility. (Valid EAD Card or other docs confirming legal residency)
7. PTD | Complete original appraisal with interior/exterior photos of subject & comps. PDF and XML format required.
8. PTD | Full Alta 2006, 2016 Preliminary Title Report or ALTA Extended Policy (7-1-21) with 24 month chain of title and plat map/survey.
9. PTD | Property Tax Certificate for subject property and MUST be from the County Tax Assessors office. Must reflect millage/tax rates.
10. PTD | Florida: Title to provide Survey. If Survey is not current, older survey (10 years or older) an affidavit is to be provided. Form 9 Endorsement will be required on all Florida loans. Additional conditions may apply.
11. PTD | Closing asset documentation: 1) An image of the EMD payment, via copy of check, outgoing wire, or Bank Statement reflective of clearance AND 2) An escrow deposit receipt. ***Total EMD $30k
12. PTD | ATR In Full: 2 months statements for all accounts to be used for asset source for loan qualification. 1. Net proceeds from the sale of 7807 IRONHORSE BLVD & 7795 IRONHORSE BLVD being used for this transaction. Confirm the funds are going directly to escrow. 2. If net proceeds will be deposited into the borrower's account provide the most recent bank statement showing funds received.
13. PTD | ATR in Full: Signed/dated LOE from the borrower stating that they are using those particular assets for a depletion source for loan repayment.
14. PTD | Reserves for LTV >75% up to 85%: Most recent asset statement covering at least the last 30 days for 3 months PITIA reserves to support sufficient sourced seasoned funds. If using business assets, borrower(s) must be 100% owner of company. 1. Provide the most recent bank statement showing the borrower has sufficient assets to cover three months of reserves
15. PTD | Provide purchase contract with all addenda and counter offers, fully executed by buyer and seller. Any changes made to the document are to be initiated by all parties. 1. Purchase contract on 3/15 is missing borrower's name at the top. 2. What is the borrower's role in this transaction? Per #20 borrower is a licensed agent. Confirming borrower is acting as the agent for this transaction.
16. PTD | Broker to confirm loan fees on Fee Validation email sent by Account Manager.  *terms must match current approval
17. PTD | Borrower must acknowledge receipt of all valuation items (Appraisal(s), Appraisal Analysis, BPO (if applicable). **Lender will disclose Appraisal to borrower.
18. PTD | Acra Lending to clear identity fraud alert showing on credit.
19. PTD | Acra to obtain Agent Verification upon receipt of the following: 1) Wire instructions to include one specific loan identifier (ie; title order #, borrower's name, loan number or subject address). 2) CPL to include Lender Loss Payee: Citadel Servicing Corp. dba Acra Lending, ISAOA/ATIMA - 3 Ada Parkway #200A, Irvine, CA 92618/ loan #/ borrower name.
20. PTD | 1. Broker to provide credit report invoice 2. Broker to provide appraisal invoice(s)
21. PTD | Fully Executed Acra Authorization for Automatic Mortgage Payment form AND copy of a voided check/bank print out with acct#/ABA# *ACH is required for loans closing in an Entity; If loan is not closing in the name of an Entity, the form must still be completed to elect yes (with voided check or stmt) or no and sign/dated. A $100 credit will be applied at funding to non-entity loans with ACH set up.
22. PTD | Vesting to be provided to show exact way borrower(s) will take title.  This will be used to draw loan documents
23. PTD | If the borrower is using a POA (Power of Attorney), all items listed must be satisfied: 1. Executed copy of Specific POA (can not accept Durable POA). If signed outside of US, must be executed at US Embassy 2. Title to acknowledge they have reviewed and approved POA; that POA will be recorded concurrently with the Security Instrument; that they will provide a recorded copy of the POA to Acra Lending 3. Relationship letter and explanation for reason using POA 4. Copy of ID for Attorney in Fact (m
24. PTD | Acceptable Hazard insurance policy equal to the loan amount or 100% replacement or guaranteed replacement cost. Please refer to the Acra Insurance Guide for all required coverages and loss payee. Loss Payee: Citadel Servicing Corporation dba Acra Lending ISAOA/ATIMA PO Box 29411 Phoenix, AZ 85038-9411 Loan number: See loan approval
25. PTD | Settlement statement or closing disclosure. Please include all fees and payoffs. Estimate must include payoff requirements (if any). Purchase loans must include buyer and seller side fees. Also, please provide complete Agent Contact form (form provided at the time of Loan Approval)

**Approved CLEAR (0):**
_None_

**Ignored (3):**
1. PTD | Closing asset documentation: Copy of the borrowers most recent bank statement(s) for the account(s) in which the funds to close are to be withdrawn. (did not reach checker majority)
2. PTD | Provide updated bank statements to verify sufficient assets. (did not reach checker majority)
3. PTD | Acra Lending Signed Notice of Intent to Proceed with Loan Application form or email notification of borrower's Intent to Proceed. (did not reach checker majority)

---

## acra — unknown-loan_AS_Vacation_Rentals_LLC_Initial_Approval_2026-06-11.pdf

- **Parser:** Acra
- **Borrower:** —
- **Loan #:** 3521183
- **Parsed conditions:** 21 (0 PTF excluded)
- **Outcome:** approved_with_dissent (2/3 votes, 77% confidence)

**Checker votes:**
- Checker A (strict): REJECT (38%)
- Checker B (lenient): APPROVE (92%)
- Checker C (rules): APPROVE (100%)

**Issues:**
- [Checker A (strict)] Multiple proposed ADD items contain merged/corrupted text spanning across sections
- [Checker A (strict)] Proposed ADD items improperly combine condition numbers with unrelated text blocks
- [Checker A (strict)] 8th ADD item concatenates appraisal requirement with repair/settlement statement conditions inappropriately
- [Checker A (strict)] CLEAR item references condition 4510 which appears in PRIOR TO DOC section but proposing to clear without evidence of clearance
- [Checker A (strict)] Confidence severely reduced due to text extraction quality issues in source material
- [Checker A (strict)] All 9 ADD items are marked 'PTD' (Prior to Doc/Funding) — these are standard closing/funding conditions, not mortgage conditions requiring validation.
- [Checker A (strict)] Items 2, 3, 4, 5, 6, 7, 8, 9 are boilerplate administrative/closing procedures (fee confirmation, insurance setup, ACH authorization, vesting instructions, POA handling, invoices, hazard insurance).
- [Checker A (strict)] Item 1 (Survey) is conditional on Florida requirements and survey age — supported in PDF but is a standard title/survey requirement, not a unique credit condition.
- [Checker A (strict)] No CLEAR items provided; nothing to validate as cleared.
- [Checker A (strict)] These conditions belong in closing/PTF workflow, not in active mortgage condition tracking.
- [Checker A (strict)] Proposed condition is PTF (Prior to Fund), not a mortgage condition requiring validation
- [Checker A (strict)] Text appears truncated/malformed - includes table headers 'CreditorTo Be Paid Off PaymentDebt TypeBalance' that are not part of the actual condition
- [Checker A (strict)] Condition 16016 is a closing/funding deliverable, not a substantive mortgage condition
- [Checker A (strict)] Paraphrased/corrupted version of PDF text - original reads 'Settlement statement or closing disclosure. Please include all fees and payoffs.' without the table fragment

**Approved ADD (20):**
1. PTD | Broker to provide completed 1003.
2. PTD | Payoff demands for all liens of record on title.
3. PTD | Subject mortgage payment history: 1.Institutional Financing: Mortgage payment history via one (or combination) of the following: Credit report, credit supplement, fully completed VOM form, bank statements or canceled checks. OR 2.Non-Institutional Financing (private contract/mortgage or non-institutional lender): Twelve (12) months cancelled checks (front and back) -OR- VOM/payment history provided by lenders 3rd party contract loan servicer.
4. PTD | Verification of mortgage covering the last 12 months to verify payments for20379 W Country Club Apt 1538 (priamry residence) documented as follows: 1.Institutional Financing: Mortgage payment history via one (or combination) of the following: Credit report, credit supplement, fully completed VOM form, bank statements or canceled checks. 2.Non-Institutional Financing (private contract/mortgage or non-institutional lender): Twelve (12) months cancelled checks (front and back) -OR- VOM/payment hist
5. PTD | Unexpired Picture Identification (Driver's License/Passport) for all borrowers.
6. PTD | Copy of social security card OR fully completed and executed SSA-89 form (either electronic or wet signature) for all applicable borrowers.
7. PTD | Complete original appraisal with interior/exterior photos of subject & comps. PDF and XML format required. 1007/Rental survey is required if rents from the subject are being used to qualify. No. Rev. 09/26/2025 44091. Provide list of repairs / improvements with costs since subject was purchased. 2. Provide final settlement statement when subject property was acquired. 3. Provide Documented Receipts for improvements for subejct property. Note: Per Zillow, subject acquired on 11/21/2025 $295,000,
8. PTD | Full Alta 2006, 2016 Preliminary Title Report or ALTA Extended Policy (7-1-21) with 24 month chain of title and plat map/survey.
9. PTD | Existing Note/s for any outstanding lien on subject property.
10. PTD | Florida: Title to provide Survey. If Survey is not current, older survey (10 years or older) an affidavit is to be provided. Form 9 Endorsement will be required on all Florida loans. Additional conditions may apply.
11. PTD | DSCR Program: Current lease agreement(s) for subject property. 5001Business Entity Documentation: Operating Agreement to include authorization to borrow & designates signers. 5002Business Entity Documentation: Certificate of Formation / Articles of Organization. 5003Business Entity Documentation: Certificate of Good Standing or equivalent document. 5004Business Entity Documentation: Certificate of Foreign Qualification or other qualification to operate in the state where business is being conduc
12. PTD | Broker to confirm loan fees on Fee Validation email sent by Account Manager.  *terms must match current approval.
13. PTD | Borrower must acknowledge receipt of all valuation items (Appraisal(s), Appraisal Analysis, BPO (if applicable). **Lender will disclose Appraisal to borrower.
14. PTD | Acra to obtain Agent Verification upon receipt of the following: 1) Wire instructions to include one specific loan identifier (ie; title order #, borrower's name, loan number or subject address). 2) CPL to include Lender Loss Payee: Citadel Servicing Corp. dba Acra Lending, ISAOA/ATIMA - 3 Ada Parkway #200A, Irvine, CA 92618/ loan #/ borrower name.
15. PTD | 1. Broker to provide credit report invoice 2. Broker to provide appraisal invoice(s).
16. PTD | Fully Executed Acra Authorization for Automatic Mortgage Payment form AND copy of a voided check/bank print out with acct#/ABA# *ACH is required for loans closing in an Entity; If loan is not closing in the name of an Entity, the form must still be completed to elect yes (with voided check or stmt) or no and sign/dated. A $100 credit will be applied at funding to non-entity loans with ACH set up.
17. PTD | Vesting to be provided to show exact way borrower(s) will take title.  This will be used to draw loan documents.
18. PTD | If the borrower is using a POA (Power of Attorney), all items listed must be satisfied: 1. Executed copy of Specific POA (can not accept Durable POA). If signed outside of US, must be executed at US Embassy. 2. Title to acknowledge they have reviewed and approved POA; that POA will be recorded concurrently with the Security Instrument; that they will provide a recorded copy of the POA to Acra Lending. 3. Relationship letter and explanation for reason using POA 4. Copy of ID for Attorney in Fact
19. PTD | Acceptable Hazard insurance policy equal to the loan amount or 100% replacement or guaranteed replacement cost. Please refer to the Acra Insurance Guide for all required coverages and loss payee.
20. PTD | Settlement statement or closing disclosure. Please include all fees and payoffs. Paid Off PaymentDebt TypeBalance

**Approved CLEAR (0):**
_None_

**Ignored (2):**
1. PTD | NOTE:  Broker's Rework Request. (did not reach checker majority)
2. PTD | Property Tax Certificate for subject property and MUST be from the County Tax Assessors office. Must reflect millage/tax rates. NOTE: Subject property address on HOI, CPL, and Wire Instructions MUST match the legal address reflected on tax certificate/tax bill. (did not reach checker majority)

---

## acra — unknown-loan_Acra_-_Approval_2026-06-11.pdf

- **Parser:** Acra
- **Borrower:** —
- **Loan #:** 3521926
- **Parsed conditions:** 17 (0 PTF excluded)
- **Outcome:** approved_with_dissent (2/3 votes, 76% confidence)

**Checker votes:**
- Checker A (strict): REJECT (44%)
- Checker B (lenient): APPROVE (85%)
- Checker C (rules): APPROVE (100%)

**Issues:**
- [Checker A (strict)] Proposed conditions contain merged/concatenated text (items 9-10) that obscures individual condition boundaries
- [Checker A (strict)] Item 9 has nonsensical suffix 'No.' that doesn't match PDF
- [Checker A (strict)] Item 10 concatenates multiple conditions (4700, 5001-5004) making it impossible to validate individual requirements
- [Checker A (strict)] Item 4 is truncated mid-sentence ('provided by' cuts off)
- [Checker A (strict)] Critical condition missing: Condition 2018 regarding Opal Holdings LLC ownership proof is not in proposed ADD list
- [Checker A (strict)] Critical condition missing: Condition 2 regarding Rate & Term vs Cash-Out refi clarification is not in proposed ADD list
- [Checker A (strict)] Most proposed conditions are PTF (Prior To Fund)/closing items - should be excluded per validation rules
- [Checker A (strict)] Condition 15002 is administrative/lender operational task, not borrower/broker deliverable
- [Checker A (strict)] Condition 15006 is disclosure acknowledgment, not a substantive condition
- [Checker A (strict)] Condition 16003 is lender operational (agent verification), not borrower/broker action
- [Checker A (strict)] Condition 16005 is lender operational (invoice collection), not borrower/broker action
- [Checker A (strict)] Condition 16006 mixes PTF closing item with setup instruction
- [Checker A (strict)] Condition 16011 is standard insurance requirement, acceptable but routine
- [Checker A (strict)] Condition 16016 is PTF closing document, not pre-closing condition
- [Checker A (strict)] Last item contains garbled text 'Paid Off PaymentDebt TypeBalance' - source corruption
- [Checker B (lenient)] Item 10 in ADD list is truncated/malformed - contains multiple condition numbers concatenated
- [Checker B (lenient)] Some proposed items mix multiple distinct conditions into single entries

**Approved ADD (16):**
1. PTD | Broker to provide completed 1003/URLA
2. PTD | Section 8 Demographic Information on the loan application must be fully completed to include:1. Answers at Ethnicity, Sex and Race. 2. Yes or No answers checked at To Be Completed by Financial Institution (for application taken in person).3. Checkbox by what means the Demographic Information was provided through: Face to Face Interview (includes Electronic Media w/Video Component), Telephone Interview, Fax or Mail, Email or Internet.
3. PTD | Payoff demands for all liens of record  on title.
4. PTD | Verification of mortgage covering the last 12 months to verify payments for [include lender/property address] documented as follows: 1.Institutional Financing: Mortgage payment history via one (or combination) of the following: Credit report, credit supplement, fully completed VOM form, bank statements or canceled checks. 2.Non-Institutional Financing (private contract/mortgage or non-institutional lender): Twelve (12) months cancelled checks (front and back) -OR- VOM/payment history provided by
5. PTD | Two forms of identification including at least one Unexpired Government Issued Picture Identification for all borrowers.
6. PTD | Copy of social security card OR fully completed and executed SSA-89 form (either electronic or wet signature) for all applicable borrowers.
7. PTD | Complete original appraisal with interior/exterior photos of subject & comps. PDF and XML format required. 1007/Rental survey is required if rents from the subject are being used to qualify.
8. PTD | Full Alta 2006, 2016 Preliminary Title Report or ALTA Extended Policy (7-1-21) with 24 month chain of title and plat map/survey.
9. PTD | Florida: Title to provide Survey. If Survey is not current, older survey (10 years or older) an affidavit is to be provided. Form 9 Endorsement will be required on all Florida loans. Additional conditions may apply. No.
10. PTD | Broker to confirm loan fees on Fee Validation email sent by Account Manager.  *terms must match current approval
11. PTD | Borrower must acknowledge receipt of all valuation items (Appraisal(s), Appraisal Analysis, BPO (if applicable). **Lender will disclose Appraisal to borrower.
12. PTD | Acra to obtain Agent Verification upon receipt of the following: 1) Wire instructions to include one specific loan identifier (ie; title order #, borrower's name, loan number or subject address). 2) CPL to include Lender Loss Payee: Citadel Servicing Corp. dba Acra Lending, ISAOA/ATIMA - 3 Ada Parkway #200A, Irvine, CA 92618/ loan #/ borrower name.
13. PTD | 1. Broker to provide credit report invoice 2. Broker to provide appraisal invoice(s)
14. PTD | Fully Executed Acra Authorization for Automatic Mortgage Payment form AND copy of a voided check/bank print out with acct#/ABA# *ACH is required for loans closing in an Entity; If loan is not closing in the name of an Entity, the form must still be completed to elect yes (with voided check or stmt) or no and sign/dated. A $100 credit will be applied at funding to non-entity loans with ACH set up.
15. PTD | Acceptable Hazard insurance policy equal to the loan amount or 100% replacement or guaranteed replacement cost. Please refer to the Acra Insurance Guide for all required coverages and loss payee.
16. PTD | Settlement statement or closing disclosure. Please include all fees and payoffs. Paid Off PaymentDebt TypeBalance

**Approved CLEAR (0):**
_None_

**Ignored (1):**
1. PTD | Closing asset documentation: Copy of the borrowers most recent bank statement(s) for the account(s) in which the funds to close are to be withdrawn. 5001Business Entity Documentation: Operating Agreement to include authorization to borrow & designates signers. 5002Business Entity Documentation: Certificate of Formation / Articles of Organization. 5003Business Entity Documentation: Certificate of Good Standing or equivalent document. 5004Business Entity Documentation: Certificate of Foreign Quali (did not reach checker majority)

---

## acra — unknown-loan_Elkoubi_Initial_Approval_2026-06-11.pdf

- **Parser:** Acra
- **Borrower:** —
- **Loan #:** 3517163
- **Parsed conditions:** 26 (0 PTF excluded)
- **Outcome:** approved_with_dissent (2/3 votes, 82% confidence)

**Checker votes:**
- Checker A (strict): REJECT (53%)
- Checker B (lenient): APPROVE (92%)
- Checker C (rules): APPROVE (100%)

**Issues:**
- [Checker A (strict)] All proposed ADD items are marked as PTD (Prior To Doc) but lack cleared dates - cannot validate approval status
- [Checker A (strict)] CLEAR item proposed without evidence of actual clearance in PDF
- [Checker A (strict)] Loan appears to be in preliminary approval stage (12/08/2025) with 30-day deadline - conditions are not yet satisfied
- [Checker A (strict)] No cleared dates provided for any conditions in the PDF document
- [Checker A (strict)] Item 1: PTF/closing item - condition 16003 is explicitly marked 'PRIOR TO FUND', not a mortgage condition
- [Checker A (strict)] Item 2: PTF/closing item - condition 16005 is explicitly marked 'PRIOR TO FUND', not a mortgage condition
- [Checker A (strict)] Item 3: PTF/closing item - condition 16006 is explicitly marked 'PRIOR TO FUND', not a mortgage condition
- [Checker A (strict)] Item 4: PTF/closing item - condition 16007 is explicitly marked 'PRIOR TO FUND', not a mortgage condition
- [Checker A (strict)] Item 5: Truncated text - missing critical closing phrase 'loss coverage should be to the lessor of (a) PITIA or (b) rent received/scheduled...' and other text. Also marked 'PRIOR TO FUND'
- [Checker A (strict)] Item 6: Corrupted text - includes 'Paid Off PaymentDebt TypeBalance' which is table header content, not part of condition 16016. Also marked 'PRIOR TO FUND'

**Approved ADD (26):**
1. PTD | NOTE: All doc expiration dates must have a minimum of 8 days remaining from the day that ALL other PTDs are cleared by UW; Broker to submit updated items along with final PTDs. **Refer to Expiration Dates section listed on Approval.
2. PTD | Note: Per Redfin subject apprears to be listed for sale. Upon confirmation loan subject to reprice and requal.
3. PTD | Payoff demands for all liens of record on title. 420212 month pay history for subject property (if refinance).
4. PTD | Updated 12 month pay history for primary residence with United Wholesale #2329 - last rated 10/2025.
5. PTD | Unexpired Picture Identification (Driver's License/Passport) for all borrowers.
6. PTD | Copy of social security card OR fully completed and executed SSA-89 form (either electronic or wet signature) for all applicable borrowers.
7. PTD | Complete original appraisal with interior/exterior photos of subject & comps. PDF and XML format required. 1007/Rental survey is required if rents from the subject are being used to qualify.
8. PTD | HOA Certification
9. PTD | HOA Documents: HOA Master insurance policy Walls out coverage: $1M Liability, Correct HOA name as the Insured Party and Building subject Property Address must include our unit in description and borrower's HO6 OR HOA Master Insurance policy Walls In coverage that includes improvements and betterments, reflect CSC loss payee clause / loan # / borrower's name / subject address & unit # for policy coverage.
10. PTD | HOA documents requirement for subject: If delinquencies exceed 15% (60+ days) and/or litigation exists, provide the latest P&L, current budget, and if litigation, a case summary with attorneys opinion letter.
11. PTD | HOA Documents: If a refinance, provide most recent HOA billing statement.
12. PTD | HOA documents required for subject if Florida Condo:  Florida Addendum to Acra Lending's HOA Cert.  If marked "yes" to
13. PTD | Full Alta 2006, 2016 Preliminary Title Report or ALTA Extended Policy (7-1-21) with 24 month chain of title and plat map/survey.
14. PTD | Florida: Title to provide Survey. If Survey is not current, older survey (10 years or older) an affidavit is to be provided. Form 9 Endorsement will be required on all Florida loans. Additional conditions may apply.
15. PTD | DSCR Program:  Current lease agreement(s) for subject property.
16. PTD | Satisfactory Flood Certification & Determination (to be pulled by Acra). File is subject to flood insurance policy if determined to be in a flood zone. Additional conditions may apply.
17. PTD | Broker to confirm loan fees on Fee Validation email sent by Account Manager. *terms must match current approval No. Rev. 09/26/2025
18. PTD | Settlement statement reflecting all fees to be disclosed on the CD *Combined Buyer/Seller statement required for purchases, terms must match approval.
19. PTD | Borrower must acknowledge receipt of all valuation items (Appraisal(s), Appraisal Analysis, BPO (if applicable))
20. PTD | Renewal policy must be provided for refinance transactions with less than two months coverage remaining.
21. PTD | Closing/Settlement Agent must be either (1) a major title company or (2) underwritten by a major title company 1. Acra TM to obtain Agent Verification upon receipt of the following: Wire instructions to include one specific loan identifier (ie; title order #, borrower's name, loan number or subject address). In addition, CPL and Title Loss Payee to reflect Citadel Servicing Corp. dba Acra Lending, ISAOA/ATIMA - 3 Ada Parkway #200A, Irvine, CA 92618/ loan #/ borrower name.
22. PTD | 1. Broker to provide credit report invoice 2. Broker to provide appraisal invoice(s)
23. PTD | Fully Executed Acra Authorization for Automatic Mortgage Payment form AND copy of a voided check/bank print out with acct#/ABA# *ACH is required for loans closing in an Entity; If loan is not closing in the name of an Entity, the form must still be completed to elect yes (with voided check or stmt) or no and sign/dated. A $100 credit will be applied at funding to non-entity loans with ACH set up.
24. PTD | Vesting to be provided to show exact way borrower(s) will take title.  This will be used to draw loan documents
25. PTD | H06 Dwelling Coverage policy is required. HO6 hazard insurance policy (walls in coverage) that provides coverage sufficient to repair the condo unit to its condition prior to a loss claim event as determined by insurer. Max deductible 5% of dwelling coverage, but no more than $50,000. 12 months paid coverage required on purch, 6 on refi. If subject is a rental, 6 months gross rental income rent loss insurance coverage will be required if rental income is being used to qualify. At minimum, Rent l
26. PTD | **NOO BUSINESS PURPOSE AND FOREIGN NATIONAL LOANS **Provide Settlement Statement/HUD-1 from closing agent *Must include all pages and show the most updated fees. **Settlement agent must close using a HUD-1 Settlement Statement (Closing Disclosure is not applicable) Note: Any amendments to closing assets such as gifts, seller credits or contributions are to be directly alerted to underwriting for new condition work. Paid Off PaymentDebt TypeBalance

**Approved CLEAR (0):**
_None_

**Ignored (1):**
1. PTD | Property Tax Certificate for subject property and MUST be from the County Tax Assessors office. Must reflect millage/tax rates. NOTE: Subject property address on HOI, CPL, and Wire Instructions MUST match the legal address reflected on tax certificate/tax bill. (did not reach checker majority)

---

## acra — unknown-loan_Malki-_Outstanding_PTD_Conditions_4-16-26_2026-06-11.pdf

- **Parser:** Acra
- **Borrower:** —
- **Loan #:** 7516442
- **Parsed conditions:** 22 (0 PTF excluded)
- **Outcome:** approved_with_dissent (2/3 votes, 73% confidence)

**Checker votes:**
- Checker A (strict): REJECT (37%)
- Checker B (lenient): APPROVE (83%)
- Checker C (rules): APPROVE (100%)

**Issues:**
- [Checker A (strict)] 10 of 10 proposed ADD items are boilerplate, PTF/procedural notes, or administrative instructions that should not be stored as mortgage conditions
- [Checker A (strict)] NOTE 2001 is a procedural instruction about document expiration timing, not a substantive condition
- [Checker A (strict)] NOTE 2009 is seller contribution boilerplate policy, not a specific loan condition
- [Checker A (strict)] Conditions 4104, 4108, 4205, 4406, 4408, 4417, 4500, 4510 are legitimate underwriting conditions but proposed items extract them with administrative headers and mixed clarity
- [Checker A (strict)] Items bundle multiple conditions together (e.g., REO schedule properties with partial clearance status)
- [Checker A (strict)] PRIOR TO CD/DOC section header mixed into condition text inappropriately
- [Checker A (strict)] No legitimate CLEAR items proposed despite PDF showing partial clearances (4/16 on property 3600 Mystic Pointe; 4/13 on EMD image)
- [Checker A (strict)] Multiple proposed conditions are closing/PTD items (PTF), not mortgage conditions. Checker A rejects PTF/closing items per strict validation rules.
- [Checker A (strict)] Conditions 1, 6, 7, 8, 9, 10 are explicitly labeled 'PRIOR TO CD/DOC' (closing document) in the PDF, making them closing requirements, not loan conditions.
- [Checker A (strict)] Condition 2 (4600) contains a partial update note that modifies meaning; full source support unclear for CPA verification component.
- [Checker A (strict)] Condition 3 (4701) shows mixed status (CLEARED 4/13 for EMD, STILL MISSING escrow receipt), indicating partial completion rather than clear condition statement.
- [Checker A (strict)] Conditions 4, 5 are lender operational requirements (Acra to obtain/pull), not borrower mortgage conditions.
- [Checker A (strict)] High volume of closing/insurance/settlement documentation conditions unsuitable for mortgage condition tracking.
- [Checker A (strict)] First ADD item (15002) is a PTF/closing item - lender administrative task, not a borrower condition
- [Checker A (strict)] Second ADD item (15006) is a PTF/closing item - lender administrative disclosure task, not a borrower condition
- [Checker A (strict)] Second ADD item contains corrupted/merged text ('Paid Off PaymentDebt TypeBalance') suggesting extraction error
- [Checker A (strict)] Both proposed items fail the boilerplate/PTF filter and should not be tracked as active borrower conditions

**Approved ADD (22):**
1. PTD | NOTE: All doc expiration dates must have a minimum of 8 days remaining from the day that ALL other PTDs are cleared by UW; Broker to submit updated items along with final PTDs. **Refer to Expiration Dates section listed on Approval.
2. PTD | NOTE:  Contributions to buyers Recurring and Non-Recurring Closing Costs for Owner Occupied: <= 80% CLTV max 6.0%.
3. PTD | Signed/Dated LOE from Seller and Seller's Agent. Per the Purchase Contract (page 2 of 13), the closing is subject to court approval. **Updated 4/16/26: Property is in PROBATE*** Provide a copy of the Final Settlement from the Court for the Subject Property confiriming it is out of Probate.
4. PTD | Motivation letter for purchasing this property.
5. PTD | Copy of current mortgage statements, tax bills/hazard ins/HOA if applicable for all properties listed on REO schedule. 1. 3600 Mystic Pointe Dr. #1417, Aventura, FL >>CLEARED 4/16 2. 501 36th St., West Palm Beach, FL >>STILL missing Property Tax Bill
6. PTD | HOA documents requirement for subject: If delinquencies exceed 15% (60+ days) and/or litigation exists, provide the latest P&L, current budget, and if litigation, a case summary with attorneys opinion letter.
7. PTD | **4/13/2026 SIRS review completed 1. HOA to confirm the following item has been repaired or provide estimate of completion: i. Windows & Exterior Doors 2. Provide current balance sheet/P&L **Subject to additional conditions No. PRIOR TO CD/DOC Rev. 02/07/2024
8. PTD | Appraisal Update / Correction Required for the Following: 1. Present Land Use: Commercial land use is marked at 20%; however, the comments indicate the commercial space is estimated at 3% or less. Please reconcile. 2.Off Site Improvements Type: Street is marked as Public, but the comments note Private Roads maintained by the Association. Please confirm and revise as needed. 3. Garage Photo: Photo show scaffolding and barriers at the garage entrance. Please confirm whether there is any current or
9. PTD | Full Alta 2006, 2016 Preliminary Title Report or ALTA Extended Policy (7-1-21) with 24 month chain of title and plat map/survey.
10. PTD | Property Tax Certificate for subject property and MUST be from the County Tax Assessors office. Must reflect millage/tax rates. NOTE: Subject property address on HOI, CPL, and Wire Instructions MUST match the legal address reflected on tax certificate/tax bill.
11. PTD | Florida: Title to provide Survey. If Survey is not current, older survey (10 years or older) an affidavit is to be provided. Form 9 Endorsement will be required on all Florida loans. Additional conditions may apply.
12. PTD | Proof of self-employment for the last two years to include ownership percentage of Applicant(s) of their company BE HOME CORP **4/16/26 - Provide CPA license verification
13. PTD | Closing asset documentation: 1) An image of the EMD payment, via copy of check, outgoing wire, or Bank Statement reflective of clearance AND >>CLEARED 4/13 2) An escrow deposit receipt. >>STILL MISSING
14. PTD | Satisfactory Flood Certification & Determination (to be pulled by Acra). File is subject to flood insurance policy if determined to be in a flood zone. Additional conditions may apply.
15. PTD | Acra to obtain Agent Verification upon receipt of the following: 1) Wire instructions to include one specific loan identifier (ie; title order #, borrower's name, loan number or subject address). 2) CPL to include Lender Loss Payee: Citadel Servicing Corp. dba Acra Lending, ISAOA/ATIMA - 3 Ada Parkway #200A, Irvine, CA 92618/ loan #/ borrower name.
16. PTD | Vesting to be provided to show exact way borrower(s) will take title.  This will be used to draw loan documents
17. PTD | Acceptable HO6 hazard insurance policy (walls in coverage) that provides coverage sufficient to repair the condo unit to its condition prior to a loss claim event as determined by insurer. Please refer to the Acra Insurance Guide for all required coverages and loss payee.
18. PTD | Acceptable Flood Insurance policy equal to loan amount (or $250,000 max coverage), 100% replacement or guaranteed replacement cost. Please refer to the Acra Insurance Guide for all required coverages and loss payee. 4/9- Flood policy needs to list our subject property address (unit # not required)
19. PTD | Settlement statement or closing disclosure.  Please include all fees and payoffs.
20. PTD | Acknowledgment of Redisclosures from borrower. Package sent electronically for e-signature via DocMagic portal
21. PTD | Broker to confirm loan fees on Fee Validation email sent by Account Manager.  *terms must match current approval
22. PTD | Borrower must acknowledge receipt of all valuation items (Appraisal(s), Appraisal Analysis, BPO (if applicable). **Lender will disclose Appraisal to borrower. Paid Off PaymentDebt TypeBalance

**Approved CLEAR (0):**
_None_

---

## acra — unknown-loan_Malki_-_7516442_-_Approval_-_4-8-26_2026-06-11.pdf

- **Parser:** Acra
- **Borrower:** —
- **Loan #:** 7516442
- **Parsed conditions:** 28 (0 PTF excluded)
- **Outcome:** approved_with_dissent (2/3 votes, 75% confidence)

**Checker votes:**
- Checker A (strict): REJECT (33%)
- Checker B (lenient): APPROVE (92%)
- Checker C (rules): APPROVE (100%)

**Issues:**
- [Checker A (strict)] ADD items 1-2: Generic boilerplate/PTF notes - reject per strict validation rules
- [Checker A (strict)] ADD items 3-9: All marked as 'PTD' but appear in PRIOR TO DOC section of PDF - correct label should be 'PTD' not 'PTD |' prefix; however, substantive conditions are PDF-supported
- [Checker A (strict)] CLEAR item: Condition 16003 shows cleared date 04/07/2026 in PDF, but proposed item references 16003 without cleared date verification - approve clear action
- [Checker A (strict)] Confidence lowered due to labeling inconsistencies and boilerplate rejection reducing valid add count
- [Checker A (strict)] PTD items should not be added as mortgage conditions - these are closing/funding stage items, not underwriting conditions
- [Checker A (strict)] Most proposed items are labeled 'PTD' (Prior To Fund) which are administrative/closing logistics, not credit conditions
- [Checker A (strict)] Incomplete item 3: text cuts off mid-sentence ('If marked "yes" to' with no continuation)
- [Checker A (strict)] Confidence lowered due to systematic misclassification of document stage requirements
- [Checker A (strict)] All 8 proposed ADD items are PTF (Prior to Fund) or closing/boilerplate items. Per instructions, PTF/closing items and boilerplate must be rejected.
- [Checker A (strict)] These are standard loan closing requirements, not conditions requiring active borrower action or underwriting verification.
- [Checker A (strict)] Items like insurance policies, closing disclosures, and settlement statements are closing deliverables, not mortgage conditions.
- [Checker A (strict)] Items 16005, 16006, 16007, 16008, 16012, 16013, 16015, 16017, 6012, 8001, 8009 are administrative/closing requirements, not conditions.

**Approved ADD (28):**
1. PTD | NOTE: All doc expiration dates must have a minimum of 8 days remaining from the day that ALL other PTDs are cleared by UW; Broker to submit updated items along with final PTDs. **Refer to Expiration Dates section listed on Approval.
2. PTD | NOTE:  Contributions to buyers Recurring and Non-Recurring Closing Costs for Owner Occupied: <= 80% CLTV max 6.0%.
3. PTD | Credit Report corrections required. >>Subject to Acra's credit reissue. 1. Correct borrower's DOB to 10/01/1984 (not 1994) 2. Correct Borrower's Last Name to Kook per Purchase Contract (if applicable)
4. PTD | Broker to provide completed 1003. --Section 7 Military Service: Y/N
5. PTD | Signed/Dated LOE from Seller and Seller's Agent. Per the Purchase Contract (page 2 of 13), the closing is subject to court approval. **Please confirm whether the property is in probate, a short sale, a deed-in-lieu, or a similar status.
6. PTD | Motivation letter for purchasing this property.
7. PTD | Copy of current mortgage statements, tax bills/hazard ins/HOA if applicable for all properties listed on REO schedule. 1. 3600 Mystic Pointe Dr. #1417, Aventura, FL 2. 501 36th St., West Palm Beach, FL
8. PTD | Unexpired Picture Identification (Driver's License/Passport) for all borrowers.
9. PTD | Copy of social security card OR fully completed and executed SSA-89 form (either electronic or wet signature) for all applicable borrowers.
10. PTD | HOA Certification
11. PTD | HOA Documents: HOA Master insurance policy Walls out coverage: $1M Liability, Correct HOA name as the Insured Party and Building subject Property Address must include our unit in description and borrower's HO6 OR HOA Master Insurance policy Walls In coverage that includes improvements and betterments, reflect CSC loss payee clause / loan # / borrower's name / subject address & unit # for policy coverage.
12. PTD | HOA documents requirement for subject: If delinquencies exceed 15% (60+ days) and/or litigation exists, provide the latest P&L, current budget, and if litigation, a case summary with attorneys opinion letter.
13. PTD | HOA documents required for subject if Florida Condo:  Florida Addendum to Acra Lending's HOA Cert.  If marked "yes" to
14. PTD | Closing asset documentation: Copy of the borrowers most recent bank statement(s) for the account(s) in which the funds to close are to be withdrawn.
15. PTD | Closing asset documentation: 1) An image of the EMD payment, via copy of check, outgoing wire, or Bank Statement reflective of clearance AND 2) An escrow deposit receipt.
16. PTD | Reserves for LTV >75% up to 85%: Most recent asset statement covering at least the last 30 days for 6 months PITIA (per Exception) reserves to support sufficient sourced seasoned funds. --If using business assets, borrower(s) must be 100% owner of company.
17. PTD | Satisfactory Flood Certification & Determination (to be pulled by Acra). File is subject to flood insurance policy if determined to be in a flood zone. Additional conditions may apply.
18. PTD | Broker to confirm loan fees on Fee Validation email sent by Account Manager.  *terms must match current approval
19. PTD | Borrower must acknowledge receipt of all valuation items (Appraisal(s), Appraisal Analysis, BPO (if applicable). **Lender will disclose Appraisal to borrower.
20. PTD | Acra to obtain Agent Verification upon receipt of the following: 1) Wire instructions to include one specific loan identifier (ie; title order #, borrower's name, loan number or subject address). 2) CPL to include Lender Loss Payee: Citadel Servicing Corp. dba Acra Lending, ISAOA/ATIMA - 3 Ada Parkway #200A, Irvine, CA 92618/ loan #/ borrower name.
21. PTD | 1. Broker to provide credit report invoice 2. Broker to provide appraisal invoice(s)
22. PTD | Fully Executed Acra Authorization for Automatic Mortgage Payment form AND copy of a voided check/bank print out with acct#/ABA# *ACH is required for loans closing in an Entity; If loan is not closing in the name of an Entity, the form must still be completed to elect yes (with voided check or stmt) or no and sign/dated. A $100 credit will be applied at funding to non-entity loans with ACH set up.
23. PTD | Vesting to be provided to show exact way borrower(s) will take title.  This will be used to draw loan documents
24. PTD | If the borrower is using a POA (Power of Attorney), all items listed must be satisfied: 1. Executed copy of Specific POA (can not accept Durable POA). If signed outside of US, must be executed at US Embassy 2. Title to acknowledge they have reviewed and approved POA; that POA will be recorded concurrently with the Security Instrument; that they will provide a recorded copy of the POA to Acra Lending 3. Relationship letter and explanation for reason using POA 4. Copy of ID for Attorney in Fact (m
25. PTD | Acceptable HO6 hazard insurance policy (walls in coverage) that provides coverage sufficient to repair the condo unit to its condition prior to a loss claim event as determined by insurer. Please refer to the Acra Insurance Guide for all required coverages and loss payee.
26. PTD | Acceptable Flood Insurance policy equal to loan amount (or $250,000 max coverage), 100% replacement or guaranteed replacement cost. Please refer to the Acra Insurance Guide for all required coverages and loss payee.
27. PTD | Settlement statement or closing disclosure.  Please include all fees and payoffs.
28. PTD | Acknowledgment of Redisclosures from borrower. Package sent electronically for e-signature via DocMagic portal 6012If closing funds are coming from same personal account that is being used for reserves, provide online bank account activity ledger after closing funds have cleared the account to document that the reserve amount still meets requirements. 8001Standard Requirements: 1. All property taxes to be paid current in escrow; 2. Loan to be impounded for taxes/insurance; 3. Receipt and review

**Approved CLEAR (1):**
1. PTD | Acra Lending Signed Notice of Intent to Proceed with Loan Application form or email notification of borrower's Intent to Proceed.

---

## acra — unknown-loan_Malki_-_7516442_-_Initial_Approval_-_4-6-26_2026-06-11.pdf

- **Parser:** Acra
- **Borrower:** —
- **Loan #:** 7516442
- **Parsed conditions:** 28 (0 PTF excluded)
- **Outcome:** approved_with_dissent (2/3 votes, 84% confidence)

**Checker votes:**
- Checker A (strict): REJECT (59%)
- Checker B (lenient): APPROVE (93%)
- Checker C (rules): APPROVE (100%)

**Issues:**
- [Checker A (strict)] Multiple items are PTF/closing boilerplate or process notes, not substantive mortgage conditions
- [Checker A (strict)] Item 1 is a procedural NOTE about expiration dates, not a condition to validate
- [Checker A (strict)] Item 2 duplicates boilerplate already in section 8010; appears twice in document
- [Checker A (strict)] Item 4 (1003 completion) is a PTF administrative requirement, not a loan condition
- [Checker A (strict)] Item 5 mixes a legitimate condition (LOE from Seller/Agent) with a PTF item (court approval confirmation)
- [Checker A (strict)] Items 6-10 are standard documentation requirements, not substantive underwriting conditions
- [Checker A (strict)] Multiple proposed items are PTF (Prior to Fund) conditions, not standalone conditions—they are closing/funding logistics
- [Checker A (strict)] Items 16003, 16005, 16006, 16007, 16008, 16012, 16013, 16015, 6012, 8001 are boilerplate closing/funding requirements, not mortgage underwriting conditions
- [Checker A (strict)] Item combining 16015 + 6012 + 8001 is malformed concatenation mixing multiple unrelated requirements
- [Checker A (strict)] PTF conditions lack borrower-specific contingencies and are administrative/lender-side requirements
- [Checker A (strict)] No CLEAR items proposed despite PDF showing multiple conditions in 'PRIOR TO DOC' section with cleared dates

**Approved ADD (28):**
1. PTD | NOTE: All doc expiration dates must have a minimum of 8 days remaining from the day that ALL other PTDs are cleared by UW; Broker to submit updated items along with final PTDs. **Refer to Expiration Dates section listed on Approval.
2. PTD | NOTE:  Contributions to buyers Recurring and Non-Recurring Closing Costs for Owner Occupied: <= 80% CLTV max 6.0%.
3. PTD | Credit Report corrections required. >>Subject to Acra's credit reissue. 1. Correct borrower's DOB to 10/01/1984 (not 1994) 2. Correct Borrower's Last Name to Kook per Purchase Contract (if applicable)
4. PTD | Broker to provide completed 1003. --Section 7 Military Service: Y/N
5. PTD | Signed/Dated LOE from Seller and Seller's Agent. Per the Purchase Contract (page 2 of 13), the closing is subject to court approval. **Please confirm whether the property is in probate, a short sale, a deed-in-lieu, or a similar status.
6. PTD | Copy of current mortgage statements, tax bills/hazard ins/HOA if applicable for all properties listed on REO schedule. 1. 3600 Mystic Pointe Dr. #1417, Aventura, FL 2. 501 36th St., West Palm Beach, FL
7. PTD | Unexpired Picture Identification (Driver's License/Passport) for all borrowers.
8. PTD | Copy of social security card OR fully completed and executed SSA-89 form (either electronic or wet signature) for all applicable borrowers.
9. PTD | HOA Certification
10. PTD | HOA Documents: HOA Master insurance policy Walls out coverage: $1M Liability, Correct HOA name as the Insured Party and Building subject Property Address must include our unit in description and borrower's HO6 OR HOA Master Insurance policy Walls In coverage that includes improvements and betterments, reflect CSC loss payee clause / loan # / borrower's name / subject address & unit # for policy coverage.
11. PTD | HOA documents requirement for subject: If delinquencies exceed 15% (60+ days) and/or litigation exists, provide the latest P&L, current budget, and if litigation, a case summary with attorneys opinion letter.
12. PTD | HOA documents required for subject if Florida Condo:  Florida Addendum to Acra Lending's HOA Cert.  If marked "yes" to
13. PTD | Full Alta 2006, 2016 Preliminary Title Report or ALTA Extended Policy (7-1-21) with 24 month chain of title and plat map/survey.
14. PTD | Closing asset documentation: Copy of the borrowers most recent bank statement(s) for the account(s) in which the funds to close are to be withdrawn.
15. PTD | Closing asset documentation: 1) An image of the EMD payment, via copy of check, outgoing wire, or Bank Statement reflective of clearance AND 2) An escrow deposit receipt.
16. PTD | Reserves for LTV >75% up to 85%: Most recent asset statement covering at least the last 30 days for 6 months PITIA (per Exception) reserves to support sufficient sourced seasoned funds. --If using business assets, borrower(s) must be 100% owner of company.
17. PTD | Satisfactory Flood Certification & Determination (to be pulled by Acra). File is subject to flood insurance policy if determined to be in a flood zone. Additional conditions may apply.
18. PTD | Broker to confirm loan fees on Fee Validation email sent by Account Manager.  *terms must match current approval
19. PTD | Borrower must acknowledge receipt of all valuation items (Appraisal(s), Appraisal Analysis, BPO (if applicable). **Lender will disclose Appraisal to borrower.
20. PTD | Acra Lending Signed Notice of Intent to Proceed with Loan Application form or email notification of borrower's Intent to Proceed.
21. PTD | Acra to obtain Agent Verification upon receipt of the following: 1) Wire instructions to include one specific loan identifier (ie; title order #, borrower's name, loan number or subject address). 2) CPL to include Lender Loss Payee: Citadel Servicing Corp. dba Acra Lending, ISAOA/ATIMA - 3 Ada Parkway #200A, Irvine, CA 92618/ loan #/ borrower name.
22. PTD | 1. Broker to provide credit report invoice 2. Broker to provide appraisal invoice(s)
23. PTD | Fully Executed Acra Authorization for Automatic Mortgage Payment form AND copy of a voided check/bank print out with acct#/ABA# *ACH is required for loans closing in an Entity; If loan is not closing in the name of an Entity, the form must still be completed to elect yes (with voided check or stmt) or no and sign/dated. A $100 credit will be applied at funding to non-entity loans with ACH set up.
24. PTD | Vesting to be provided to show exact way borrower(s) will take title.  This will be used to draw loan documents
25. PTD | If the borrower is using a POA (Power of Attorney), all items listed must be satisfied: 1. Executed copy of Specific POA (can not accept Durable POA). If signed outside of US, must be executed at US Embassy 2. Title to acknowledge they have reviewed and approved POA; that POA will be recorded concurrently with the Security Instrument; that they will provide a recorded copy of the POA to Acra Lending 3. Relationship letter and explanation for reason using POA 4. Copy of ID for Attorney in Fact (m
26. PTD | Acceptable HO6 hazard insurance policy (walls in coverage) that provides coverage sufficient to repair the condo unit to its condition prior to a loss claim event as determined by insurer. Please refer to the Acra Insurance Guide for all required coverages and loss payee.
27. PTD | Acceptable Flood Insurance policy equal to loan amount (or $250,000 max coverage), 100% replacement or guaranteed replacement cost. Please refer to the Acra Insurance Guide for all required coverages and loss payee.
28. PTD | Settlement statement or closing disclosure. Please include all fees and payoffs. 6012If closing funds are coming from same personal account that is being used for reserves, provide online bank account activity ledger after closing funds have cleared the account to document that the reserve amount still meets requirements. 8001Standard Requirements: 1. All property taxes to be paid current in escrow; 2. Loan to be impounded for taxes/insurance; 3. Receipt and review of the above conditions may re

**Approved CLEAR (0):**
_None_

---

## acra — unknown-loan_Ofir_Acra_approval_2026-06-11.pdf

- **Parser:** Acra
- **Borrower:** —
- **Loan #:** 7515893
- **Parsed conditions:** 25 (1 PTF excluded)
- **Outcome:** approved_with_dissent (2/3 votes, 74% confidence)

**Checker votes:**
- Checker A (strict): REJECT (33%)
- Checker B (lenient): APPROVE (89%)
- Checker C (rules): APPROVE (100%)

**Issues:**
- [Checker A (strict)] All 10 ADD items are PTF/boilerplate notes or closing items—not mortgage conditions requiring borrower action
- [Checker A (strict)] Items 2001, 2007, 2009, 2016, 4102 are procedural notes, not enforceable conditions
- [Checker A (strict)] Items 4203-4417 are document requests but lack specificity on borrower obligations vs. broker/lender tasks
- [Checker A (strict)] CLEAR item 4515 appears in PTD section (not marked cleared in PDF)—no evidence of clearance
- [Checker A (strict)] Confidence cannot reach 0.85 when primary content is procedural boilerplate and document logistics
- [Checker A (strict)] All 10 proposed ADD items are labeled 'PTD' (Prior To Fund) — these are closing/funding stage items, not conditions for preliminary approval validation
- [Checker A (strict)] Checker A validates mortgage CONDITIONS (underwriting requirements), not PTF checklist items
- [Checker A (strict)] PTF items belong in closing workflow, not conditional approval tracking
- [Checker A (strict)] No CLEAR items proposed, so no cleared conditions to validate
- [Checker A (strict)] Confidence reduced due to fundamental category mismatch: these are process/document deliverables, not loan conditions
- [Checker A (strict)] All 4 proposed ADD items are PTF (Prior To Fund) closing/processing conditions, not mortgage conditions. Per instructions, PTF/closing items must be rejected.
- [Checker A (strict)] These are administrative/document collection items, not substantive loan conditions affecting borrower obligations or property eligibility.
- [Checker A (strict)] Conditions 16005, 16006, 16007, 16008 are boilerplate standard closing requirements, not loan-specific conditions.

**Approved ADD (24):**
1. PTD | NOTE: All doc expiration dates must have a minimum of 8 days remaining from the day that ALL other PTDs are cleared by UW; Broker to submit updated items along with final PTDs. **Refer to Expiration Dates section listed on Approval.
2. PTD | NOTE:  Appraisal has been received and is pending review by Acra Lending.
3. PTD | NOTE: Contributions to buyers Recurring and Non-Recurring Closing Costs for Owner Occupied: <= 80% CL TV max 6.0%. **No Seller Credit
4. PTD | Note: Desk Review required; Acra lending will order. 48-72 hour turn time. Additional conditions may apply. *Note: There is no borrower cost associated with the Desk Review.
5. PTD | Broker to provide completed 1003. 1. Add 210 174th St #1918 - add to REO Section 2. Add monthly income for previous self-employment (Fair Contractor Sales LLC) 3. Add mortgage to the Whispering Way property in the REO Section
6. PTD | Need updated mortgage transaction history for Citadel #5530 - dates are cut off.
7. PTD | Copy of current mortgage statements, tax bills/hazard ins/HOA if applicable for all properties listed on REO schedule. 210 174th St #1918 - need taxes, insurance, HOA
8. PTD | Copy of social security card OR fully completed and executed SSA-89 form (either electronic or wet signature) for all applicable borrowers.
9. PTD | Appraisal is rec'd and in line for review. Complete original appraisal with interior/exterior photos of subject & comps. PDF and XML format required.
10. PTD | Appraisal Update/Correction Required for the following: 1. Appraiser to correct and show that the property is on a private road (gated community). 2. Appraiser to comment on who maintains the private road.
11. PTD | Sale of property to be used for funds to close: Provide the final closing statement for the sale of 4936 Whispering Way, along with proof of deposit into the borrowers account or deposit to escrow/title. **Rec'd est closing statement - final closing statement should have the name of mortgage company that is being paid off.
12. PTD | Borrower to provide signed LOE stating name of their business, how it is set up (Inc., LLC, etc.), what their business does and the number of employees. Rev. 09/26/2025
13. PTD | Purchase contract - need the following - Homeowners Assn Appraisal contingency Sale of buyers Property Pace Disclosure Flood Disclosure Owners Property Disclosure
14. PTD | Satisfactory Flood Certification & Determination (to be pulled by Acra). File is subject to flood insurance policy if determined to be in a flood zone. Additional conditions may apply.
15. PTD | Broker to provide fully executed legible copy of Acra SSA-89 form for processing due to variance on credit report. Electronic signature is acceptable.
16. PTD | Acceptable Hazard insurance policy equal to the loan amount or 100% replacement or guaranteed replacement cost. Please refer to the Acra Insurance Guide for all required coverages and loss payee.
17. PTD | Broker to confirm loan fees on Fee Validation email sent by Account Manager.  *terms must match current approval
18. PTD | Borrower must acknowledge receipt of all valuation items (Appraisal(s), Appraisal Analysis, BPO (if applicable). **Lender will disclose Appraisal to borrower.
19. PTD | Acra Lending Signed Notice of Intent to Proceed with Loan Application form or email notification of borrower's Intent to Proceed.
20. PTD | Acra to obtain Agent Verification upon receipt of the following: 1) Wire instructions to include one specific loan identifier (ie; title order #, borrower's name, loan number or subject address). 2) CPL to include Lender Loss Payee: Citadel Servicing Corp. dba Acra Lending, ISAOA/ATIMA - 3 Ada Parkway #200A, Irvine, CA 92618/ loan #/ borrower name.
21. PTD | 1. Broker to provide credit report invoice 2. Broker to provide appraisal invoice(s)
22. PTD | Fully Executed Acra Authorization for Automatic Mortgage Payment form AND copy of a voided check/bank print out with acct#/ABA# *ACH is required for loans closing in an Entity; If loan is not closing in the name of an Entity, the form must still be completed to elect yes (with voided check or stmt) or no and sign/dated. A $100 credit will be applied at funding to non-entity loans with ACH set up.
23. PTD | Vesting to be provided to show exact way borrower(s) will take title.  This will be used to draw loan documents
24. PTD | If the borrower is using a POA (Power of Attorney), all items listed must be satisfied: 1. Executed copy of Specific POA (can not accept Durable POA). If signed outside of US, must be executed at US Embassy 2. Title to acknowledge they have reviewed and approved POA; that POA will be recorded concurrently with the Security Instrument; that they will provide a recorded copy of the POA to Acra Lending 3. Relationship letter and explanation for reason using POA 4. Copy of ID for Attorney in Fact (m

**Approved CLEAR (0):**
_None_

**Ignored (1):**
1. PTD | Florida: Title to provide Survey. If Survey is not current, older survey (10 years or older) an affidavit is to be provided. Form 9 Endorsement will be required on all Florida loans. Additional conditions may apply. (did not reach checker majority)

---

## newrez — 9758676861_9758676861_Loan_Approval_2026-06-11.pdf

- **Parser:** Newrez
- **Borrower:** Rafael Sidi
- **Loan #:** 9758676861
- **Parsed conditions:** 23 (0 PTF excluded)
- **Outcome:** auto_approved (3/3 votes, 95% confidence)

**Checker votes:**
- Checker A (strict): APPROVE (93%)
- Checker B (lenient): APPROVE (91%)
- Checker C (rules): APPROVE (100%)

**Approved ADD (22):**
1. PTA | Provide unexpired Master HOA Certificate of Property/Hazard Insurance policy to the Project Review Department (PRD) at ProjectReview@newrez.com. If unit is in a flood zone; include Master Flood Insurance dec page.
2. PTA | Limited/Streamline condo review is required by Project Review Department (PRD). Send Project Review request to ProjectReview@newrez.com
3. PTCD | All 3rd party invoices specific to this transaction (i.e. appraisal, credit report, title fees, 3rd party processor, HOA cert, subordination, etc.) necessary to complete Closing Disclosure.
4. PTCD | Acceptable Preliminary Title Report, Closing Protection Letter, and WIRING INSTRUCTIONS specific to the loan transaction. Title to include chain of title, an Alta Extended Loan Policy with the final total loan amount, and an Owners Policy amount with the final purchase price (if applicable).
5. PTCD | Address for the Settlement Agent on Title, CPL and Wiring Instructions must match. CPL address to read: Newrez LLC ISAOA/ATIMA 1100 Virginia Dr., Suite 125, Fort Washington, .
6. PTCD | Confirm Settlement Agent email address and Prelim Order Number have been entered in contact screen.
7. PTCD | Provide copy of HO6 policy if Master Condo/Co-op insurance Policy does not provide interior coverage AKA "Walls in"
8. PTD | Provide tax sheet for subject property. For New Construction provide estimated taxes for both land and improvements.
9. PTD | Provide legal residency documentation for the permanent or non-permanent resident, appropriate for product and residency status.
10. PTD | Borrower to provide a copy of fully executed purchase contract with all addendums and/or counter offers with the sales price shown on your mortgage application.
11. PTD | Condition Update 06/02/2026: Missing Condominium Rider and Sellers Agreement with Respect to Buyers Broker Compensation
12. PTD | Provide most recent 12 months consecutive bank statements being used for income qualification.
13. PTD | Condition Update 06/02/2026: Borrower to provide TD Bank statement dated 5/3/26 for account *7671.
14. PTD | Borrower to provide fully executed letter from business CPA confirming borrowers ownership percentage in MREL INC DBA Beach Cafe and Pizza and the date the borrower became at least a 25% owner. Alternatively, provide business formation document filed with the state along with operating agreement/partnership agreement showing the business ownership percentage.
15. PTD | Borrower to provide a copy of the cancelled earnest money check (EMD) and evidence that the funds have cleared the account with updated account balance.
16. PTD | Borrower to provide most recent 2 months bank statements, all pages, verifying sufficient assets needed for closing and required reserves. Current funds needed for closing: $49,125.00 and required reserves $5,811.00. Borrower is currently short $17,077.00.
17. PTD | Provide written verification of rent for 200 South Birch RD APT 315 Fort Lauderdale, FL 33316. Alternatively, borrower to provide a copy of the current lease and the most recent 12 months checks or bank statements showing satisfactory payments.
18. PTD | Third party sources indicates foreclosure/deed in lieu of foreclosure 12/24/25 on property located at 500 Three Islands BLVD, M23 Hallandale,Beach, FL 33009. Borrower to provide documentation to meet guidelines.
19. PTD | A survey is required. If no survey; title must supply an ALTA 9 endorsement or be free of any survey exceptions. (Not applicable on uninsured products).
20. PTD | Provide borrower executed Anti-Coercion Statement with insurance company selection completed.
21. PTD | Each borrower to provide a valid acceptable form of identification.
22. PTD | Self Employed income used to qualify. Third Party documentation of Self Employment required. This includes verification of a phone listing and address for the borrower’s business, or verification through a third party such as a CPA, regulatory agency or applicable licensing bureau.

**Approved CLEAR (0):**
_None_

**Ignored (1):**
1. PTCD | Condition Update 06/10/2026: Pending prelim CD (did not reach checker majority)

---

## newrez — 9758676861_9758676861_Loan_Approval_2026-06-11_1.pdf

- **Parser:** Newrez
- **Borrower:** Rafael Sidi
- **Loan #:** 9758676861
- **Parsed conditions:** 22 (0 PTF excluded)
- **Outcome:** auto_approved (3/3 votes, 95% confidence)

**Checker votes:**
- Checker A (strict): APPROVE (93%)
- Checker B (lenient): APPROVE (92%)
- Checker C (rules): APPROVE (100%)

**Approved ADD (22):**
1. PTA | Provide unexpired Master HOA Certificate of Property/Hazard Insurance policy to the Project Review Department (PRD) at ProjectReview@newrez.com. If unit is in a flood zone; include Master Flood Insurance dec page.
2. PTA | Limited/Streamline condo review is required by Project Review Department (PRD). Send Project Review request to ProjectReview@newrez.com
3. PTCD | All 3rd party invoices specific to this transaction (i.e. appraisal, credit report, title fees, 3rd party processor, HOA cert, subordination, etc.) necessary to complete Closing Disclosure.
4. PTCD | Acceptable Preliminary Title Report, Closing Protection Letter, and WIRING INSTRUCTIONS specific to the loan transaction. Title to include chain of title, an Alta Extended Loan Policy with the final total loan amount, and an Owners Policy amount with the final purchase price (if applicable).
5. PTCD | Address for the Settlement Agent on Title, CPL and Wiring Instructions must match. CPL address to read: Newrez LLC ISAOA/ATIMA 1100 Virginia Dr., Suite 125, Fort Washington, .
6. PTCD | Confirm Settlement Agent email address and Prelim Order Number have been entered in contact screen.
7. PTCD | Provide copy of HO6 policy if Master Condo/Co-op insurance Policy does not provide interior coverage AKA "Walls in"
8. PTD | Provide tax sheet for subject property. For New Construction provide estimated taxes for both land and improvements.
9. PTD | Provide legal residency documentation for the permanent or non-permanent resident, appropriate for product and residency status.
10. PTD | Borrower to provide a copy of fully executed purchase contract with all addendums and/or counter offers with the sales price shown on your mortgage application.
11. PTD | Condition Update 06/02/2026: Missing Condominium Rider and Sellers Agreement with Respect to Buyers Broker Compensation
12. PTD | Provide most recent 12 months consecutive bank statements being used for income qualification.
13. PTD | Condition Update 06/02/2026: Borrower to provide TD Bank statement dated 5/3/26 for account *7671.
14. PTD | Borrower to provide fully executed letter from business CPA confirming borrowers ownership percentage in MREL INC DBA Beach Cafe and Pizza and the date the borrower became at least a 25% owner. Alternatively, provide business formation document filed with the state along with operating agreement/partnership agreement showing the business ownership percentage.
15. PTD | Borrower to provide a copy of the cancelled earnest money check (EMD) and evidence that the funds have cleared the account with updated account balance.
16. PTD | Borrower to provide most recent 2 months bank statements, all pages, verifying sufficient assets needed for closing and required reserves. Current funds needed for closing: $49,125.00 and required reserves $5,811.00. Borrower is currently short $17,077.00.
17. PTD | Provide written verification of rent for 200 South Birch RD APT 315 Fort Lauderdale, FL 33316. Alternatively, borrower to provide a copy of the current lease and the most recent 12 months checks or bank statements showing satisfactory payments.
18. PTD | Third party sources indicates foreclosure/deed in lieu of foreclosure 12/24/25 on property located at 500 Three Islands BLVD, M23 Hallandale,Beach, FL 33009. Borrower to provide documentation to meet guidelines.
19. PTD | A survey is required. If no survey; title must supply an ALTA 9 endorsement or be free of any survey exceptions. (Not applicable on uninsured products).
20. PTD | Provide borrower executed Anti-Coercion Statement with insurance company selection completed.
21. PTD | Each borrower to provide a valid acceptable form of identification.
22. PTD | Self Employed income used to qualify. Third Party documentation of Self Employment required. This includes verification of a phone listing and address for the borrower’s business, or verification through a third party such as a CPA, regulatory agency or applicable licensing bureau.

**Approved CLEAR (0):**
_None_

---

## newrez — 9758676861_9758676861_Loan_Approval_2026-06-11_2.pdf

- **Parser:** Newrez
- **Borrower:** Rafael Sidi
- **Loan #:** 9758676861
- **Parsed conditions:** 23 (0 PTF excluded)
- **Outcome:** approved_with_dissent (2/3 votes, 89% confidence)

**Checker votes:**
- Checker A (strict): REJECT (76%)
- Checker B (lenient): APPROVE (92%)
- Checker C (rules): APPROVE (100%)

**Issues:**
- [Checker A (strict)] PTD classification is incorrect - most proposed items are listed under 'TO CLEAR# PTD - Prior to Docs' in PDF but belong in PTD category per extraction
- [Checker A (strict)] Multiple conditions lack clear PDF support or contain paraphrasing that alters meaning
- [Checker A (strict)] Several items appear to be boilerplate or standard closing procedures rather than loan-specific conditions
- [Checker A (strict)] Condition Update 06/02/2026 items reference missing documents but lack specificity on resolution requirements

**Approved ADD (23):**
1. PTA | Provide unexpired Master HOA Certificate of Property/Hazard Insurance policy to the Project Review Department (PRD) at ProjectReview@newrez.com. If unit is in a flood zone; include Master Flood Insurance dec page.
2. PTA | Limited/Streamline condo review is required by Project Review Department (PRD). Send Project Review request to ProjectReview@newrez.com
3. PTCD | All 3rd party invoices specific to this transaction (i.e. appraisal, credit report, title fees, 3rd party processor, HOA cert, subordination, etc.) necessary to complete Closing Disclosure.
4. PTCD | Acceptable Preliminary Title Report, Closing Protection Letter, and WIRING INSTRUCTIONS specific to the loan transaction. Title to include chain of title, an Alta Extended Loan Policy with the final total loan amount, and an Owners Policy amount with the final purchase price (if applicable).
5. PTCD | Address for the Settlement Agent on Title, CPL and Wiring Instructions must match. CPL address to read: Newrez LLC ISAOA/ATIMA 1100 Virginia Dr., Suite 125, Fort Washington, .
6. PTCD | Confirm Settlement Agent email address and Prelim Order Number have been entered in contact screen.
7. PTCD | Provide copy of HO6 policy if Master Condo/Co-op insurance Policy does not provide interior coverage AKA "Walls in"
8. PTD | Provide tax sheet for subject property. For New Construction provide estimated taxes for both land and improvements.
9. PTD | NewRez to obtain a third party appraisal analysis report (CDA: Collateral Desk Analysis) must be obtained upon receipt of appraisal. Additional conditions may apply.
10. PTD | Provide legal residency documentation for the permanent or non-permanent resident, appropriate for product and residency status.
11. PTD | Borrower to provide a copy of fully executed purchase contract with all addendums and/or counter offers with the sales price shown on your mortgage application.
12. PTD | Condition Update 06/02/2026: Missing Condominium Rider and Sellers Agreement with Respect to Buyers Broker Compensation
13. PTD | Provide most recent 12 months consecutive bank statements being used for income qualification.
14. PTD | Condition Update 06/02/2026: Borrower to provide TD Bank statement dated 5/3/26 for account *7671.
15. PTD | Borrower to provide fully executed letter from business CPA confirming borrowers ownership percentage in MREL INC DBA Beach Cafe and Pizza and the date the borrower became at least a 25% owner. Alternatively, provide business formation document filed with the state along with operating agreement/partnership agreement showing the business ownership percentage.
16. PTD | Borrower to provide a copy of the cancelled earnest money check (EMD) and evidence that the funds have cleared the account with updated account balance.
17. PTD | Borrower to provide most recent 2 months bank statements, all pages, verifying sufficient assets needed for closing and required reserves. Current funds needed for closing: $49,125.00 and required reserves $5,811.00. Borrower is currently short $17,077.00.
18. PTD | Provide written verification of rent for 200 South Birch RD APT 315 Fort Lauderdale, FL 33316. Alternatively, borrower to provide a copy of the current lease and the most recent 12 months checks or bank statements showing satisfactory payments.
19. PTD | Third party sources indicates foreclosure/deed in lieu of foreclosure 12/24/25 on property located at 500 Three Islands BLVD, M23 Hallandale,Beach, FL 33009. Borrower to provide documentation to meet guidelines.
20. PTD | A survey is required. If no survey; title must supply an ALTA 9 endorsement or be free of any survey exceptions. (Not applicable on uninsured products).
21. PTD | Provide borrower executed Anti-Coercion Statement with insurance company selection completed.
22. PTD | Each borrower to provide a valid acceptable form of identification.
23. PTD | Self Employed income used to qualify. Third Party documentation of Self Employment required. This includes verification of a phone listing and address for the borrower’s business, or verification through a third party such as a CPA, regulatory agency or applicable licensing bureau.

**Approved CLEAR (0):**
_None_

---

## newrez — 9758676861_Loan_Approval.pdf

- **Parser:** Newrez
- **Borrower:** Rafael Sidi
- **Loan #:** 9758676861
- **Parsed conditions:** 23 (0 PTF excluded)
- **Outcome:** approved_with_dissent (2/3 votes, 92% confidence)

**Checker votes:**
- Checker A (strict): REJECT (84%)
- Checker B (lenient): APPROVE (92%)
- Checker C (rules): APPROVE (100%)

**Issues:**
- [Checker A (strict)] PTCD address item has incomplete state abbreviation (missing 'PA' after 'Fort Washington,')
- [Checker A (strict)] Multiple proposed conditions are classified as PTD (Prior to Docs) but appear in the PDF under TO CLEAR# PTA and PTCD sections, creating classification confusion
- [Checker A (strict)] Several conditions lack explicit PTD designation in the PDF; they appear under general PTA/PTCD/PTF sections without clear stage assignment
- [Checker A (strict)] Confidence reduced due to classification ambiguity between PTA, PTCD, and PTD sections

**Approved ADD (23):**
1. PTA | Provide unexpired Master HOA Certificate of Property/Hazard Insurance policy to the Project Review Department (PRD) at ProjectReview@newrez.com. If unit is in a flood zone; include Master Flood Insurance dec page.
2. PTA | Limited/Streamline condo review is required by Project Review Department (PRD). Send Project Review request to ProjectReview@newrez.com
3. PTCD | All 3rd party invoices specific to this transaction (i.e. appraisal, credit report, title fees, 3rd party processor, HOA cert, subordination, etc.) necessary to complete Closing Disclosure.
4. PTCD | Acceptable Preliminary Title Report, Closing Protection Letter, and WIRING INSTRUCTIONS specific to the loan transaction. Title to include chain of title, an Alta Extended Loan Policy with the final total loan amount, and an Owners Policy amount with the final purchase price (if applicable).
5. PTCD | Address for the Settlement Agent on Title, CPL and Wiring Instructions must match. CPL address to read: Newrez LLC ISAOA/ATIMA 1100 Virginia Dr., Suite 125, Fort Washington, .
6. PTCD | Confirm Settlement Agent email address and Prelim Order Number have been entered in contact screen.
7. PTCD | Provide copy of HO6 policy if Master Condo/Co-op insurance Policy does not provide interior coverage AKA "Walls in"
8. PTD | Provide tax sheet for subject property. For New Construction provide estimated taxes for both land and improvements.
9. PTD | NewRez to obtain a third party appraisal analysis report (CDA: Collateral Desk Analysis) must be obtained upon receipt of appraisal. Additional conditions may apply.
10. PTD | Provide legal residency documentation for the permanent or non-permanent resident, appropriate for product and residency status.
11. PTD | Borrower to provide a copy of fully executed purchase contract with all addendums and/or counter offers with the sales price shown on your mortgage application.
12. PTD | Condition Update 06/02/2026: Missing Condominium Rider and Sellers Agreement with Respect to Buyers Broker Compensation
13. PTD | Provide most recent 12 months consecutive bank statements being used for income qualification.
14. PTD | Condition Update 06/02/2026: Borrower to provide TD Bank statement dated 5/3/26 for account *7671.
15. PTD | Borrower to provide fully executed letter from business CPA confirming borrowers ownership percentage in MREL INC DBA Beach Cafe and Pizza and the date the borrower became at least a 25% owner. Alternatively, provide business formation document filed with the state along with operating agreement/partnership agreement showing the business ownership percentage.
16. PTD | Borrower to provide a copy of the cancelled earnest money check (EMD) and evidence that the funds have cleared the account with updated account balance.
17. PTD | Borrower to provide most recent 2 months bank statements, all pages, verifying sufficient assets needed for closing and required reserves. Current funds needed for closing: $49,125.00 and required reserves $5,811.00. Borrower is currently short $17,077.00.
18. PTD | Provide written verification of rent for 200 South Birch RD APT 315 Fort Lauderdale, FL 33316. Alternatively, borrower to provide a copy of the current lease and the most recent 12 months checks or bank statements showing satisfactory payments.
19. PTD | Third party sources indicates foreclosure/deed in lieu of foreclosure 12/24/25 on property located at 500 Three Islands BLVD, M23 Hallandale,Beach, FL 33009. Borrower to provide documentation to meet guidelines.
20. PTD | A survey is required. If no survey; title must supply an ALTA 9 endorsement or be free of any survey exceptions. (Not applicable on uninsured products).
21. PTD | Provide borrower executed Anti-Coercion Statement with insurance company selection completed.
22. PTD | Each borrower to provide a valid acceptable form of identification.
23. PTD | Self Employed income used to qualify. Third Party documentation of Self Employment required. This includes verification of a phone listing and address for the borrower’s business, or verification through a third party such as a CPA, regulatory agency or applicable licensing bureau.

**Approved CLEAR (0):**
_None_

---

## newrez — 9769720773_9769720773_Loan_Approval_2026-06-11.pdf

- **Parser:** Newrez
- **Borrower:** Tatyana Zamoshchik
- **Loan #:** 9769720773
- **Parsed conditions:** 1 (0 PTF excluded)
- **Outcome:** auto_approved (3/3 votes, 96% confidence)

**Checker votes:**
- Checker A (strict): APPROVE (95%)
- Checker B (lenient): APPROVE (92%)
- Checker C (rules): APPROVE (100%)

**Approved ADD (1):**
1. PTA | Provide unexpired Master HOA Certificate of Property/Hazard Insurance policy to the Project Review Department (PRD) at ProjectReview@newrez.com. If unit is in a flood zone; include Master Flood Insurance dec page. Project review request received 5-19-26. conditions sent 5/20/26, Conditions recd 5/26/26, conditions requested 5/29/26, conditions recd 5-29-26 need unexpired condo master FLOOD insurance certificate

**Approved CLEAR (0):**
_None_

---

## newrez — Liberty Group Funding Inc. Mail - The approval for loan # 9758676861 has been updated_.pdf

**Status:** NO PARSE

---
