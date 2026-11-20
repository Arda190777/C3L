/** Statistics and report views. UI responsibility: Jaspreet. */
import { escapeHtml } from '../../core/pages'
import { page, errorSummary, filterForm } from './pageLayout'

const rateExplanation =
  'Present rate = Present / recorded attendance marks, including excused and unexcused marks. Missing marks are not counted as absences. This is not a rate based on enrolled students.'

export function renderStatistics(base, statistics, filter, errors = {}) {
  let content = '<p>Resolve the error above to load statistics.</p>'
  if (Object.keys(errors).length === 0) {
    const values = [
      ['Present', statistics.present],
      ['Absent - excused', statistics.excused],
      ['Absent - unexcused', statistics.unexcused],
      ['Recorded attendance marks', statistics.totalMarks],
      ['Present rate', `${statistics.presentRate}%`],
      ['Participation entries', statistics.participationEntries],
      ['Participation points', statistics.participationPoints],
      [
        'Average participation score',
        statistics.participationEntries ? `${statistics.averageScore} / 5` : 'No entries',
      ],
    ]
    content = `${statistics.totalMarks === 0 && statistics.participationEntries === 0 ? '<p>No recorded data match these filters.</p>' : ''}
      <table><caption>Totals for the selected filters</caption><thead><tr><th scope="col">Measure</th><th scope="col">Value</th></tr></thead>
      <tbody>${values.map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`).join('')}</tbody></table>`
  }
  return page(
    base,
    'Attendance statistics',
    `${errors.storage ? errorSummary({ storage: errors.storage }) : ''}
    ${filterForm(`${base}/statistics`, filter, errors.storage ? {} : errors)}
    <section><h2>Attendance and participation totals</h2>${content}<p class="hint">${rateExplanation}</p></section>`,
  )
}

export function renderReport(base, rows, filter, errors = {}) {
  let content = '<p>Resolve the error above to load the report.</p>'
  if (Object.keys(errors).length === 0) {
    const query = new URLSearchParams(filter)
    content = `<p><a href="${base}/reports/attendance.csv?${query}">Download CSV</a></p>`
    if (rows.length === 0) {
      content += '<p>No student records match these filters.</p>'
    } else {
      content += `<div class="table-wrap"><table><caption>One row per course and student</caption><thead><tr>
        <th scope="col">Course</th><th scope="col">Student</th><th scope="col">Present</th><th scope="col">Excused</th>
        <th scope="col">Unexcused</th><th scope="col">Marks</th><th scope="col">Present rate</th>
        <th scope="col">Activities</th><th scope="col">Points</th><th scope="col">Average / 5</th></tr></thead><tbody>
        ${rows
          .map(
            (row) => `<tr><td>${escapeHtml(row.courseId)}</td><td>${escapeHtml(row.studentId)}</td>
          <td>${row.present}</td><td>${row.excused}</td><td>${row.unexcused}</td><td>${row.totalMarks}</td>
          <td>${row.presentRate}%</td><td>${row.participationEntries}</td><td>${row.participationPoints}</td>
          <td>${row.participationEntries ? row.averageScore : '-'}</td></tr>`,
          )
          .join('')}</tbody></table></div>`
    }
  }
  return page(
    base,
    'Attendance report',
    `${errors.storage ? errorSummary({ storage: errors.storage }) : ''}
    ${filterForm(`${base}/reports`, filter, errors.storage ? {} : errors)}
    <section><h2>Student summary</h2>${content}<p class="hint">${rateExplanation}</p>
    <p class="hint">Participation-only students have zero recorded marks. CSV text IDs starting with formula characters receive a leading apostrophe.</p></section>`,
  )
}
