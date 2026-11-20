# Module 10 - Attendance & Participation Tracking

Sprint 3 implemented candidate (November 20, 2026). JavaScript, Elysia and Bun's built-in SQLite. Mounted by C3L's shared router at /10-attendance; no root/core changes or new runtime dependencies.

## Run the same candidate

```sh
git clone --branch feature/attendance-sprint-3-plan --single-branch https://github.com/Arda190777/C3L.git
cd C3L
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3000/10-attendance. Use fictional course/student IDs only. This module does not enforce login, roles or enrollment yet (#5). Candidate tag: `module10-sprint3-v0.3.0-rc.1`. PR #14 is for teammate review, not an already merged release.

## Working functionality

- Record and correct one daily attendance mark per course/student/date; Present, Absent - excused or Absent - unexcused.
- Filter attendance history by exact IDs and inclusive dates.
- Record participation activities with integer scores 0-5; correct the same activity without duplicates; filter history.
- Show attendance/participation statistics and per-student reports; download a filtered CSV.
- Preserve attendance when upgrading to SQLite schema v2; data survives restarting the app.

Present rate = Present / recorded marks, including excused and unexcused. Missing marks do not become absences. Participation average = total points / entries. The local 0-5 scale is not an approved institutional grading policy.

## Main files

| Files | Purpose / presentation owner |
| --- | --- |
| store.js, schema.sql | SQLite persistence, corrections, reports, totals and additive upgrade - Gera |
| store.test.js | Storage, filter, report and persistence tests - Arda (slides 6-7 only) |
| formPage.js, historyPage.js, participationPage.js, reportPages.js, pageLayout.js, pages.js | HTML views, filters, navigation - Jaspreet; introduction/demo |
| router.js, attendance.js, reportExport.js, openapi.json, index.js | Shared-router integration, validation, JSON/CSV and module entry - Nasir |
| attendance.test.js, router.test.js | Validation and mounted HTTP regression tests; overall results summarized by Arda |

Ownership is for understanding/review/presentation, not fabricated commit authorship. All members should review their assigned area.

## Database and checks

The file database is created lazily at data/attendance.sqlite (git-ignored); most tests use :memory:. Back up existing files before opening them with v2. schema.sql is the canonical additive DDL. Attendance key: course/student/date. Participation key: course/student/date/activity. Scores 0-5; activity 1-100 characters; notes at most 300. No audit log or pagination. Keep schema.sql beside the source when running the module.

```sh
bun test src/modules/10-attendance
bun run check
```

Verified `86d64cc`: 47 module tests / 230 assertions; 103 repository tests / 401 assertions; lint, TypeScript host check and all 12 module front pages pass. The host TypeScript check does not type-check JavaScript. Real browser checks include corrections, report download and a narrow statistics layout.

## Current documentation and presentation

- [Four-person task allocation and setup](docs/sprint-3/team-plan.md)
- [Requirements / shared SRS contribution](docs/sprint-3/requirements-map.md) - external shared update still pending
- [Architecture and database design](docs/sprint-3/design.md)
- [API and live-demo steps](docs/sprint-3/current-api.md); machine-readable [OpenAPI](openapi.json)
- [Executed tests and evidence](docs/sprint-3/testing.md)
- [Release notes / known issues](docs/sprint-3/release-readiness.md)
- [Team handout PDF](docs/sprint-3/Sprint3-Team-Plan.pdf), [Arda transcript PDF](docs/sprint-3/Arda-Sprint3-Transcript.pdf), [slide speaker notes](docs/sprint-3/speaker-notes.md)

Historical Sprint 1 forms, release notes and presentation files remain under docs/. They describe the earlier scope; use the Sprint 3 links above for current behavior and responsibilities. Issues #10-13 track the current ownership; #6/#15 are completed on the candidate; #5 remains open for identity/enrollment integration. The actual [Sprint 3 Project board](https://github.com/users/Arda190777/projects/1) is updated and linked (private, owner sign-in required). Real peer review and shared SRS mapping remain pending.
