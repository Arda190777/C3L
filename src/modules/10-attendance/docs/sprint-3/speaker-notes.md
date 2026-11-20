## Slide 1: Attendance & Participation

Speaker: Jaspreet. Time: 0:00-0:45.

Hello everyone. We are presenting Module 10, Attendance and Participation Tracking. Our team is Jaspreet Gakhal, Gera Paoli, Arda Efe Cetintav and Nasir Ishaq Sani. I will introduce the module and demonstrate the working interface. Gera owns storage improvements and the database design. Arda owns testing and regression evidence. Nasir owns API integration and technical documentation. This presentation uses the latest team push, 04dd3ac. We distinguish verified functionality from work still required in Sprint 3.
Sources: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb; https://github.com/Arda190777/C3L/milestone/2; supplied Sprint-3 announcement. Current-code claims refer to 04dd3ac. Planned items are not completed features.

## Slide 2: Current scope and remaining work

Speaker: Jaspreet. Time: 0:45-1:45.

The existing module records and corrects daily attendance, distinguishes absence types and filters history. The latest push adds countByStatus for one course in the storage class, with a correction test. That method does not yet have a statistics screen or endpoint. Participation and attendance reports still need implementation. These are gaps against the final-sprint expectation, so the new backlog gives each gap an owner. We must finish the agreed major features during Sprint 3 and reserve later weeks for testing, bug fixes and documentation.
Sources: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb; https://github.com/Arda190777/C3L/milestone/2; supplied Sprint-3 announcement. Current-code claims refer to 04dd3ac. Planned items are not completed features.

## Slide 3: Working attendance demo

Speaker: Jaspreet. Time: 1:45-3:00.

ACTION: Open http://localhost:3000/10-attendance. Save course DEMO101, student DEMO001, date 2026-11-20 as Present. Return to the form and save the same identifiers/date as Absent - excused. Explain that this corrects one record. Filter by DEMO001, then by MISSING to show an empty result. SAY: The current interface handles daily attendance and history. Course counts currently exist in storage and have a test. We will show a summary screen only after Nasir and I connect it to Gera's implementation. Gera will now explain the database work.
Sources: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb; https://github.com/Arda190777/C3L/milestone/2; supplied Sprint-3 announcement. Current-code claims refer to 04dd3ac. Planned items are not completed features.

## Slide 4: Gera: storage improvements

Speaker: Gera. Time: 3:00-4:15.

My assigned area is store.js and the database design. The current class opens a local SQLite file on first use. It saves or corrects one mark per course, student and date, lists matching marks and now counts statuses for a course. My Sprint 3 tasks are to finish the summary contract and add the agreed participation and report data. Before adding participation fields, we must agree scoring rules with the team and record them in the SRS. Any schema change must preserve existing records. I will coordinate return values and error behavior with Nasir and give Arda clear examples to test.
Sources: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb; https://github.com/Arda190777/C3L/milestone/2; supplied Sprint-3 announcement. Current-code claims refer to 04dd3ac. Planned items are not completed features.

## Slide 5: Database design and contracts

Speaker: Gera. Time: 4:15-5:15.

The existing attendance table stores identifiers, date, status, notes and update time. A unique constraint prevents duplicate daily marks. The save query updates the existing row when the key repeats. Counts summarize recorded marks, not a verified class roster or the number of enrolled students. Missing marks do not automatically mean absence. The participation model and any attendance-rate denominator still require agreement. The design is therefore a baseline, not a claim that the final database is already complete. The team will update its diagram and migration notes when the model is settled.
Sources: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb; https://github.com/Arda190777/C3L/milestone/2; supplied Sprint-3 announcement. Current-code claims refer to 04dd3ac. Planned items are not completed features.

## Slide 6: Arda: verified testing baseline

Speaker: Arda. Time: 5:15-6:15.

My responsibility is testing and regression evidence. The latest baseline is commit 04dd3ac. The recorded run on November 20 passed 28 Module 10 tests and 84 tests across the repository. All 12 module front pages passed too. The tests cover validation, storage and requests through the shared module prefix. Most storage tests use an in-memory database, so they do not change demo records. One uses a temporary SQLite file and reopens it to check persistence. These results describe the current code. I will rerun the suite after the remaining Sprint 3 features are integrated.
Sources: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb; https://github.com/Arda190777/C3L/milestone/2; supplied Sprint-3 announcement. Current-code claims refer to 04dd3ac. Planned items are not completed features.

## Slide 7: Arda: a simple correction test

Speaker: Arda. Time: 6:15-7:30.

A simple example is DB-09 in store.test.js. First it saves two Present marks and one Excused mark for the selected course. It also saves a mark for a different course. The expected counts are two Present, one Excused and zero Unexcused. Then it changes one existing Present mark to Unexcused. The expected counts become one, one and one. The total remains three. This checks that a correction changes the totals and that another course stays outside the result. Next, my task is to test empty and unknown courses, whitespace in IDs and the new participation/report contracts. Any defect will get reproducible steps and a regression check. Nasir will explain API integration and the project evidence.
Sources: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb; https://github.com/Arda190777/C3L/milestone/2; supplied Sprint-3 announcement. Current-code claims refer to 04dd3ac. Planned items are not completed features.

## Slide 8: Nasir: API integration

Speaker: Nasir. Time: 7:30-8:30.

My implementation area is router.js, attendance.js and index.js. The shared C3L app mounts our module under /10-attendance. Existing routes serve the form, save marks and read history as HTML or JSON. I will connect the remaining summary, participation and report operations to agreed routes. We must document actual paths, request fields, responses and error statuses after implementation. I also coordinate the authentication, role and enrollment dependency with Modules 1 and 2. Until those checks exist, this remains a local sample-ID prototype.
Sources: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb; https://github.com/Arda190777/C3L/milestone/2; supplied Sprint-3 announcement. Current-code claims refer to 04dd3ac. Planned items are not completed features.

## Slide 9: GitHub and documentation

Speaker: Nasir. Time: 8:30-9:30.

We created a Sprint 3 milestone and four task issues with owners and acceptance checklists. Gera has issue 10, Arda issue 11, Jaspreet issue 12 and I own issue 13 in the written plan. My repository invitation is pending, so the formal GitHub assignee must be set after I accept it. The planning branch includes a backlog, requirement mapping and test evidence. The current token cannot access GitHub Projects, so the repository backlog is the available tracking view. It is not an updated GitHub Project board. The collaborative SRS link is still missing, and the local requirement mapping must be copied there. We will show real reviews and merged status only when they happen.
Sources: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb; https://github.com/Arda190777/C3L/milestone/2; supplied Sprint-3 announcement. Current-code claims refer to 04dd3ac. Planned items are not completed features.

## Slide 10: Release readiness and Week 14

Speaker: Nasir. Time: 9:30-10:45.

The release notes must match the implementation. At this baseline, daily attendance and history work, and course counts exist in storage. Participation, reports, summary UI/API and access checks remain gaps. There is no Sprint 3 release tag yet. Before the presentation we need the agreed features, updated database and API documentation, fresh regression results and a real review. We will use the release-readiness checklist to keep known issues visible. After Sprint 3, our focus should shift to defects, documentation and rehearsing a polished Week-14 demonstration. Thank you. We are ready for questions.
Sources: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb; https://github.com/Arda190777/C3L/milestone/2; supplied Sprint-3 announcement. Current-code claims refer to 04dd3ac. Planned items are not completed features.
