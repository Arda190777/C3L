# Sprint 3 - presentation speaker notes

## Slide 1: Module 10 - Sprint 3

Jaspreet | 0:00-0:45

Hello everyone. We are presenting Module 10, Attendance and Participation Tracking. Our team is Jaspreet Gakhal, Gera Paoli, Arda Efe Cetintav and Nasir Ishaq Sani. I will introduce the module and demonstrate the interface. Gera explains the database, Arda explains testing, and Nasir explains the API and release evidence. These are our review and presentation responsibilities; Git history shows actual authorship. The current candidate includes implemented Sprint 3 features, not only a plan.

Sources: Implementation: https://github.com/Arda190777/C3L/commit/86d64cc; evidence: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan/src/modules/10-attendance/docs/sprint-3/evidence. Local prototype; #5 access integration remains open.

## Slide 2: Six local requirements working

Jaspreet | 0:45-1:30

Our module records attendance, keeps a filterable history and distinguishes absence types. Sprint 3 adds activity participation, attendance reports and statistics. All six local functions are implemented and tested in the candidate. The FR IDs are local mapping IDs because the official shared SRS IDs have not been supplied. Login, role and enrollment checks are still tracked in issue 5; we use fictional records for this demonstration.

Sources: Implementation: https://github.com/Arda190777/C3L/commit/86d64cc; evidence: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan/src/modules/10-attendance/docs/sprint-3/evidence. Local prototype; #5 access integration remains open.

## Slide 3: Live demonstration

Jaspreet | 1:30-3:30

Open the running application. Record Present for S3DEMO101, S3DEMO001 and 2026-11-20, then show history. Save Class discussion with score 4 on Participation. Submit the same key with score 2 and show that it corrects one row. Add Group exercise with score 5. Filter Statistics to this course: there should be one present mark, two activities, seven points and an average of 3.5. Open Reports with the same filter and download CSV. If the database already contains other examples, use a fresh fictional course ID. Finish: Gera will now explain how these records are stored.

Sources: Implementation: https://github.com/Arda190777/C3L/commit/86d64cc; evidence: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan/src/modules/10-attendance/docs/sprint-3/evidence. Local prototype; #5 access integration remains open.

## Slide 4: Gera - storage improvements

Gera | 3:30-4:30

Open store.js. AttendanceStore opens a database only when a method first needs it. The existing save and list methods still handle attendance. saveParticipation uses the course, student, date and activity as its correction key. getReport combines the filtered attendance and participation records into one row per student and course. getStatistics totals those rows. Present rate is present divided by recorded marks, including excused and unexcused. It does not estimate attendance from enrollment or invent absences.

Sources: Implementation: https://github.com/Arda190777/C3L/commit/86d64cc; evidence: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan/src/modules/10-attendance/docs/sprint-3/evidence. Local prototype; #5 access integration remains open.

## Slide 5: Gera - database version 2

Gera | 4:30-5:30

Show schema.sql and the database diagram in docs/sprint-3/design.md. There are two independent tables. Attendance is unique per course, student and day. Participation adds activity to that key, so two activities on the same day are allowed. Scores are integers from zero to five; this is our classroom prototype policy. The schema is created in a transaction, without deleting old attendance. DB-16 proves the old-file upgrade and persistence; DB-17 refuses a newer version. Back up existing files before the first upgrade. Arda will explain the tests next.

Sources: Implementation: https://github.com/Arda190777/C3L/commit/86d64cc; evidence: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan/src/modules/10-attendance/docs/sprint-3/evidence. Local prototype; #5 access integration remains open.

## Slide 6: Arda - executed test results

Arda | 5:30-6:30

My area is storage testing and regression evidence. In Sprint 2, my section covered store.js and store.test.js. For Sprint 3, Gera explains the storage improvements, and I explain how we check them.

The module now has participation records, reports and statistics. The tests check saving, correcting, filtering and calculating totals. They also check invalid input and whether old attendance data survives the database upgrade.

