/** @file pageLayout.js
 * @brief Shared page layout and accessible validation messages.
 */
import { escapeHtml } from '../../core/pages'
/**
 * Wraps either view in the same HTML document, navigation and CSS. base is the
 * module's URL prefix; title is plain text; content is HTML prepared by a view.
 * Escape the title, but keep content as markup so its forms and tables render.
 */
export function page(base, title, content) {
  // The template literal below is the actual page output. CSS variables share colours,
  // the media query changes the form to one column on small screens, and table-wrap
  // lets wide tables scroll. :focus-visible provides an outline for keyboard navigation.
  return `<!doctype html>
  <html lang="en"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="data:,">
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
      :focus-visible, input[type="date"]:focus-within { outline: 3px solid #b45309; outline-offset: 3px; }
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
      <a href="${base}">Record attendance</a><a href="${base}/history">Attendance history</a>
      <a href="${base}/participation">Participation</a><a href="${base}/statistics">Statistics</a>
      <a href="${base}/reports">Reports</a></nav>
    <p class="eyebrow">C3L / Module 10</p><h1>${escapeHtml(title)}</h1>
    <p class="intro">Attendance &amp; Participation Tracking</p>
    <aside class="notice">Local classroom prototype. Use fictional IDs only. Sign-in, role and course roster enforcement still require integration.</aside>
    ${content}
    <footer>Sprint 3: attendance, participation, statistics and reports. <a href="${base}/openapi.json">API specification</a></footer>
  </main></body></html>`
}
/** Collects all validation/storage messages in one summary above the page content. */
export function errorSummary(errors) {
  // No errors means no summary markup. Object.entries supplies [field, message] pairs;
  // map() builds list items and join('') combines them without inserting commas.
  if (!Object.keys(errors).length) return ''
  // role="alert" helps assistive technology announce errors. Field errors link to
  // their inputs; 'storage' has no input to focus, so it is displayed without a link.
  return `<section class="errors" role="alert"><h2>Please check the following</h2><ul>${Object.entries(
    errors,
  )
    .map(
      ([field, error]) =>
        `<li>${field === 'storage' ? escapeHtml(error) : `<a href="#${field}">${escapeHtml(error)}</a>`}</li>`,
    )
    .join('')}</ul></section>`
}
// The generated ID matches aria-describedby below, connecting a field to its message.
// Escape messages so HTML-like text is displayed as text rather than interpreted as markup.
export function fieldError(field, errors) {
  return errors[field]
    ? `<span class="error" id="${field}-error">${escapeHtml(errors[field])}</span>`
    : ''
}
// aria-invalid flags the field; aria-describedby identifies its explanatory error text.
// Returning '' when valid lets the views insert this helper directly into an input tag.
export function errorAttributes(field, errors) {
  return errors[field] ? `aria-invalid="true" aria-describedby="${field}-error"` : ''
}

/** A separate ID prefix avoids collisions with participation entry fields. */
export function filterForm(path, filter, errors = {}) {
  const fields = [
    ['courseId', 'Course ID', 'text'],
    ['studentId', 'Student ID', 'text'],
    ['from', 'From date', 'date'],
    ['to', 'To date', 'date'],
  ]
  const messages = {}
  for (const field of Object.keys(errors)) messages[`filter-${field}`] = errors[field]
  return `${errorSummary(messages)}<section><h2>Filter records</h2>
    <form method="get" action="${path}"><div class="grid">
    ${fields
      .map(([field, label, type]) => {
        const id = `filter-${field}`
        return `<div><label for="${id}">${label}</label><input id="${id}" name="${field}" type="${type}"
        ${type === 'text' ? 'maxlength="50"' : ''} value="${escapeHtml(filter[field])}"
        ${errorAttributes(id, messages)}>${fieldError(id, messages)}</div>`
      })
      .join('')}
    </div><div class="actions"><button type="submit">Apply filters</button><a href="${path}">Clear filters</a></div>
    <p class="hint">IDs match exactly. Both date limits are included.</p></form></section>`
}
