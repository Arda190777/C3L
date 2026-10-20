# Sprint 1 test results

Executed October 16, 2026 on Windows with Bun 1.4.3. Tested code commit: `d1810dc`.
All Module 10 application and test code is JavaScript.
The form/history view split preserves behavior. The full 25/81-test runs passed after the split.

## Automated results

| Command | Result | Evidence |
| --- | --- | --- |
| bun test src/modules/10-attendance | 25 passed, 0 failed, 88 assertions | evidence/module-tests.txt |
| bun run check | Passed: lint, TypeScript host check, 81 tests and 12 module front pages | evidence/regression-check.txt |

The existing Biome configuration prints one deprecation information message. It does not fail
lint; no shared configuration was changed. The TypeScript host check does not type-check this
JavaScript module. Its behavior is covered by the tests below.

An initial run inside the restricted execution sandbox failed unrelated proxy networking and
Module 1 temporary-file rename tests. Re-running the same full check with normal network/file
permissions passed all 81 tests. No other team's source was changed to make the checks pass.
One early Module 10 test omitted `await` on the shared async response wrapper; that test was fixed.
There are no failing automated test cases in the final candidate.

## Cases and traceability

| Test ID | Scenario / expected result | Issue | Result |
| --- | --- | --- | --- |
| VAL-01 | Accept the three allowed attendance statuses | #1, #3 | Pass |
| VAL-02 | Reject blank and oversized course/student IDs | #3 | Pass |
| VAL-03 | Reject impossible/formatted dates; accept leap day in leap year | #3 | Pass |
| VAL-04 | Reject unsupported status and notes over 300 characters | #3 | Pass |
| VAL-05 | Reject invalid/reversed history dates and oversized IDs | #2, #3 | Pass |
| DB-01 | New database has empty history | #2 | Pass |
| DB-02 | Save trimmed IDs and notes with update timestamp | #1 | Pass |
| DB-03 | Correction retains ID and one record | #1 | Pass |
| DB-04 | Different students/courses/dates remain separate; newest date first | #1, #2 | Pass |
| DB-05 | Combined exact ID and inclusive date filters | #2 | Pass |
| DB-06 | SQL-looking IDs remain literal values | #3 | Pass |
| DB-07 | Store rejects invalid marks/filters | #3 | Pass |
| DB-08 | Close/reopen a file database without losing records | #1 | Pass |
| HTTP-01 | Shared prefix and response wrapper serve HTML form | #8 | Pass |
| HTTP-02 | Save/read all three statuses as JSON | #1 | Pass |
| HTTP-03 | Refuse malformed, missing or wrong-type JSON data | #3 | Pass |
| HTTP-04 | Invalid date/ID/status gives 422 and no write | #3 | Pass |
| HTTP-05 | Form save gives 303 and filtered success/history page | #1, #2 | Pass |
| HTTP-06 | Invalid form preserves escaped values and field errors | #3 | Pass |
| HTTP-07 | Stored notes and IDs are escaped in history HTML | #3 | Pass |
| HTTP-08 | Both history endpoints reject invalid date ranges | #2, #3 | Pass |
| HTTP-09 | Filtered records and empty-state message | #2 | Pass |
| HTTP-10 | API correction changes status without a duplicate | #1 | Pass |
| HTTP-11 | Storage failure gives friendly 503; internal details absent | #3 | Pass |
| APP-01 | Actual app discovers module, serves its form and preserves 404 | #8 | Pass |

M10-FR-01 and FR-03 map to #1, FR-02 to #2, NFR-01/02 to #3 and NFR-03 to #8.
These are provisional module IDs; the class SRS mapping is still pending.

## Browser checks

These checks were executed in the in-app Chromium browser with fictional IDs. They are tool-run
checks, not evidence of a teammate performing a review. Screenshots are in `docs/evidence/`.

| ID | Steps and observed result | Screenshot |
| --- | --- | --- |
| B-01 | Save PROG3000/S1001/2026-10-16 as Present; redirected history shows the row | history-browser.jpg |
| B-02 | Save the same key as excused; one row remains with corrected notes/status | correction-browser.jpg |
| B-03 | Filter student ID missing; empty-state message shown | empty-browser.jpg |
| B-04 | Submit from 2026-10-17 to 2026-10-16; linked error and no records shown | date-error-browser.jpg |
| B-05 | Form at 375px: one-column controls and no page horizontal overflow (375px content width) | form-mobile-browser.jpg |

## Defect and integration log

| Issue | Status | Impact / next action |
| --- | --- | --- |
| #1-#3 | Implemented; open pending team PR merge | Local prototype features pass tests |
| #4 | In progress | Arda checks final forms and release metadata |
| #8 | In progress | Nasir verifies regression evidence and updates the shared SRS; account/link needed |
| #9 | In progress | Jaspreet checks use instructions, performs review and rehearses demo |
| #5 | Open | No login/role/course-enrollment enforcement; use sample data locally |
| #6 | Backlog | Participation, reports and statistics not implemented |

No real student data, teammate review, meeting or demo is claimed by these test results.
