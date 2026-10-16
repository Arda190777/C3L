# Module 10 - Sprint 1 release candidate

Service: Attendance & Participation Tracking.

Repository: https://github.com/Arda190777/C3L

Upstream: https://github.com/JGreyScales/C3L

Branch: `feature/attendance-sprint-1`

Candidate tag: `module10-sprint1-v0.1.0-rc.2`

Date: October 16, 2026. This is a tested local prototype candidate awaiting team review, not a
claim that the fork's main branch or class repository has been updated.

## Issues implemented in this candidate

- #1: daily attendance recording, same-key corrections, persistence and absence types.
- #2: newest-first attendance history with exact IDs and inclusive date filters.
- #3: validation, escaped HTML, parameterized SQL and useful storage error responses.

These issues remain open until the internal team PR is reviewed and merged. There was no earlier
attendance implementation; these are new features/enhancements, not invented prior defects.

## Known issues and unfinished work

- #4: final submission-form and release metadata checks (Arda).
- #8: collaborative SRS ID mapping/update and final regression verification (Nasir).
- #9: real teammate review, use-instruction check and demo (Jaspreet).
- Gera owns the technical review/corrections for #1/#3; Nasir also reviews #2. Their GitHub
  assignments remain pending account information. These are planned responsibilities.
- #5: authentication, instructor permissions and course/enrollment validation are not integrated.
  Use fictional IDs only in a local environment. History currently returns all matching local data.
- #6: participation tracking, attendance reports and attendance statistics are later-sprint work.
- One mark per course/student/day; multiple sessions and an immutable correction log are not supported.
- Database is local SQLite; multi-server storage, pagination and backups are outside this sprint.

## New functionality and operating instructions

Proposed local IDs M10-FR-01, M10-FR-02 and M10-FR-03 correspond to the first three Module 10
functions in the supplied brief. The brief does not supply official requirement numbers.

1. From the repo root run `bun install --frozen-lockfile`, then `bun run dev`.
2. Open `http://localhost:3000/10-attendance`.
3. Enter sample course/student IDs, a date and one of Present / Absent - excused / Absent - unexcused.
4. Save to open filtered history. Save the same course/student/date again to correct its status/notes.
5. Use the history form to filter exact IDs or an inclusive date range. Clear filters to view all local marks.
6. Restarting keeps the marks in `src/modules/10-attendance/data/attendance.sqlite` (git-ignored).

The module is JavaScript and uses Bun's native SQLite API. No dependency or common router changes.

## Regression testing

Module: 25 passed, 0 failed. Full repository: 81 passed, 0 failed. `bun run check` also passed lint,
the existing TypeScript host check and all 12 module sanity checks. Browser save/correction,
empty-state, date validation and 375px layout checks passed. See `testing.md` and `evidence/`.

## Before final submission

Complete a real teammate review and merge the internal PR.
Copy/match proposed requirements into the class SRS and record Sprint Iteration 1. Rehearse the
demo, record actual review/retrospective evidence and update this candidate if anything changes.
