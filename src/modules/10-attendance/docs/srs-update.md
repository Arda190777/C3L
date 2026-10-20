# Module 10 - SRS update proposal

Prepared October 16, 2026. Sprint 1 candidate.

The supplied project brief lists six Module 10 functions but does not give requirement numbers.
The IDs below are proposed **local traceability IDs**, not verified class SRS numbers. The shared
SRS link has not been supplied. Copy these rows into the collaborative SRS, map existing IDs and
record the real Sprint Iteration there before submission. This file does not claim that happened.

## Problem and scope

Teaching staff need a consistent way to record a daily mark and review previous attendance.
Sprint 1 replaces the starter page with a local prototype for recording and correcting marks,
reading history and distinguishing excused/unexcused absences. It uses sample student/course IDs.

| Proposed ID | Requirement and acceptance criteria | Sprint | GitHub issue | Candidate status |
| --- | --- | --- | --- | --- |
| M10-FR-01 | Record a mark using course ID, student ID, date and status. Re-saving that combination corrects it. Data survives restart. | 1 | #1 | Implemented; review pending |
| M10-FR-02 | View history, newest date first. Filter by exact IDs and inclusive date range. Show an empty state when no match exists. | 1 | #2 | Implemented; review pending |
| M10-FR-03 | Store and display Present, Absent - excused and Absent - unexcused. Reject any other value. | 1 | #1, #3 | Implemented; review pending |
| M10-FR-04 | Track participation. Scoring rules to be agreed by the team. | Later | #6 | Not implemented |
| M10-FR-05 | Produce attendance reports. Contents/export format to be agreed. | Later | #6 | Not implemented |
| M10-FR-06 | Show attendance statistics. Formula/denominator to be agreed. | Later | #6 | Not implemented |
| M10-NFR-01 | Validate on the server: trimmed IDs 1-50 characters, real YYYY-MM-DD date, allowed status and optional notes up to 300 characters. Invalid input returns 422 and no write. | 1 | #3 | Implemented; tested |
| M10-NFR-02 | Escape user data in HTML and bind SQL parameters. Return a friendly 503 for storage failure. | 1 | #3 | Implemented; tested |
| M10-NFR-03 | Keep the shared router and all 12 module front pages working. Add no runtime dependency. | 1 | #8 | Regression tests passed |

## User stories

- As an instructor, I want to record a daily mark so attendance can be reviewed later (FR-01).
- As an instructor, I want to correct a mark without duplicate records (FR-01).
- As an instructor, I want to find marks by course, student and dates (FR-02).
- As an instructor, I want excused and unexcused absences to be distinguishable (FR-03).

These are intended roles. The prototype does not authenticate instructors; #5 tracks the missing
identity/role/enrollment integration. It must be resolved before real student data is used.

## Planned team responsibility

- Arda Efe Cetintav: formPage.js UI, final submission-form and release metadata checks (#4).
- Jaspreet Gakhal: historyPage.js UI, quick-start verification, demo and actual peer review (#9).
- Gera Paoli: attendance/validation implementation review and corrections (#1, #3).
- Nasir Ishaq Sani: history/filter review, regression verification and shared SRS update (#2, #8).

Gera and Nasir's GitHub accounts and the collaborative SRS link are still needed. This allocation
does not claim completed individual contributions or change the implemented Sprint 1 scope.

## Business rules and dependencies

- One attendance mark per student, course and calendar date. Multiple sessions are not represented.
- IDs are entered manually, trimmed and matched case-sensitively. No roster is invented.
- A correction replaces status and notes; there is no immutable audit trail in Sprint 1.
- No automatic absence is inferred when a student has no record.
- No attendance-rate denominator or participation scoring policy is assumed.
- Module 1 login/roles and Module 2 course membership require agreed integration contracts (#5).
- The full class scope is unchanged. Later features remain in the backlog (#6).
