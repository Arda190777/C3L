# Gera - Sprint 1 rehearsal sheet

## Your code area

attendance.js, store.js, router.js POST routes

## Before class

1. Follow POST requests into validateAttendance and AttendanceStore.save.
2. Review validation rules, bound SQL parameters, the unique daily key and conflict update.
3. Run validation/storage tests and inspect the restart-persistence case.
4. Fix any real write/validation defect found; do not expand the Sprint 1 scope.
5. Explain architecture, SQLite, class methods and validation on slides 5-7.
6. Coordinate store.js/router.js edits with Nasir. Your named issues are #1 and #3.

## English speaking notes

## Slide 5: Application architecture

Speaker: Gera | Time: 5:00-6:00

The browser sends a request to the shared C3L application. The module loader discovers index.js and mounts our router under /10-attendance. We did not change the shared router. Our router validates submitted data, calls AttendanceStore and returns HTML or JSON. The form and history views are separate JavaScript files, so the two interface tasks are small and independent. Shared layout and error-message helpers stay in pageLayout.js. My assigned backend area is recording, correcting and validating attendance. Nasir's area covers reading and filtering the records.

## Slide 6: Database and class design

Speaker: Gera | Time: 6:00-7:15

We use Bun's built-in SQLite support. SQLite stores our attendance data in a local file, so we do not need a separate database server for this prototype. The attendance table stores an ID, course ID, student ID, calendar date, status, notes and update time. The unique combination is course, student and date. The save query inserts a record or updates status and notes when that combination already exists. The AttendanceStore class owns database access. Its main methods are save, list and close. There is one table at this stage. We have not invented relationships to other modules because shared user and course contracts are still pending. ACTION: Point to the unique key and AttendanceStore methods.

## Slide 7: Validation and storage checks

Speaker: Gera | Time: 7:15-8:00

Validation happens on the server as well as in the browser. IDs cannot be blank, the date must exist on the calendar and the status must be one of our three allowed values. Notes are optional and limited to 300 characters. SQL values are passed as parameters, and user text is escaped before it is displayed in HTML. A storage failure produces a readable error rather than a successful save message. Unit and storage tests cover invalid values, correction without duplication, filtering and persistence after reopening the database. Nasir will show the API and project evidence.

