# Module 10: Attendance & Participation Tracking

Sprint 1 implements daily attendance, attendance history and excused/unexcused absences.
The module uses JavaScript, Elysia and Bun's built-in SQLite support. No packages were added.
The shared application remains TypeScript; its loader supports this module's `index.js`.

## Run

From the repository root:

```sh
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:3000/10-attendance` or select Module 10 on the home page.
Use sample data only: login, instructor permissions and enrollment checks are still open in #5.

## Try it

1. Enter course `PROG3000`, student `S1001` and date `2026-10-16`.
2. Choose Present and save. The history page shows the saved mark.
3. Save the same IDs and date as Absent - excused. The existing mark is corrected.
4. Filter history by course, student or dates. IDs are case-sensitive exact matches.
5. Restart the server. Saved records remain in the local SQLite database.

Only one mark per calendar day is supported for a student in a course. Separate class sessions,
participation scores, reports and statistics are outside Sprint 1.

## Files

| File | Responsibility |
| --- | --- |
| `index.js` | Module registration and database path |
| `router.js` | HTML and JSON routes |
| `attendance.js` | Status labels and input validation |
| `store.js` | AttendanceStore class and parameterized SQLite queries |
| `pages.js` | HTML form, errors and history table |
| `*.test.js` | Unit, storage and integration tests |
| `docs/` | Requirements proposal, design, sprint plan, testing evidence and submissions |

The database is created lazily at `data/attendance.sqlite`. That directory is git-ignored.
It is a single-machine prototype database, not shared hosting or multi-instance storage.
Notes are limited to 300 characters; do not enter private health or personal information.

## Check and document

```sh
bun test src/modules/10-attendance
bun run check
doxygen src/modules/10-attendance/Doxyfile
```

`bun run check` lints JavaScript, type-checks the existing TypeScript app, runs all tests and checks
all module front pages. The root TypeScript configuration does not type-check JavaScript.
The JavaScript behavior is covered by module tests and mounted-router tests.
Doxygen outputs to `docs/generated/html`; zip that directory for the HTML design submission.
The design pages document the JavaScript API explicitly; no TypeScript conversion is required.

See [Sprint 1 plan](docs/sprint-1.md), [SRS update proposal](docs/srs-update.md),
[design and API](docs/design.md) and [test results](docs/testing.md).
