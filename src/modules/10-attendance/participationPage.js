/** Participation entry and history. UI responsibility: Jaspreet. */
import { escapeHtml } from '../../core/pages'
import { page, errorSummary, errorAttributes, fieldError, filterForm } from './pageLayout'

export function renderParticipation(
  base,
  input,
  records,
  filter,
  errors = {},
  saved = false,
  filterErrors = {},
) {
  const values = input ?? {
    courseId: '',
    studentId: '',
    date: '',
    activity: '',
    score: '',
    notes: '',
  }
  const fields = [
    ['courseId', 'Course ID', 'text', 50],
    ['studentId', 'Student ID', 'text', 50],
    ['date', 'Participation date', 'date', 0],
    ['activity', 'Activity', 'text', 100],
    ['score', 'Score (0-5)', 'number', 0],
  ]

  let history = '<p>No participation entries match these filters.</p>'
  if (Object.keys(filterErrors).length > 0 || Object.keys(errors).length > 0) {
    history = '<p>Resolve the message above, then load participation history again.</p>'
  } else if (records.length > 0) {
    history = `<div class="table-wrap"><table><caption>${records.length} participation ${records.length === 1 ? 'entry' : 'entries'}, newest first</caption>
      <thead><tr><th scope="col">Date</th><th scope="col">Course</th><th scope="col">Student</th>
      <th scope="col">Activity</th><th scope="col">Score</th><th scope="col">Notes</th></tr></thead><tbody>
      ${records
        .map(
          (
            record,
          ) => `<tr><td>${escapeHtml(record.date)}</td><td>${escapeHtml(record.courseId)}</td>
        <td>${escapeHtml(record.studentId)}</td><td>${escapeHtml(record.activity)}</td>
        <td>${record.score} / 5</td><td>${escapeHtml(record.notes) || '-'}</td></tr>`,
        )
        .join('')}
      </tbody></table></div>`
  }

  return page(
    base,
    'Participation',
    `
    ${saved ? '<section class="success" role="status">Participation saved. An existing entry for the same activity is updated.</section>' : ''}
    ${errorSummary(errors)}
    <section><h2>Record participation</h2><form method="post" action="${base}/participation">
      <div class="grid">${fields
        .map(
          ([field, label, type, max]) => `<div>
        <label for="${field}">${label}</label><input id="${field}" name="${field}" type="${type}"
        required ${max ? `maxlength="${max}"` : ''} ${field === 'score' ? 'min="0" max="5" step="1"' : ''}
        value="${escapeHtml(String(values[field]))}" ${errorAttributes(field, errors)}>
        ${fieldError(field, errors)}</div>`,
        )
        .join('')}
        <div class="wide"><label for="notes">Notes (optional)</label><textarea id="notes" name="notes"
        maxlength="300" rows="2" ${errorAttributes('notes', errors)}>${escapeHtml(values.notes)}</textarea>${fieldError('notes', errors)}</div>
      </div><p class="hint">Use a whole-number score from 0 to 5 for each activity. Saving the same course, student, date and activity corrects its score and notes.</p>
      <button type="submit">Save participation</button></form></section>
    ${filterForm(`${base}/participation`, filter, filterErrors)}
    <section><h2>Participation history</h2>${history}</section>`,
  )
}
