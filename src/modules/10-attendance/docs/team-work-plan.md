# Sprint 1 - four-person work plan

Presentation: Tuesday, October 20, 2026. Target: 11 minutes of presentation/demo plus 2 minutes
of questions. All four members speak. No new scope beyond daily attendance, absence types and history.

## Code and presentation allocation

| Member | Code area | Verification / documentation | Presentation |
| --- | --- | --- | --- |
| Arda Efe Cetintav | `formPage.js`: labels, status selection, notes, links and visible errors | Check the two PDF forms and release metadata, #4 | Slides 1-2 and closing: introduction, responsibilities and form UI, about 2.5 min |
| Jaspreet Gakhal | `historyPage.js`: filter controls, table headings, empty state and clear-filter link | Follow use instructions and rehearse the screen demo, #9 | Slides 3-4: requirements and live demo, about 2.75 min |
| Gera Paoli | `attendance.js`, `store.js` and POST handlers in `router.js` | Validate unit/storage results and explain architecture/database, #1/#3 | Slides 5-7: architecture, class/table and validation, 3 min |
| Nasir Ishaq Sani | `AttendanceStore.list`, GET handlers/history filters in `router.js`, integration tests | Verify full regression and GitHub evidence, map/update shared SRS, #2/#8 | Slides 8-9: API, filters, tests and GitHub, about 2.75 min |

Arda and Jaspreet have the smaller interface tasks. Gera and Nasir each own one backend direction:
Gera writes/corrects marks, Nasir reads/filters them. Both review code and test evidence, prepare a
technical design explanation and answer questions for their area. Plan about 90-120 minutes each
for technical review/rehearsal; this is an estimate, not time already spent.

The implementation and drafts are already prepared. These are assigned areas for learning,
verification and any real remaining changes. Existing commits retain their actual author/history.
GitHub accounts for Gera and Nasir are deferred at the user's request. The shared SRS link is still missing.

## Arda - simple coding checklist

1. Open `formPage.js`. Locate `renderForm`, the `<label>` elements, status `<select>` and save button.
2. Explain that this function returns an HTML string. It displays input; it does not write SQL.
3. Check that each label's `for` value matches the input `id` and that field `name` values match
   `courseId`, `studentId`, `date`, `status`, `notes` in the request schema. Keep those names intact.
4. Confirm all three status choices appear, notes are optional, and required fields are marked.
5. If a wording improvement is needed, edit only visible hint/label text. A safe practice change
   is changing the course/student examples to `DEMO101` and `DEMO001`; it does not change storage.
6. Open the form, try an empty required field and a valid sample save, then run the module tests.
7. Review the two PDFs and repository/branch/tag details. Submit only after team/SRS checks are complete.

Minimum explanation: `renderForm` builds the form; `escapeHtml` protects displayed values;
`errorAttributes` connects a field to its validation message; the POST route saves the data.

## Jaspreet - simple coding checklist

1. Open `historyPage.js`. Find the `fields` array and `renderHistory` function.
2. Locate the filter form, `records.map`, the table headings, the empty-state message and Clear filters.
3. Explain that `records` are provided by the backend. This file renders them; it does not calculate
   database filters or build SQL.
4. Check the headings match the displayed values and both absence labels are understandable.
5. If a wording improvement is needed, edit only the empty-state/helper text. Example:
   `No matching records. Clear the filters or record attendance.` Keep escaping and conditions intact.
6. Rehearse save, correction, filtering, empty result and reversed dates. Check Clear filters works.
7. Inspect PR #7 and record actual review feedback. Follow the notes on slides 3-4.

Minimum explanation: `records.map` builds table rows; the conditional shows an empty message when
there are no rows; the GET form sends filter values in the URL; the backend performs filtering.

## Gera - backend write checklist

1. Follow form submission into POST `/attendance` and POST `/api/attendance`.
2. Read `validateAttendance`: ID lengths, real dates, allowed status and notes length.
3. Read `AttendanceStore.save`: SQL parameters, unique key and conflict update.
4. Confirm a repeated course/student/date changes status/notes without creating another row.
5. Run validation and storage tests. Explain the persistence test and local SQLite file.
6. Review the class/table design and prepare slides 5-7. Own fixes for write/validation defects.

## Nasir - backend read checklist

1. Follow GET `/history` and GET `/api/attendance` into `historyFilter` and `validateFilter`.
2. Read `AttendanceStore.list`: exact IDs, inclusive dates and newest-first ordering.
3. Verify form redirect, JSON responses, invalid filters and shared-prefix integration tests.
4. Run the module tests and full check. Keep actual results if changes are made.
5. Show the repository, milestone, issues, branches, commits, PR and CI. Accounts for Gera/Nasir
   remain unassigned until supplied. Do not present a requested review as an approved review.
6. Map the proposed requirements into the actual collaborative SRS when its link is available.
7. Prepare slides 8-9. Own fixes for read/filter/API integration defects.

## Working together

Use the team fork and feature branches. Do not alter past authors or dates. Stage only Module 10.
For a real change, make a specific commit, push the feature branch and have a teammate review the PR.
Arda/Jaspreet should not change shared layout, SQL or API rules for a wording-only task.
Gera/Nasir should coordinate changes to shared `store.js` and `router.js` before editing them.

From the repo root:

```sh
bun test src/modules/10-attendance
bun run check
```

The PowerPoint contains full English speaker notes. `presentation/speaker-script.md` provides
the same notes with timing/actions; individual rehearsal sheets are in `presentation/`.
