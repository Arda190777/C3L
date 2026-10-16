/** @file formPage.js
 * @brief Attendance form view. Assigned UI area: Arda.
 */
import { escapeHtml } from '../../core/pages'
import { attendanceStatuses, statusLabels } from './attendance'
import { page, errorSummary, fieldError, errorAttributes } from './pageLayout'
export function renderForm(base, input, errors = {}) {
  const values = input ?? { courseId: '', studentId: '', date: '', status: '', notes: '' }
  return page(
    base,
    'Record attendance',
    `${errorSummary(errors)}
    <section><h2>Daily attendance</h2>
      <p>Enter a course and student ID, then choose the date and attendance status.</p>
      <form method="post" action="${base}/attendance"><div class="grid">
        <div><label for="courseId">Course ID</label><input id="courseId" name="courseId" required maxlength="50" value="${escapeHtml(values.courseId)}" ${errorAttributes('courseId', errors)}>
          <span class="hint">Example: PROG3000</span>${fieldError('courseId', errors)}</div>
        <div><label for="studentId">Student ID</label><input id="studentId" name="studentId" required maxlength="50" value="${escapeHtml(values.studentId)}" ${errorAttributes('studentId', errors)}>
          <span class="hint">Example: S1001</span>${fieldError('studentId', errors)}</div>
        <div><label for="date">Attendance date</label><input id="date" name="date" type="date" required value="${escapeHtml(values.date)}" ${errorAttributes('date', errors)}>${fieldError('date', errors)}</div>
        <div><label for="status">Status</label><select id="status" name="status" required ${errorAttributes('status', errors)}>
          <option value="">Choose a status</option>${attendanceStatuses.map((status) => `<option value="${status}" ${values.status === status ? 'selected' : ''}>${statusLabels[status]}</option>`).join('')}</select>${fieldError('status', errors)}</div>
        <div class="wide"><label for="notes">Notes (optional)</label><textarea id="notes" name="notes" rows="3" maxlength="300" ${errorAttributes('notes', errors)}>${escapeHtml(values.notes)}</textarea>
          <span class="hint">Up to 300 characters. Do not include medical or other private information.</span>${fieldError('notes', errors)}</div>
      </div><p class="hint">One mark per student, course and date. Saving the same combination again updates its status and notes.</p>
      <div class="actions"><button type="submit">Save attendance</button><a href="${base}/history">View history</a></div></form>
    </section>`,
  )
}
