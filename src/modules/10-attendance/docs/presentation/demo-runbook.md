# Demo runbook and fallback

## Before presentation

1. Open the team fork branch feature/attendance-sprint-1 and use the current candidate tag.
2. Run the server from the repository root. On this computer, if Bun is not on PATH:

```powershell
cd 'C:\Users\efece\Documents\ChatGPT\Software Dev\C3L'
& '..\.tools\bun\bun-windows-x64\bun.exe' run dev
```

3. Open http://localhost:3000/10-attendance. If already running, use the existing page.
4. Open the slide deck in presenter view so the English speaker notes are visible to the speaker.
5. Have the two PDF forms, design HTML, GitHub milestone, PR #7 and CI ready in separate tabs.
6. Rehearse once with a timer. Keep the spoken presentation/demo around 11 minutes, then questions.

## Jaspreet's screen actions and exact short lines

1. Record course DEMO101, student DEMO001, date 2026-10-20, Present, optional note Demo.
   Say: "I will record a daily attendance mark for a sample student."
2. Save. Show the success message and filtered history.
   Say: "The application saves the mark and opens the matching attendance history."
3. Return to Record attendance. Save the SAME course/student/date as Absent - excused.
   Say: "Saving the same daily key corrects the record. Only one matching record remains."
4. Add DEMO002 for DEMO101 on 2026-10-20 as Absent - unexcused.
5. Open history, click Clear filters, enter course DEMO101 and apply to show both students.
   Say: "Excused and unexcused absences are displayed separately."
6. Add student DEMO001 to the filter and apply.
   Say: "We can narrow the history to one student in a course."
7. Change the student filter to MISSING and apply.
   Say: "When no records match, the page explains that the result is empty."
8. Set From 2026-10-21 and To 2026-10-20, then apply.
   Say: "The application rejects an end date before the start date."
9. Clear filters before handing over.
   Say: "Gera will now explain the storage and validation design."

These fictional IDs may already exist from rehearsal. Re-saving them updates their marks safely.
Use the course filter when comparing records so unrelated local data does not confuse the demo.

## Evidence and fallback

- A running live demo is the first choice. If the browser/server fails, explain the failure,
  show the saved screenshots and test output, and identify what could not be demonstrated live.
- Screenshots are prepared evidence, not a live interaction. Do not describe them as a live demo.
- The database persistence test already closes and reopens a temporary database. A live restart
  is optional; do not use it if it would consume the available time.
- Required pending items: actual review, shared SRS mapping/update and final school submission.
- If code changes, rerun tests and update the release candidate documents/tag.
