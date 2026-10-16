# Module 10 - Sprint 1 plan

Prepared October 16, 2026. Submission deadline: October 20, 2026, 11:59 PM America/Toronto.

Sprint goal: record and correct daily attendance, distinguish absence types and retrieve history
within the shared C3L router. Keep the implementation small and usable for a local class demo.

Repository: https://github.com/Arda190777/C3L

Branch: `feature/attendance-sprint-1`

Milestone: https://github.com/Arda190777/C3L/milestone/1

## Step 1 - Fixes and enhancements

There is no previous attendance implementation or reported attendance defect in the starter.
Do not present the demo placeholder as a fixed production bug.

- #3: add validation, escaped output, safe queries and useful validation/storage error messages.
- #4: add unit/integration/regression evidence and update module design/requirements documents.
- Keep all changes inside `src/modules/10-attendance`. Do not change the common router or dependencies.
- No enhancement extends the six functions in the supplied brief. Class SRS mapping is pending.

## Step 2 - New functionality

| Issue | Task | Proposed requirement | Planned owner |
| --- | --- | --- | --- |
| #1, #3 | Review/finalize attendance recording, correction and validation | M10-FR-01, M10-FR-03, NFR-01/02 | Gera Paoli; GitHub username needed |
| #2, #8 | Review history/filters, verify regression evidence and update the class SRS | M10-FR-02 and common requirements | Nasir Ishaq Sani; GitHub username needed |
| #4 | Form UI in formPage.js, submission forms and release details | M10-FR-01 UI and common requirements | Arda Efe Cetintav (Arda190777) |
| #9 | History UI in historyPage.js, use instructions, demo and peer review | M10-FR-02 UI and common requirements | Jaspreet Gakhal (jaspreetgakhal1) |

Arda and Jaspreet handle small UI and final-check/demo tasks. Gera owns the backend write path;
Nasir owns the read/filter/API path. Their technical workloads are comparable. Code/tests and
draft documents are prepared. Each member should review their section
and record actual results. GitHub account assignments for Gera and Nasir are deferred for now.
Jaspreet has Write access. Actual peer review, shared SRS editing and the team demo are pending.

## Definition of done

- [x] Required local functionality implemented in JavaScript.
- [x] Module tests and full `bun run check` pass with saved output.
- [x] Requirements and design update prepared in the module folder.
- [ ] Team code review completed and internal PR merged.
- [ ] Proposed requirement IDs mapped into the actual collaborative SRS (#8).
- [ ] GitHub tasks assigned to Gera and Nasir when their accounts are added; deferred for now.
- [ ] Team demo rehearsed and review/retrospective observations recorded.
- [ ] Final submission checked against the class rubric.

## Future backlog

- #5: login, instructor permissions and enrolled course/student IDs.
- #6: participation, attendance reports and statistics (M10-FR-04 to M10-FR-06).

## Presentation and demo outline

The 10-slide English deck covers about 11 minutes of content/demo plus 2 minutes of questions.
Arda presents slides 1-2 and the short closing, Jaspreet 3-4, Gera 5-7, Nasir 8-9.
See `team-work-plan.md` and `presentation/speaker-script.md` for the exact split and speaking notes.

1. Open the shared home page and Module 10.
2. Save PROG3000 / S1001 / 2026-10-16 as Present.
3. Save the same combination as Absent - excused; show that only one row remains.
4. Add S1002 as Absent - unexcused and show both labels.
5. Filter by student and date, then show an empty result.
6. Gera explains date/ID validation; Nasir shows the test results and SRS mapping.
7. Arda confirms the deliverables and tag; explain #5/#6 as deferred work. Each teammate explains
   their actual contribution. Jaspreet can lead the simple screen demonstration.

Sprint review and retrospective are team activities. No meeting, peer review or contribution is
recorded as completed unless it actually occurs.
