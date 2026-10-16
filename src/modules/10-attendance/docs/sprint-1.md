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

| Issue | Task | Proposed requirement | Assignee |
| --- | --- | --- | --- |
| #1 | Daily attendance, correction, persistence and absence types | M10-FR-01, M10-FR-03 | Arda190777 |
| #2 | Filtered attendance history, HTML and JSON | M10-FR-02 | Arda190777 |
| #3 | Input validation and safe rendering/storage | M10-NFR-01, M10-NFR-02 | Arda190777 |
| #4 | Tests, design, submission documents and teammate review | Common requirements | Arda190777 and jaspreetgakhal1 |

These assignments describe actual GitHub task ownership, not claims about each person's completed
work. The collaborator invitation was accepted and GitHub confirms Write access. Issue #4 is
assigned to both members. A real teammate review is still needed.

## Definition of done

- [x] Required local functionality implemented in JavaScript.
- [x] Module tests and full `bun run check` pass with saved output.
- [x] Requirements and design update prepared in the module folder.
- [ ] Team code review completed and internal PR merged.
- [ ] Proposed requirement IDs mapped into the actual collaborative SRS.
- [ ] Team demo rehearsed and review/retrospective observations recorded.
- [ ] Final submission checked against the class rubric.

## Future backlog

- #5: login, instructor permissions and enrolled course/student IDs.
- #6: participation, attendance reports and statistics (M10-FR-04 to M10-FR-06).

## Five-minute demo outline

1. Open the shared home page and Module 10.
2. Save PROG3000 / S1001 / 2026-10-16 as Present.
3. Save the same combination as Absent - excused; show that only one row remains.
4. Add S1002 as Absent - unexcused and show both labels.
5. Filter by student and date, then show an empty result.
6. Explain date/ID validation and show the test output and persistence test.
7. Explain #5/#6 and the next-sprint scope. Each teammate should be able to explain their contribution.

Sprint review and retrospective are team activities. No meeting, peer review or contribution is
recorded as completed unless it actually occurs.
