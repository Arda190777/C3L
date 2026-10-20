# Sprint 1 - English speaker script

Target: 11 minutes 15 seconds for content/demo, then about 2 minutes for questions.
Read the speaking sentences naturally. Follow ACTION instructions silently.
Assigned areas describe responsibility; each member must verify their own section before class.

## Slide 1: Attendance & Participation Tracking

Speaker: Arda | Time: 0:00-0:45

Good morning. We are presenting Module 10, Attendance and Participation Tracking, for the C3L learning management system. Our group members are Arda Efe Cetintav, Jaspreet Gakhal, Gera Paoli and Nasir Ishaq Sani. Sprint 1 is our first working local prototype. We will show the selected requirements, our assigned responsibilities, the design, GitHub evidence and a short working demonstration.

## Slide 2: Team responsibilities

Speaker: Arda | Time: 0:45-2:15

Our work is divided into two interface areas and two backend areas. My assigned code area is the attendance form: labels, status options, links and displayed field errors. I also check the submission forms and release details. Jaspreet's area is the history interface and the live demonstration. Gera handles saving records, validation and the database. Nasir handles history queries, filters, API verification and regression testing. Gera and Nasir have comparable technical workloads. These are the team's assigned responsibilities. The code and draft documents are prepared, and each member still needs to review and verify their area. I will show the attendance form before handing over to Jaspreet. ACTION: Open /10-attendance, point to course ID, student ID, date, status and notes. Do not save yet. Explain that labels and errors are rendered by formPage.js while storage is handled separately.

## Slide 3: Sprint 1 scope and progress

Speaker: Jaspreet | Time: 2:15-3:15

The complete module includes attendance, participation, reports and statistics. For Sprint 1 we selected the first three attendance functions. We can record a daily mark, correct it, view history and distinguish excused from unexcused absences. My assigned interface area is historyPage.js. It displays the filters, the table and the empty-state message. The supplied project brief did not include numbered requirements, so these Module 10 IDs are local traceability IDs until they are matched to the collaborative SRS. The working features are implemented. Actual team review and the shared SRS update remain in progress.

## Slide 4: Working demonstration

Speaker: Jaspreet | Time: 3:15-5:00

ACTION: Use the browser for this slide. First save course DEMO101, student DEMO001, date 2026-10-20 and status Present. SAY: After saving, the application opens the matching history and shows the saved record. ACTION: Return to the form, use exactly the same course, student and date, choose Absent - excused and save. SAY: This corrects the existing mark. It does not add another record for the same student, course and date. ACTION: Add DEMO002 for the same course/date as Absent - unexcused. Open history and filter by course DEMO101 and student DEMO001. SAY: The history view shows only records that match the selected filters. ACTION: Change student to MISSING to show the empty state, then set From to 2026-10-21 and To to 2026-10-20. SAY: An invalid date range produces a clear validation message. Gera will now explain how saving and validation work.

## Slide 5: Application architecture

Speaker: Gera | Time: 5:00-6:00

The browser sends a request to the shared C3L application. The module loader discovers index.js and mounts our router under /10-attendance. We did not change the shared router. Our router validates submitted data, calls AttendanceStore and returns HTML or JSON. The form and history views are separate JavaScript files, so the two interface tasks are small and independent. Shared layout and error-message helpers stay in pageLayout.js. My assigned backend area is recording, correcting and validating attendance. Nasir's area covers reading and filtering the records.

## Slide 6: Database and class design

Speaker: Gera | Time: 6:00-7:15

We use Bun's built-in SQLite support. SQLite stores our attendance data in a local file, so we do not need a separate database server for this prototype. The attendance table stores an ID, course ID, student ID, calendar date, status, notes and update time. The unique combination is course, student and date. The save query inserts a record or updates status and notes when that combination already exists. The AttendanceStore class owns database access. Its main methods are save, list and close. There is one table at this stage. We have not invented relationships to other modules because shared user and course contracts are still pending. ACTION: Point to the unique key and AttendanceStore methods.

## Slide 7: Validation and storage checks

Speaker: Gera | Time: 7:15-8:00

Validation happens on the server as well as in the browser. IDs cannot be blank, the date must exist on the calendar and the status must be one of our three allowed values. Notes are optional and limited to 300 characters. SQL values are passed as parameters, and user text is escaped before it is displayed in HTML. A storage failure produces a readable error rather than a successful save message. Unit and storage tests cover invalid values, correction without duplication, filtering and persistence after reopening the database. Nasir will show the API and project evidence.

## Slide 8: History filters and API design

Speaker: Nasir | Time: 8:00-9:00

My assigned technical area is reading and filtering attendance, API verification and regression testing. The history page uses the same stored records as the JSON API. Course and student filters match exact IDs. Both date limits are inclusive, and records are sorted newest date first. The JSON API supports GET for reading and POST for saving. The normal JSON success response is 200. Invalid fields return 422 and a storage failure returns 503. The HTML form uses a 303 redirect after saving so the browser opens the history page. I also coordinate requirement traceability and the update to the collaborative SRS.

## Slide 9: GitHub and regression evidence

Speaker: Nasir | Time: 9:00-10:45

ACTION: Open the repository, then the Sprint 1 milestone. Show issues 4 and 9 assigned to Arda and Jaspreet and the named technical responsibilities for Gera and Nasir. SAY: The technical account assignments for Gera and Nasir are deferred until those accounts are supplied. ACTION: Open the feature branch commit history and PR 7. SAY: The commits record the prepared implementation. We are not presenting them as separate personal contributions from every member. The pull request targets our own fork's main branch and requests a real teammate review. ACTION: Open the CI checks or saved regression output. SAY: The prepared candidate passed 25 module tests and all 81 repository tests. The sanity check also loaded all 12 modules. The shared SRS update remains pending because its link has not yet been supplied. Once it is available, the local requirement IDs must be mapped into it.

## Slide 10: Next sprint and remaining hand-in work

Speaker: Arda, then all members | Time: 10:45-11:15, then questions to 13:15

Arda: We have prepared the two required submission forms, the design HTML package and regression evidence. Before final hand-in, we still need the actual team review, shared SRS update and final verification. For Sprint 2, the proposal is to agree user and course integration and refine participation tracking. Reports and statistics remain in the backlog. Our current version is a local prototype using fictional IDs. Thank you. We are ready for questions. QUESTION ROUTING: Arda answers scope, form UI and submission details. Jaspreet answers history UI and demo steps. Gera answers validation, SQLite and corrections. Nasir answers filters, API, tests and GitHub/SRS tracking. Do not mark pending collaboration activities complete until they occur.
