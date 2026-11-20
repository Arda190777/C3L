# Sprint 3 - executed testing and regression

Date: November 20, 2026. Final tested source: `86d64cc`. Runtime: Bun 1.4.3, Windows. No new runtime dependency.

| Executed check | Result | Evidence |
| --- | --- | --- |
| bun test src/modules/10-attendance | 47 pass, 0 fail, 230 assertions; 3 files | evidence/module-tests.txt |
| bun run check | 103 pass, 0 fail, 401 assertions; 9 files | evidence/full-check.txt |
| Repository lint and TypeScript host check | Pass | evidence/full-check.txt |
| Shared-router module front pages | All 12 pass | evidence/full-check.txt |
| Actual browser demonstration | Save/correct participation, second activity, totals/report/CSV verified | evidence/browser-results.md; screenshots; CSV |
| Statistics rendered UI sample | 43 elements / 13 controls; contrast/keyboard/target audit clean | evidence/ui-rendered-audit.txt; statistics-rendered.json |

The host TypeScript check does not type-check this JavaScript module. This is observed test evidence, not a coverage percentage or a claim of complete WCAG conformance.

## Tests Arda explains

- Existing DB-01 through DB-09 retain attendance save/correction/filter/persistence and status-count coverage.
- DB-10 rejects invalid count course IDs, trims valid IDs and returns zero counts for an unknown course. Real defect #15 was reproduced in the pre-fix test run.
- DB-11 participation trimming/numeric form scores; DB-12 same-activity correction retains ID while a different activity creates another record; DB-13 exact/inclusive participation filters.
- DB-14 verifies report grouping, counts, 50% present-rate example, participation totals/average and a participation-only student with zero attendance marks. DB-15 verifies empty totals and invalid participation input.
- DB-16 creates a legacy attendance file, preserves record ID 42, adds participation and verifies both schema version 2 and saved data after close/reopen. DB-17 refuses version 99 rather than downgrading it.
- New participation validation tests cover blank/wrong-type/fractional/out-of-range scores and activity/common-field limits.
- Eight mounted S3-HTTP tests exercise actual router+store interaction: participation corrections/filtering, form redirects and escaped invalid input, statistics, JSON/CSV contents/formula handling, invalid filters, friendly storage errors and rendered navigation/empty states.

Most database tests use a fresh :memory: database in beforeEach and close it in afterEach. Persistence tests use temporary folders/files and clean them afterward. They never open the application's real data file.

## Browser checks

Fictional S3DEMO101/S3DEMO001, 2026-11-20: Present; Class discussion 4 corrected to 2; Group exercise 5. Observed 1 recorded mark, 2 activities, 7 points, average 3.5. Actual downloaded CSV contains those values. An unmatched course displayed the report empty state; reversed dates displayed a validation error. Statistics at 320px had no document-level horizontal scrolling. A keyboard pass found a date-control outline gap; :focus-within now keeps the outline visible for date-control subfields. Repeated audit: no findings on the sampled statistics page. This sample does not certify every screen or assistive technology.

## Review tool limits

API checks found no breaking changes against the reconstructed attendance-only baseline. The generic API scorecard is not a production approval: authentication, rate limiting and pagination are absent. Database metadata analysis inspected the actual 2 tables / 15 columns; the helper's JSON path omits index metadata, so its zero-index summary is not accurate. SQLite actually has 2 explicit course/date indexes plus 2 autoindexes. The migration generator helper failed serialization; the implemented transactional schema upgrade is verified directly by DB-16/17.

The actual GitHub Project board is updated and linked to the repository; its default visibility is private. Real teammate peer review and the actual shared SRS update remain pending. Do not mark those activities completed using automated test results.
