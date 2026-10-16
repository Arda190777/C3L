# Module 10 - Sprint 1 design

## Architecture

The browser sends HTML form requests or JSON requests to the common C3L app. The loader discovers
`index.js` and mounts its router at `/10-attendance`. `router.js` validates requests using
`attendance.js`, calls `AttendanceStore` and renders HTML through `pages.js` or returns JSON.
The shared response wrapper sets the HTML content type. No common files were changed.

@image html architecture.svg "Module 10 architecture"

## Use cases

The intended actor is an instructor. Sprint 1 is a local prototype with no role enforcement.
Recording, correcting and filtering can be demonstrated with fictional IDs. Identity and course
integration belong to issue #5.

@image html use-cases.svg "Sprint 1 use cases"

## Class and responsibilities

`AttendanceStore` encapsulates database access. Its constructor accepts a file path or `:memory:`
for tests. `save(input)` inserts or corrects one mark; `list(filter)` reads matching records;
`close()` releases the database. Page and validation functions do not own storage.

@image html classes.svg "Class and module responsibilities"

## Database design

@image html database.svg "Attendance table"

| Column | SQLite type | Rule |
| --- | --- | --- |
| id | INTEGER | Primary key |
| course_id | TEXT | Required, trimmed ID |
| student_id | TEXT | Required, trimmed ID |
| attendance_date | TEXT | Required real YYYY-MM-DD date |
| status | TEXT | present, excused or unexcused; database CHECK constraint |
| notes | TEXT | Required storage value; empty string when omitted |
| updated_at | TEXT | Server UTC timestamp of last save |

Unique key: `(course_id, student_id, attendance_date)`. Date validation happens before SQL.
Every user-supplied SQL value is bound as a parameter. No cross-module foreign keys are declared
until the teams agree IDs. Corrections overwrite status/notes; audit history is not implemented.

## HTML routes

| Method | Full path | Result |
| --- | --- | --- |
| GET | /10-attendance | Attendance form, 200 HTML |
| POST | /10-attendance/attendance | Save form, 303 to filtered history; invalid fields 422 HTML |
| GET | /10-attendance/history | History/filter form, 200 HTML; invalid filters 422 HTML |

Storage errors return 503 with a readable message and no stack trace/path in the response.
Validation errors preserve escaped input. Native controls have labels and visible focus styles.
The form uses one column on narrow screens; the history table can scroll inside its container.

## JSON API

### POST /10-attendance/api/attendance

Send `Content-Type: application/json`:

```json
{"courseId":"PROG3000","studentId":"S1001","date":"2026-10-16","status":"present","notes":"Demo"}
```

Required strings: courseId, studentId, date and status. Notes are optional. IDs must be 1-50
characters after trimming; notes are at most 300. Dates must be real calendar dates. Allowed
statuses: present, excused, unexcused. Dates are entered explicitly; no timezone conversion is applied.

Success: 200 with `{ "record": { "id": 1, "courseId": "PROG3000", "studentId": "S1001",
"date": "2026-10-16", "status": "present", "notes": "Demo", "updatedAt": "<UTC timestamp>" } }`.
Both creation and correction return 200. Malformed JSON returns a client error from Elysia;
missing/wrong-type fields return 422. Business validation returns 422 with an `errors` object.
Storage failure returns 503 with `{ "error": "Could not save attendance." }`.

### GET /10-attendance/api/attendance

Optional query parameters: `courseId`, `studentId`, `from`, `to`. All default to empty strings.
IDs match exactly; both date bounds are inclusive. With no filters, return all stored marks.
Example: `/10-attendance/api/attendance?courseId=PROG3000&from=2026-10-01&to=2026-10-20`.

Success: 200 `{ "records": [...] }`, sorted by date descending, then course and student.
No matches: 200 `{ "records": [] }`. Invalid dates/reversed range: 422 `{ "errors": {...} }`.
Storage failure: 503 `{ "error": "Could not load attendance." }`.

## Limits and decisions

- Built-in `bun:sqlite` avoids a new dependency or Docker service for this sprint.
- Storage is local to one server; shared deployment and backups need a later decision.
- API and pages currently have no authorization, roster validation or pagination (#5 and future planning).
- Participation and reports/statistics remain unimplemented (#6).
- The class collaborative SRS has not been edited: its link and official IDs are still needed (#4).

## Source files

@verbinclude index.js

@verbinclude attendance.js

@verbinclude store.js

@verbinclude router.js

@verbinclude pages.js
