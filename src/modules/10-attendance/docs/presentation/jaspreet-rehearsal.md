# Jaspreet - Sprint 1 rehearsal sheet

## Your code area

historyPage.js

## Before class

1. Locate the fields array, filter form, records.map, table and empty-state text.
2. Explain that the backend supplies records and this view displays them.
3. Check the table headings and Clear filters link. Edit helper/empty-state wording only if needed.
4. Follow the exact demo runbook below twice and check the release instructions match it.
5. Review PR #7 and record real feedback. Issue #9 is your assigned GitHub task.
6. Present scope and perform the live demo. Hand over to Gera for database details.

## English speaking notes

## Slide 3: Sprint 1 scope and progress

Speaker: Jaspreet | Time: 2:15-3:15

The complete module includes attendance, participation, reports and statistics. For Sprint 1 we selected the first three attendance functions. We can record a daily mark, correct it, view history and distinguish excused from unexcused absences. My assigned interface area is historyPage.js. It displays the filters, the table and the empty-state message. The supplied project brief did not include numbered requirements, so these Module 10 IDs are local traceability IDs until they are matched to the collaborative SRS. The working features are implemented. Actual team review and the shared SRS update remain in progress.

## Slide 4: Working demonstration

Speaker: Jaspreet | Time: 3:15-5:00

ACTION: Use the browser for this slide. First save course DEMO101, student DEMO001, date 2026-10-20 and status Present. SAY: After saving, the application opens the matching history and shows the saved record. ACTION: Return to the form, use exactly the same course, student and date, choose Absent - excused and save. SAY: This corrects the existing mark. It does not add another record for the same student, course and date. ACTION: Add DEMO002 for the same course/date as Absent - unexcused. Open history and filter by course DEMO101 and student DEMO001. SAY: The history view shows only records that match the selected filters. ACTION: Change student to MISSING to show the empty state, then set From to 2026-10-21 and To to 2026-10-20. SAY: An invalid date range produces a clear validation message. Gera will now explain how saving and validation work.

