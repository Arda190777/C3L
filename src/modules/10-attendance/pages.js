/** @file pages.js
 * @brief Server-rendered attendance pages with escaped submitted text.
 */
import { escapeHtml } from '../../core/pages'
import { attendanceStatuses, statusLabels } from './attendance'
function page(base, title, content) {
  return `<!doctype html>
  <html lang="en"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | C3L Attendance</title>
    <style>
      :root { --ink: #1e293b; --muted: #475569; --primary: #1d4ed8; --border: #cbd5e1; }
      * { box-sizing: border-box; }
      body { margin: 0; color: var(--ink); background: #f8fafc; font: 16px/1.6 system-ui, sans-serif; }
      main { max-width: 1050px; margin: auto; padding: 24px; }
      nav { display: flex; gap: 24px; flex-wrap: wrap; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
      a { color: var(--primary); text-underline-offset: 3px; }
      nav a { padding: 8px 0; }
      a:hover { text-decoration-thickness: 2px; }
      h1 { line-height: 1.2; margin-bottom: 8px; font-size: 2rem; }
      h2 { font-size: 1.1rem; margin-top: 0; }
      .eyebrow { margin: 28px 0 8px; color: var(--muted); font-size: .85rem; letter-spacing: .08em; text-transform: uppercase; }
      .intro { color: var(--muted); margin-top: 0; }
      .notice { background: #eff6ff; border-left: 4px solid var(--primary); padding: 12px 16px; margin: 24px 0; }
      section { background: white; border: 1px solid var(--border); border-radius: 8px; padding: 24px; margin: 24px 0; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      label { display: block; font-weight: 600; margin-bottom: 6px; }
      input, select, textarea, button { font: inherit; }
      input, select, textarea { display: block; width: 100%; min-height: 44px; border: 1px solid #64748b; border-radius: 4px; padding: 8px 12px; background: white; color: var(--ink); }
      textarea { resize: vertical; }
      button { min-height: 44px; border: 0; border-radius: 4px; background: var(--primary); color: white; padding: 10px 22px; cursor: pointer; }
      button:hover { background: #1e40af; }
      :focus-visible { outline: 3px solid #b45309; outline-offset: 3px; }
      .wide { grid-column: 1 / -1; }
      .hint { display: block; color: var(--muted); font-size: .9rem; margin-top: 6px; }
      .error { color: #991b1b; display: block; margin-top: 6px; }
      [aria-invalid="true"] { border: 2px solid #991b1b; }
      .errors { border-color: #991b1b; background: #fff7f7; }
      .success { background: #f0fdf4; border-color: #166534; }
      .actions { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-top: 20px; }
      .table-wrap { overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; text-align: left; }
      caption { text-align: left; font-weight: 600; padding-bottom: 12px; }
      th, td { padding: 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
      th { background: #f1f5f9; }
      td { overflow-wrap: anywhere; }
      .status { font-weight: 600; white-space: nowrap; }
      footer { color: var(--muted); font-size: .9rem; margin: 28px 0; }
      @media (max-width: 600px) { main { padding: 16px; } section { padding: 16px; } .grid { grid-template-columns: 1fr; } }
    </style>
  </head><body><main>
    <nav aria-label="Main navigation"><a href="/">All modules</a>
      <a href="${base}">Record attendance</a><a href="${base}/history">Attendance history</a></nav>
    <p class="eyebrow">C3L / Module 10</p><h1>${escapeHtml(title)}</h1>
    <p class="intro">Attendance &amp; Participation Tracking</p>
    <aside class="notice">Local Sprint 1 prototype. Use sample IDs only. Sign-in and course rosters are planned for integration.</aside>
    ${content}
    <footer>Sprint 1: daily attendance, absence types and history.</footer>
  </main></body></html>`
}
function errorSummary(errors) {
  if (!Object.keys(errors).length) return ''
  return `<section class="errors" role="alert"><h2>Please check the following</h2><ul>${Object.entries(
    errors,
  )
    .map(
      ([field, error]) =>
        `<li>${field === 'storage' ? escapeHtml(error) : `<a href="#${field}">${escapeHtml(error)}</a>`}</li>`,
    )
    .join('')}</ul></section>`
}
function fieldError(field, errors) {
  return errors[field]
    ? `<span class="error" id="${field}-error">${escapeHtml(errors[field])}</span>`
    : ''
}
function errorAttributes(field, errors) {
  return errors[field] ? `aria-invalid="true" aria-describedby="${field}-error"` : ''
}
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
