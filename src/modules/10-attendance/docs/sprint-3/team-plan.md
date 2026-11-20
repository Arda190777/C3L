# Sprint 3 - team plan and current backlog

Prepared November 20, 2026. Latest implementation baseline: `04dd3ac` from `feature/attendance-sprint-2-stats` (latest push November 6).
Planning branch: `feature/attendance-sprint-3-plan`. The exact Week-12 presentation date has not been supplied.
This plan assigns remaining work. It does not claim missing features, peer reviews or shared-SRS edits are complete.

## Team allocation

| Owner | Files / area | Issue | Presentation |
| --- | --- | --- | --- |
| Jaspreet Gakhal (@jaspreetgakhal1) | formPage.js, historyPage.js, pageLayout.js, pages.js and new views as needed | [#12](https://github.com/Arda190777/C3L/issues/12) | Slides 1-3: team introduction, current scope and working attendance demo. About 3 minutes. |
| Gera Paoli (@Diffie-Hellman25519) | store.js and database/schema documentation | [#10](https://github.com/Arda190777/C3L/issues/10) | Slides 4-5: storage improvements and database design. About 2.25 minutes. |
| Arda Efe Cetintav (@Arda190777) | store.test.js, attendance.test.js, router.test.js and test evidence | [#11](https://github.com/Arda190777/C3L/issues/11) | Slides 6-7 only: test results and the status-count correction example. About 2.25 minutes. No team introduction. |
| Nasir Ishaq Sani (@nasirishaq819) | router.js, attendance.js, index.js and API/SRS/design/release documentation | [#13](https://github.com/Arda190777/C3L/issues/13) | Slides 8-10: APIs, GitHub/documentation, release limits and the Week-14 plan. About 3.25 minutes. Formal assignment waits for invitation acceptance. |

Nasir has a pending write invitation and is not yet formally assignable. Accept the invitation, then assign #13 to `nasirishaq819`. Gera is mapped to `Diffie-Hellman25519` from the supplied team list.

## Repository backlog

| Todo | Review | Done baseline |
| --- | --- | --- |
| #10 storage, #11 tests, #12 UI, #13 API/docs | No new Sprint 3 teammate review recorded | Latest source pulled; fresh baseline tests passed; four task issues and milestone created |

GitHub Projects could not be accessed because the current token lacks project scope. This table is a repository backlog, not a claim that a GitHub Project board was updated.

## Work packages

### Jaspreet Gakhal - #12

Add usable summary, participation and report views when the backend is ready. Keep labels, filters, empty/error states and narrow-screen layout clear. Update user instructions and rehearse the demo.

### Gera Paoli - #10

Finalize status-count behavior, participation persistence and summary/report data. Agree scoring rules and any attendance-rate denominator. Preserve saved records and update the database design.

### Arda Efe Cetintav - #11

Verify the existing behavior, add simple tests for agreed new functionality, run full regression and record real defects. Keep executed results separate from planned cases.

### Nasir Ishaq Sani - #13

Connect storage to HTML/JSON routes, validate new inputs, coordinate identity/enrollment integration, map the shared SRS and update API/design/release documents and backlog status.

## Order and acceptance gates

1. Agree participation rules, report fields, summary inputs and the SRS mapping. Record any cross-module dependencies.
2. Gera implements storage while Nasir prepares matching route/validation contracts. Jaspreet prepares screens against that agreed contract.
3. Integrate the features, then Arda verifies unit/storage/API behavior and reports real defects. Fix and retest those defects.
4. Before the Week-12 presentation: freeze major features, run the full check on the integrated commit, complete real peer review and update design/API/release documentation.
5. After Sprint 3: focus on bug fixing, regression, documentation and final-demo rehearsal. Do not carry major new functionality into Week 14.

Suggested effort is roughly one work package per person, reviewed by a teammate. Backend/UI dependencies may require pairing; file counts alone do not measure workload.

## Evidence and commands

Baseline run on November 20: **28 module tests / 97 assertions; 84 repository tests / 268 assertions; all 12 module front pages; lint and TypeScript host check passed**.
The host TypeScript check does not type-check the JavaScript module. Behavioral coverage comes from tests.

```sh
bun install --frozen-lockfile
bun run dev
bun test src/modules/10-attendance
bun run check
```

Open http://localhost:3000/10-attendance. Use fictional IDs. This audit did not execute a new browser demo.

## Links

- Repository: https://github.com/Arda190777/C3L
- Latest implementation: https://github.com/Arda190777/C3L/commit/04dd3ac09e93d4856df767776e4c4908f05c1feb
- Implementation branch: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-2-stats
- Planning branch: https://github.com/Arda190777/C3L/tree/feature/attendance-sprint-3-plan
- Sprint 3 milestone: https://github.com/Arda190777/C3L/milestone/2
- All issues: https://github.com/Arda190777/C3L/issues

Clone the latest implementation:

```sh
git clone --branch feature/attendance-sprint-2-stats --single-branch https://github.com/Arda190777/C3L.git
cd C3L
bun install --frozen-lockfile
bun run dev
```
