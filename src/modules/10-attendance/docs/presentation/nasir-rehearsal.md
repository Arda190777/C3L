# Nasir - Sprint 1 rehearsal sheet

## Your code area

router.js GET routes, AttendanceStore.list, router.test.js

## Before class

1. Follow historyFilter and validateFilter into AttendanceStore.list.
2. Check exact ID filters, inclusive dates, newest-first sorting and API response statuses.
3. Run module tests and the full check. Keep the actual output if changes are made.
4. Prepare repo, milestone, issues, commit history, branch, PR and CI tabs before class.
5. Update/map the actual collaborative SRS when its link is supplied; this remains pending.
6. Explain API/testing/GitHub on slides 8-9. Your named issues are #2 and #8.

## English speaking notes

## Slide 8: History filters and API design

Speaker: Nasir | Time: 8:00-9:00

My assigned technical area is reading and filtering attendance, API verification and regression testing. The history page uses the same stored records as the JSON API. Course and student filters match exact IDs. Both date limits are inclusive, and records are sorted newest date first. The JSON API supports GET for reading and POST for saving. The normal JSON success response is 200. Invalid fields return 422 and a storage failure returns 503. The HTML form uses a 303 redirect after saving so the browser opens the history page. I also coordinate requirement traceability and the update to the collaborative SRS.

## Slide 9: GitHub and regression evidence

Speaker: Nasir | Time: 9:00-10:45

ACTION: Open the repository, then the Sprint 1 milestone. Show issues 4 and 9 assigned to Arda and Jaspreet and the named technical responsibilities for Gera and Nasir. SAY: The technical account assignments for Gera and Nasir are deferred until those accounts are supplied. ACTION: Open the feature branch commit history and PR 7. SAY: The commits record the prepared implementation. We are not presenting them as separate personal contributions from every member. The pull request targets our own fork's main branch and requests a real teammate review. ACTION: Open the CI checks or saved regression output. SAY: The prepared candidate passed 25 module tests and all 81 repository tests. The sanity check also loaded all 12 modules. The shared SRS update remains pending because its link has not yet been supplied. Once it is available, the local requirement IDs must be mapped into it.

