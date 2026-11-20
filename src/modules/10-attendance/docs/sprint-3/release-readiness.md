# Release notes - Module 10 Sprint 3

Service: C3L Attendance & Participation Tracking (Module 10). Candidate version: 0.3.0.
Repository: https://github.com/Arda190777/C3L. Branch: `feature/attendance-sprint-3-plan`. Candidate tag: `module10-sprint3-v0.3.0-rc.1`.
Final behavior-tested source: `86d64cc`. PR: https://github.com/Arda190777/C3L/pull/14. The candidate is not merged to main and is not a production release.

## New functionality

- Participation entry/history, integer scores 0-5 and same-activity corrections (M10-FR-04, #6/#10/#12/#13).
- Per-student/course report in HTML, JSON and downloadable quoted CSV with shared exact-ID/inclusive-date filters (M10-FR-05).
- Statistics screen/API with recorded attendance counts, present rate, participation count/points/average (M10-FR-06).
- Additive SQLite schema version 2 preserves old attendance and creates participation. Reject newer database versions instead of downgrading.
- OpenAPI specification, updated design/SRS contribution, installation/use instructions and executed regression evidence.

## Fixes and regression

#15: countByStatus previously accepted blank course IDs and returned zeros. It now validates/normalizes IDs; DB-10 passes. Date inputs now retain a visible outline while keyboard focus moves within their subfields. Existing attendance routes and daily correction behavior remain compatible.

Final result: 47 module tests, 103 repository tests, lint, TypeScript host check and all 12 front pages passed. See [test evidence](testing.md). No percentage test coverage is claimed.

## Installation and use

Requires Git and Bun. Clone the Sprint 3 branch (see [team plan](team-plan.md)), run `bun install --frozen-lockfile`, then `bun run dev`. Open http://localhost:3000/10-attendance. An available alternative port can be set through PORT; browser verification used 3100. SQLite creates data/attendance.sqlite lazily; do not commit that directory. Use only fictional IDs. See [API/user guide](current-api.md) for the five-screen demo and CSV use.

Before first opening an existing database with this version, stop the app and back up the file and any SQLite sidecars. Version 2 is additive and transactional; there is no destructive automatic rollback. Keep the schema file with the JavaScript sources when running/deploying this module.

## Known issues and remaining work

- #5: no sign-in, role or course-enrollment enforcement in Module 10. Cross-module integration remains open. The local prototype must not store real student data.
- #10/#11/#12: implementation/test evidence ready for real teammate review; human reviews/rehearsal not fabricated as complete.
- #13: Nasir's invitation is pending; the collaborative SRS link/official requirement IDs are missing. Local contribution is ready, but shared document edit is not complete.
- Actual GitHub Project board, Issues and milestone 2 are updated. The board retains default private visibility; use the owner's signed-in account to present it. Public repository Issues and committed evidence are available independently.
- One attendance mark per student/course/day; participation corrections replace score/notes for the same activity. No immutable audit log, deletion UI, attendance sessions, pagination or multi-instance database support.
- Present rate uses recorded marks, not enrolled students or scheduled sessions. The 0-5 participation scale is a local prototype choice, not an institutional grading policy.

After Sprint 3: real peer review, cross-module access integration, targeted bug fixes, regression, documentation and final demonstration rehearsal. No missing local participation/report/statistics feature is deferred to Week 14.
