/** @file formPage.js
 * @brief Attendance form view. Assigned UI area: Arda.
 */
import { escapeHtml } from '../../core/pages'
import { attendanceStatuses, statusLabels } from './attendance'
import { page, errorSummary, fieldError, errorAttributes } from './pageLayout'
/**
 * Builds the form's HTML; saving and validation happen in router.js/store.js.
 * input contains previous values after a failed submission. errors defaults to an
 * empty object, so the initial page has no validation messages.
 */
export function renderForm(base, input, errors = {}) {
  // ?? supplies blank fields on the first visit and preserves submitted values on errors.
  const values = input ?? { courseId: '', studentId: '', date: '', status: '', notes: '' }
  // page() adds the shared document around this form. Each label's for matches an
  // input ID; each name becomes a submitted field used by the route's request schema.
  // method="post" sends values to the save route, with base keeping the module prefix.
  // escapeHtml protects redisplayed values. The error helpers add field messages and ARIA
  // links; HTML required/maxlength checks supplement the server's own validation.
  // attendanceStatuses.map builds the dropdown options; selected preserves the choice,
  // and join('') merges the option strings without commas.
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
