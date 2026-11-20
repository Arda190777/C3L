# Arda - personal Sprint 3 transcript

Your section: slides 6-7 only, about 2 minutes 15 seconds. Jaspreet introduces the team. Gera explains store.js. You explain testing. The wording below matches the verified baseline, not future completed features.

## Slide 6 - Verified testing baseline (about 60 seconds)

My responsibility is testing and regression evidence.

The latest baseline is commit 04dd3ac. In the recorded run on November 20, all 28 Module 10 tests passed. The full project check also passed all 84 tests and opened all 12 module front pages successfully.

Our tests check input validation, saving and correcting attendance, history filters, persistence and API responses.

Most storage tests use a database in memory. This keeps them separate from our demo data. One test uses a temporary SQLite file, closes it and opens it again. That checks that saved records remain available.

These results cover the current code. After Gera, Jaspreet and Nasir finish the remaining features, I will run the tests again on the integrated version.

## Slide 7 - Simple correction test (about 75 seconds, including the example)

I will explain DB-09 in store.test.js.

The test saves two Present marks and one Excused mark for the selected course. It also saves a mark for a different course.

The first expected result is two Present, one Excused and zero Unexcused.

Then the test changes one existing Present mark to Unexcused. The expected result becomes one Present, one Excused and one Unexcused. The total stays at three.

This checks that a correction updates the counts and that another course does not affect the selected course.

My next checks are empty courses, unknown courses, spaces around course IDs and the new participation and report functionality. If a check fails, I will record the steps, expected result and actual result, then retest after the fix.

Nasir will now explain the API and project documentation.

## What to open

1. Open src/modules/10-attendance/store.test.js.
2. Scroll to DB-09 at the bottom. Point to the first expected count object, then the correction and second expected object.
3. Use the saved November 20 test output if time is short. If running live, use: bun test src/modules/10-attendance/store.test.js.
4. Do not claim that an unimplemented participation/report test has passed. Rerun and update the slides/transcript if new commits land before presenting.

## Short answers for teacher questions

Why use memory in tests? Each test starts with its own empty database and does not change the demo data.

Why test a file too? An in-memory test cannot prove that records survive closing and reopening a database file.

What is a regression test? It checks that an existing feature still works after a change.

What does expect(...).toEqual(...) do? It compares the actual result with the complete expected object.

Why save another course? To check that the selected course's counts do not include another course.

Do passing tests mean Sprint 3 is finished? No. They cover implemented code. Missing features still need implementation and their own tests.

Where are your tasks? GitHub issue #11: https://github.com/Arda190777/C3L/issues/11.
