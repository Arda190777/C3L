# Sprint 3 - current API and user instructions

All paths below are relative to /10-attendance. The machine-readable OpenAPI 3.0.3 contract is ../../openapi.json and is served at /10-attendance/openapi.json. Version 0.3.0.

| Method / path | Response / purpose |
| --- | --- |
| GET / | Attendance entry form |
| POST /attendance | Save/correct attendance form; 303 on success |
| GET /history | Filtered attendance history HTML |
| GET /participation | Participation entry and history HTML |
| POST /participation | Save/correct participation form; 303 on success |
| GET /statistics | Filtered attendance and participation totals HTML |
| GET /reports | Per-course/student report and CSV download HTML |
| GET /api/attendance | JSON {records: [...]} |
| POST /api/attendance | Save/correct, JSON {record: {...}}; 200 |
| GET /api/participation | JSON {records: [...]} |
| POST /api/participation | Save/correct, JSON {record: {...}}; 200 |
| GET /api/statistics | JSON {statistics: {...}} |
| GET /api/reports/attendance | JSON {rows: [...]} |
| GET /reports/attendance.csv | Quoted CSV attachment with the same filters |
| GET /openapi.json | API specification |

Read filters: courseId, studentId, from, to. IDs match exactly after trimming request whitespace; omitted filters are empty. Both dates are included. Invalid/impossible/reversed dates return 422. Store failures return 503. See the specification for response schemas and error formats; framework shape errors may use Elysia's own validation response. Successful JSON writes return 200 because they may update an existing logical key.

Participation JSON example:

```json
{"courseId":"S3DEMO101","studentId":"S3DEMO001","date":"2026-11-20","activity":"Class discussion","score":4,"notes":""}
```

score accepts integer 0-5 or its numeric form string. activity is trimmed 1-100 characters. Re-submit the same course/student/date/activity to correct it. A changed activity label creates a separate activity; it does not rename an existing record.

## Simple live demo (Jaspreet)

1. Open /10-attendance. Save fictional S3DEMO101 / S3DEMO001 / 2026-11-20 / Present. Show history and filters.
2. Open Participation. Save Class discussion with score 4, then re-submit the same key with score 2. Show one corrected entry, not two.
3. Save Group exercise for the same student/date with score 5. Show two activities.
4. Open Statistics and filter course S3DEMO101. In a fresh demo dataset: 1 present mark, 2 activities, 7 points, average 3.5/5.
5. Open Reports with the same course filter and click Download CSV. Open the downloaded file or show the saved evidence CSV. The report fields match the statistics.
6. Use a fresh fictional course ID if the demo database already contains other examples. Do not delete another person's data to reset it.

Use native browser date controls for the displayed locale; stored/API dates remain YYYY-MM-DD. The prototype does not enforce sign-in/roles/enrollment (#5); do not use real student records. An API breaking-change comparison against a reconstructed legacy attendance contract found no breaking changes. This is not proof of compatibility with an unavailable published external contract.
