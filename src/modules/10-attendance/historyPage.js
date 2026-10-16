/** @file historyPage.js
 * @brief Attendance history view. Assigned UI area: Jaspreet.
 */
import { escapeHtml } from '../../core/pages'
import { statusLabels } from './attendance'
import { page, errorSummary, fieldError, errorAttributes } from './pageLayout'
export function renderHistory(base, records, filter, errors = {}, saved = false) {
  const fields = [
    ['courseId', 'Course ID', 'text'],
    ['studentId', 'Student ID', 'text'],
    ['from', 'From date', 'date'],
    ['to', 'To date', 'date'],
  ]
  return page(
    base,
    'Attendance history',
    `
    ${saved ? '<section class="success" role="status">Attendance saved. An existing mark for the same student, course and date is updated.</section>' : ''}
    ${errorSummary(errors)}
    <section><h2>Filter records</h2><form method="get" action="${base}/history"><div class="grid">
      ${fields.map(([field, label, type]) => `<div><label for="${field}">${label}</label><input id="${field}" name="${field}" type="${type}" ${type === 'text' ? 'maxlength="50"' : ''} value="${escapeHtml(filter[field])}" ${errorAttributes(field, errors)}>${fieldError(field, errors)}</div>`).join('')}
      </div><div class="actions"><button type="submit">Apply filters</button><a href="${base}/history">Clear filters</a></div>
      <p class="hint">IDs match exactly. Date limits include both selected dates.</p></form></section>
    <section><h2>Recorded attendance</h2>${
      Object.keys(errors).length
        ? '<p>Resolve the error above to load records.</p>'
        : records.length
          ? `
      <div class="table-wrap"><table><caption>${records.length} record${records.length === 1 ? '' : 's'}, newest date first</caption>
      <thead><tr><th scope="col">Date</th><th scope="col">Course</th><th scope="col">Student</th><th scope="col">Status</th><th scope="col">Notes</th></tr></thead>
      <tbody>${records.map((record) => `<tr><td>${escapeHtml(record.date)}</td><td>${escapeHtml(record.courseId)}</td><td>${escapeHtml(record.studentId)}</td><td class="status">${statusLabels[record.status]}</td><td>${escapeHtml(record.notes) || '-'}</td></tr>`).join('')}</tbody></table></div>`
          : '<p>No attendance records match these filters. Record attendance or change the filters.</p>'
    }
      <p><a href="${base}">Record or correct attendance</a></p></section>`,
  )
}
