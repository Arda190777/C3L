# Sprint 3 - team responsibilities and backlog

Prepared November 20, 2026. Actual implemented candidate: `86d64cc` on `feature/attendance-sprint-3-plan`.
Baseline pulled from GitHub: `04dd3ac` on `feature/attendance-sprint-2-stats`. Sprint 3 now includes working code, not just a plan.

| Owner / task | Code and review responsibility | Presentation |
| --- | --- | --- |
| Jaspreet Gakhal (@jaspreetgakhal1) [#12](https://github.com/Arda190777/C3L/issues/12) | Interface and demonstration: formPage.js, historyPage.js, participationPage.js, reportPages.js, pageLayout.js, pages.js. Candidate complete: participation form/history, statistics, report/CSV controls, navigation and empty/error states. Review the screens and rehearse the live demo. | Slides 1-3 (3:30): introduce all four members, explain the module and demonstrate working features. |
| Gera Paoli (@Diffie-Hellman25519) [#10](https://github.com/Arda190777/C3L/issues/10) | Storage and database improvements: store.js, schema.sql; database design notes. Candidate complete: participation persistence, corrections, report/statistics calculations and additive SQLite v2 upgrade. Review storage and migration rules. | Slides 4-5 (2:00): explain save/read methods, two tables, uniqueness rules and preserving old attendance. |
| Arda Efe Cetintav (@Arda190777) [#11](https://github.com/Arda190777/C3L/issues/11) | Storage tests and regression evidence: store.test.js (main explanation); attendance.test.js and router.test.js for overall results. Executed: 47 module tests, 103 repository tests and all 12 module front pages pass. Explain DB-12 corrections, DB-14 report totals and DB-16 upgrade/persistence. Review evidence. | Slides 6-7 (2:15): testing only. Open store.test.js and explain DB-12 and DB-16. No team introduction. |
| Nasir Ishaq Sani (@nasirishaq819) [#13](https://github.com/Arda190777/C3L/issues/13) | API, validation and technical documentation: router.js, attendance.js, reportExport.js, openapi.json, index.js; SRS/design/release notes. Candidate complete: JSON/HTML routes, validation, CSV and API/design/release docs. Remaining: map/copy the SRS contribution into the actual shared SRS. Accept repository invitation so #13 can be formally assigned. | Slides 8-10 (3:00): APIs, GitHub evidence, release/known limits and the quality work before Week 14. |

The assignment is ownership for review, understanding and presentation. It is not a claim that each named person authored all assigned code. Git commits retain their actual authors; real teammate reviews must be recorded by the teammates themselves.

## Current repository backlog

| Task | State | Remaining acceptance step |
| --- | --- | --- |
| #10 Gera: storage/schema | Ready for teammate review | Review v2 upgrade, score policy and calculations |
| #11 Arda: tests | Tests executed; ready for review | Review test evidence and rehearse DB-12/16 |
| #12 Jaspreet: UI/demo | Working screens verified; ready for review | Real peer review and presentation rehearsal |
| #13 Nasir: API/docs | Implementation ready; external items pending | Accept invitation, formally assign issue; map/copy actual shared SRS |
| #15 blank course-ID bug | Fixed on candidate branch | DB-10 regression passes |
| #5 identity/roles/enrollment | Open platform integration dependency | Agree contracts with Modules 1/2 and implement enforcement |

GitHub Issues, milestone 2 and the actual [Sprint 3 Project board](https://github.com/users/Arda190777/projects/1) are updated. The board is linked to the team repository. Ready for review: #10/#11/#12; In Progress: #13; Done on candidate: #6/#15; Todo: #5. The Project retains its default private visibility, so show it using the owner's signed-in account. Board screenshots are saved under evidence/. Private Project access is separate from public repository Issues.

## Evidence and rehearsal

Final code `86d64cc`: **47 Module 10 tests / 230 assertions; 103 repository tests / 401 assertions; lint, TypeScript host check and all 12 module front pages pass**. The TypeScript host check does not type-check the JavaScript module.
Real browser verification covered participation save/correction, a second activity, report/CSV download, statistics, empty/error views and a 320px statistics layout. See [testing](testing.md).

Jaspreet: slides 1-3 (0:00-3:30). Gera: 4-5 (3:30-5:30). Arda: 6-7 (5:30-7:45), testing only. Nasir: 8-10 (7:45-10:45). Allow about two minutes for questions. After Sprint 3, focus on fixes, regression, documentation and rehearsal; resolve #5 before using real student data.

## Get the same code

```sh
git clone --branch feature/attendance-sprint-3-plan --single-branch https://github.com/Arda190777/C3L.git
cd C3L
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3000/10-attendance. Use fictional IDs only. Existing checkouts: commit/stash personal changes, then `git fetch origin`, `git switch feature/attendance-sprint-3-plan`, `git pull --ff-only`.

- [Team repository](https://github.com/Arda190777/C3L)
- [Sprint 3 branch](https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan)
- [Implementation PR #14](https://github.com/Arda190777/C3L/pull/14) - human review pending; not merged to main
- [Sprint 3 milestone](https://github.com/Arda190777/C3L/milestone/2)
- Candidate tag: `module10-sprint3-v0.3.0-rc.1`
- [Team PDF](Sprint3-Team-Plan.pdf), [Arda transcript](Arda-Sprint3-Transcript.pdf), [speaker notes](speaker-notes.md)
