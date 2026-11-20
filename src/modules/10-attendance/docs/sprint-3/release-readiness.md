# Sprint 3 - baseline release-readiness snapshot

Service: Module 10 - Attendance & Participation Tracking.
Repository: https://github.com/Arda190777/C3L
Implementation branch: feature/attendance-sprint-2-stats.
Verified implementation commit: 04dd3ac09e93d4856df767776e4c4908f05c1feb.
Planning/documentation branch: feature/attendance-sprint-3-plan.
Prepared: November 20, 2026.
Sprint 3 tag: not created. Latest existing candidate tag is the historical Sprint 1 tag module10-sprint1-v0.1.0-rc.3.

## Implemented baseline
- Daily attendance save/correction, history filters and absence types (#1/#2/#3).
- Latest push adds countByStatus(courseId) and DB-09 (#6 partial). This method is storage-only, with no summary route or screen.
- Fresh baseline checks: 28 module tests, 84 repository tests and 12 front pages passed. Full output is in evidence/.

These are implemented capabilities, not a claim that the associated issues or PR #7 have been closed/merged.

## Known issues and remaining work
- #10: participation/report storage and final database decisions remain planned.
- #12/#13: summary UI/API and participation/report integration are missing at baseline.
- #5: authentication, roles and enrollment enforcement remain unimplemented in Module 10. Use sample IDs locally.
- #11: new feature-specific cases and the final integrated regression run remain pending. Current passing counts do not prove coverage of unimplemented features.
- #13: shared SRS link/mapping is pending. Architecture/API/release documents need updates as implementation changes.
- GitHub Projects access is unavailable with the current token. Use the repository backlog until board access is available.
- Nasir must accept the existing repository invitation before #13 can be formally assigned.
- One mark per student/course/day. Corrections replace status/notes. No audit log, pagination or multiple daily sessions.
- SQLite is local to one application installation. No Sprint 3 release has been published.

## Installation and use
From the repository root: bun install --frozen-lockfile, then bun run dev.
Open http://localhost:3000/10-attendance. Record a fictional course/student/date and one of the three statuses. Save the same combination to correct it. Use history filters to read records.
Course counts currently appear through the storage method/tests, not a working statistics screen.

## Release gate
- [ ] Implement agreed major features and finalize database/API contracts.
- [ ] Complete real reviews and update the issue/backlog status.
- [ ] Update the collaborative SRS, design diagrams, API and user instructions.
- [ ] Run full regression against the exact final commit and record known defects.
- [ ] Create a release tag on the reviewed candidate and update these notes with its real value.
