# Questions and short English answers

| Question | Who | Short answer |
| --- | --- | --- |
| What does Module 10 do? | Arda | It records attendance, distinguishes absence types and lets staff review history. Participation and reporting are later scope. |
| What is your code area? | Arda | My assigned area is the attendance form: labels, status options, notes and visible validation feedback. |
| What does the history page do? | Jaspreet | It displays backend records, filter controls, an empty state and a clear-filter link. |
| Why SQLite? | Gera | Bun includes SQLite support. A local file gives the prototype persistence without adding a database package or server. |
| How are duplicates prevented? | Gera | A unique key combines course ID, student ID and date. A repeated key updates status and notes. |
| How do you validate data? | Gera | The server checks trimmed ID lengths, real dates, allowed statuses and notes length before saving. |
| How do filters work? | Nasir | IDs match exactly. Both date limits are inclusive. Results are newest date first. |
| How was it tested? | Nasir | Prepared evidence shows 25 module tests, 81 full-repository tests and 12 module sanity checks passing. |
| What does the API return? | Nasir | JSON success is 200, invalid fields are 422 and storage failure is 503. The HTML save redirects with 303. |
| Is login integrated? | Gera or Nasir | No. Identity, roles and enrollment validation remain open. We use fictional IDs locally. |
| Was the shared SRS updated? | Nasir | A local proposal is prepared. The actual shared update is pending until its link and official IDs are available. |
| How did the team collaborate? | All | Show actual assigned issues, commits and review evidence. State which reviews are still pending. Each person explains their real completed contribution. |
| What is next? | Arda | The Sprint 2 proposal is to agree identity/course contracts and participation rules. Reports/statistics stay in the backlog. |

If a class SRS update or review is completed before presentation, replace the pending answer with
the actual link/status. Do not read an outdated pending statement after the work has been verified.
