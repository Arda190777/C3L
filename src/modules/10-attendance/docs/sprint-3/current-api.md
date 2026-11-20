# Sprint 3 - current API and integration boundary

Verified implementation: `04dd3ac`, November 20, 2026. All paths below include the shared module
prefix. No common router/core changes are required. Nasir owns updates for new contracts in #13.

| Method and path | Input | Current response |
| --- | --- | --- |
| GET /10-attendance | None | Attendance form HTML, 200 |
| POST /10-attendance/attendance | Form fields listed below | Save/correct then 303 redirect to filtered history. Business validation errors: HTML 422. Storage failure: HTML 503. |
| GET /10-attendance/history | Optional courseId, studentId, from, to query fields | History HTML, 200. Invalid filter: 422. Storage failure: 503. |
| GET /10-attendance/api/attendance | Same optional filters | JSON `{ "records": [...] }`, 200. Invalid filter: `{ "errors": {...} }`, 422. Storage failure: `{ "error": "Could not load attendance." }`, 503. |
| POST /10-attendance/api/attendance | JSON fields listed below | JSON `{ "record": {...} }`, 200. Invalid fields: `{ "errors": {...} }`, 422. Storage failure: `{ "error": "Could not save attendance." }`, 503. |

The Elysia request schema also rejects missing or incorrectly typed fields. Malformed JSON can
produce a framework parsing error before the business handler runs.

## Attendance request

```json
{
  "courseId": "DEMO101",
  "studentId": "DEMO001",
  "date": "2026-11-20",
  "status": "present",
  "notes": ""
}
```

Course/student IDs must be 1-50 characters after trimming. Dates must be real YYYY-MM-DD dates.
Status is present, excused or unexcused. Notes are optional in the request, default to an empty
string and have a 300-character business limit. Saving the same course/student/date updates
status, notes and updatedAt while retaining the record ID.

Returned records contain id, courseId, studentId, date, status, notes and updatedAt. Input values
are bound in the write SQL and escaped in HTML views.

## History filters

IDs use case-sensitive exact matches. Omitted/empty filters impose no restriction for that field.
Date boundaries are inclusive. A reversed range returns 422. Results sort by newest date, then
course/student ID. The current small local prototype reads records and applies filters in JavaScript.

## Storage-only summary

`AttendanceStore.countByStatus(courseId)` returns an object with present, excused and unexcused
counts for recorded marks in one trimmed course ID. It is not an HTTP endpoint and the current
views do not display it. DB-09 covers course isolation and correction of a mark between statuses.
Empty/unknown/invalid-course contract checks are assigned to Gera and Arda.

## Remaining integration

Summary, participation and report routes have not been implemented. Agree their real paths,
request/response/error contracts and participation rules before wiring the UI. Do not advertise
draft URLs as working endpoints. No attendance percentage formula is assumed.

Module 10 does not yet enforce authentication, roles or enrollment. Coordinate this dependency
with Modules 1 and 2 under #5. Use fictional data locally until access checks exist.
