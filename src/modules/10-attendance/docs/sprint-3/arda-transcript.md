# Arda - Sprint 3 personal transcript

## Slide 6 - test results (about 1 minute)

My area is storage testing and regression evidence. In Sprint 2, my section covered store.js and store.test.js. For Sprint 3, Gera explains the storage improvements, and I explain how we check them.

The module now has participation records, reports and statistics. The tests check saving, correcting, filtering and calculating totals. They also check invalid input and whether old attendance data survives the database upgrade.

On the final tested code, all 47 Module 10 tests passed. The full project check passed 103 tests, lint, the TypeScript host check and all 12 module front pages. This is regression evidence: it checks that the new work did not break the existing features. It does not prove that every possible bug is gone.

## Slide 7 - two simple test examples (about 1 minute 15 seconds)

First, DB-12 checks a participation correction. It saves one activity, then saves the same course, student, date and activity again with a different score. We expect one record, the same ID and the new score. A different activity should create a second record.

Second, DB-16 checks an old database file. The test creates an attendance table in a temporary folder and inserts a sample record. It then opens that file using the new store. The old attendance record must still be there. The test saves participation, closes the store and opens it again. The participation record must also remain, and the schema version must be two.

Most tests use an in-memory database because each test needs a fresh, separate database. The persistence test uses a temporary file because memory alone cannot prove that data survives reopening. Tests do not use the application's real database.

That is my testing section. Nasir will explain the APIs and release documentation next.

## What to open

1. Keep slides 6 and 7 ready. Jaspreet introduces the team; you do not need an introduction.
2. Open src/modules/10-attendance/store.test.js. Search for DB-12, then DB-16.
3. For DB-12, point to the two saves, the row-count check, the same-ID check and the changed score.
4. For DB-16, point to the old-file fixture, the old-record check, close/reopen and PRAGMA user_version.
5. Run: bun test src/modules/10-attendance/store.test.js
6. Show saved evidence/module-tests.txt and evidence/full-check.txt for the full results. Do not quote the full-module count as the store-only count.

## Short answers for teacher questions

What does expect do? It compares the actual result with the result the test requires. A mismatch makes the test fail.

Why both memory and files? Memory keeps most tests separate and fast. A temporary file is needed to test persistence and upgrading an old database.

What is a regression test? It checks that existing behavior still works after a change. The old attendance tests run alongside the new participation tests.

What does DB-14 check? It checks report totals, participation averages, filtering and the present-rate formula. A participation-only student has zero attendance marks, not an invented absence.

What bug was found? Issue #15 records blank course IDs being accepted by countByStatus. The fix rejects them, and DB-10 checks that behavior.

Are you using the real application database? No. The tests use isolated memory databases or temporary test files that are cleaned up afterward.

Is everything finished? The local attendance, participation, reports and statistics work. Login, role and enrollment enforcement remain tracked in #5. Shared SRS mapping and real teammate review are also pending.
