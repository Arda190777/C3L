# Sprint 3 - requirements and SRS contribution

These are local traceability IDs, not verified class SRS numbers. The supplied brief describes six Module 10 functions without numbering them. The shared SRS link is still unavailable. Nasir owns copying/mapping this contribution into the actual collaborative SRS in #13; that external edit is not claimed complete.

| Local ID | Requirement | Candidate state | Executed evidence |
| --- | --- | --- | --- |
| M10-FR-01 | Record/correct daily attendance | Implemented + tested | DB-01 to DB-04; existing HTTP tests |
| M10-FR-02 | Filter attendance history | Implemented + tested | DB-05a/b/c; existing HTTP tests |
| M10-FR-03 | Present/excused/unexcused | Implemented + tested | Validation tests; DB-03/09/10 |
| M10-FR-04 | Record/correct participation | Implemented + tested | DB-11/12/13/15/16; PART tests; S3-HTTP |
| M10-FR-05 | Attendance report + CSV | Implemented + tested | DB-14/15; S3-HTTP JSON/CSV tests |
| M10-FR-06 | Attendance + participation statistics | Implemented + tested | DB-10/14/15; S3-HTTP statistics |

## Acceptance criteria and decisions

- FR-01: a course/student/date saves one daily mark. Re-saving corrects status/notes and retains its ID. Saved files survive reopening.
- FR-02: exact, case-sensitive course/student IDs; inclusive real YYYY-MM-DD limits; reject reversed dates. No matches show an empty state.
- FR-03: only present, excused and unexcused statuses are stored.
- FR-04: course, student, date, activity (trimmed 1-100 characters), integer score 0-5 and optional notes (0-300). Same course/student/date/activity corrects a record; a different activity creates another. The 0-5 scale is this module's classroom prototype policy, not an approved institutional grading policy.
- FR-05: report rows group by course/student and include attendance counts, recorded-mark total, present rate, participation count/points/average. Apply the same filters to HTML, JSON and downloadable CSV. Include participation-only students with zero attendance marks.
- FR-06: aggregate the filtered records into counts/totals; present rate = 100 * present / all recorded marks (including excused/unexcused). Missing records never create absences. Participation average = points / entries. Round nonzero rates/averages to two decimal places; empty inputs do not divide by zero. The UI labels missing activity averages as no entries.

## Nonfunctional requirements

M10-NFR-01: validate server-side and before direct store writes; invalid values do not write. ID length 1-50, real dates, optional notes at most 300 characters. Invalid request/filter returns 422.

M10-NFR-02: bind SQL parameters, escape displayed HTML and neutralize formula-like CSV text. Storage failures return a friendly 503 without local paths. Responses use Cache-Control: no-store. These protections do not replace authentication.

M10-NFR-03: preserve the shared router, no added runtime dependencies, old attendance API compatible, 12 module front pages still pass. SQLite v2 adds the participation table in a transaction without deleting attendance. Refuse database versions newer than 2.

## Traceability and limits

#10 storage/schema; #11 tests; #12 UI; #13 validation/API/SRS/design/release; parent #6 new functionality; #15 concrete input defect fixed on the candidate branch. #5 remains open for identity/roles/enrollment integration. No audit log, pagination, multi-instance hosting or session-level attendance is implemented. Local prototype completion is not production access-control completion.