On the final tested code, all 47 Module 10 tests passed. The full project check passed 103 tests, lint, the TypeScript host check and all 12 module front pages. This is regression evidence: it checks that the new work did not break the existing features. It does not prove that every possible bug is gone.

Sources: Implementation: https://github.com/Arda190777/C3L/commit/86d64cc; evidence: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan/src/modules/10-attendance/docs/sprint-3/evidence. Local prototype; #5 access integration remains open.

## Slide 7: Arda - simple storage test examples

Arda | 6:30-7:45

First, DB-12 checks a participation correction. It saves one activity, then saves the same course, student, date and activity again with a different score. We expect one record, the same ID and the new score. A different activity should create a second record.

Second, DB-16 checks an old database file. The test creates an attendance table in a temporary folder and inserts a sample record. It then opens that file using the new store. The old attendance record must still be there. The test saves participation, closes the store and opens it again. The participation record must also remain, and the schema version must be two.

Most tests use an in-memory database because each test needs a fresh, separate database. The persistence test uses a temporary file because memory alone cannot prove that data survives reopening. Tests do not use the application's real database.

That is my testing section. Nasir will explain the APIs and release documentation next. Open DB-12 and DB-16 in store.test.js. Run bun test src/modules/10-attendance/store.test.js if time allows. Full-module totals are not the store-only count.

Sources: Implementation: https://github.com/Arda190777/C3L/commit/86d64cc; evidence: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan/src/modules/10-attendance/docs/sprint-3/evidence. Local prototype; #5 access integration remains open.

## Slide 8: Nasir - API and validation

Nasir | 7:45-8:45

The shared router mounts our module at /10-attendance. The new participation API saves and lists activities. Statistics returns aggregate totals, and the report endpoint returns one row per course and student. The CSV route downloads the same filtered data. The OpenAPI file documents request and response schemas. Server validation rejects invalid scores, IDs and dates with 422; storage failures return a friendly 503. HTML values are escaped, SQL uses bound parameters and CSV text is protected against spreadsheet formulas. None of these replaces the still-missing role and enrollment enforcement in issue 5.

Sources: Implementation: https://github.com/Arda190777/C3L/commit/86d64cc; evidence: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan/src/modules/10-attendance/docs/sprint-3/evidence. Local prototype; #5 access integration remains open.

## Slide 9: Nasir - GitHub and documentation

Nasir | 8:45-9:45

Show the fork, Sprint 3 milestone, issues 10 through 13, commits and PR 14. Storage, API, UI and tests are separate meaningful commits, not fabricated per-person authorship. Issue 15 records a real defect: blank course IDs used to return zero counts and now cause validation errors. The local SRS contribution, architecture/database diagram, API contract and release notes are updated. Copying the contribution into the actual shared SRS still needs its link and official IDs. Open https://github.com/users/Arda190777/projects/1 using the owner account. The actual linked Project board has 10/11/12 Ready for review, 13 In Progress, 6/15 Done and 5 Todo. It retains default private visibility. Human peer review must be recorded by real teammates, not presented as already done.

Sources: Implementation: https://github.com/Arda190777/C3L/commit/86d64cc; evidence: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan/src/modules/10-attendance/docs/sprint-3/evidence. Local prototype; #5 access integration remains open.

## Slide 10: Nasir - release and remaining limits

Nasir | 9:45-10:45

Our candidate includes working local attendance, participation, reports and statistics. Installation is clone the Sprint 3 branch, bun install --frozen-lockfile, then bun run dev. Existing files receive the additive v2 upgrade; back up first. The candidate tag identifies this release for review, but main is not merged. We are transparent about open items: issue 5 integration, actual shared SRS mapping and real peer review. The updated board is private and can be shown from the owner account. SQLite is local; there is no audit history, pagination or session-level attendance. Before Week 14, focus on the remaining integration, targeted fixes, regression evidence, documentation and rehearsal. Thank you; we are ready for questions.

Sources: Implementation: https://github.com/Arda190777/C3L/commit/86d64cc; evidence: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan/src/modules/10-attendance/docs/sprint-3/evidence. Local prototype; #5 access integration remains open.
