/** @file attendance.js
 * @brief Attendance data and validation shared by the form and JSON API.
 * These functions contain the module's input rules, without handling HTTP or SQL.
 * Both routes and storage call them so they agree on what valid attendance means.
 */
// Store these short values in the database; statusLabels supplies the readable UI text.
// Both 'excused' and 'unexcused' represent an absence, with different reasons/categories.
export const attendanceStatuses = ['present', 'excused', 'unexcused']
export const statusLabels = {
  present: 'Present',
  excused: 'Absent - excused',
  unexcused: 'Absent - unexcused',
}
/** Rejects impossible dates such as February 30 instead of allowing date rollover. */
export function isValidDate(value) {
  // First require exactly YYYY-MM-DD and a nonzero year. The regular expression
  // checks the shape; it cannot tell whether a day actually exists in that month.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false
  // Use midnight UTC to avoid the computer's local timezone changing the calendar day.
  const date = new Date(`${value}T00:00:00Z`)
  // Invalid dates have a NaN timestamp. Comparing the converted date with the input
  // also rejects rollover: February 30 must not silently become a day in March.
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
/** Returns errors keyed by input name; an empty object means every rule passed. */
export function validateAttendance(input) {
  // Callers supply string fields; the route's schema rejects missing/wrong-type values.
  // Matching error keys to form field names lets the UI show each message beside its input.
  const errors = {}
  // Both IDs use the same rule. trim() checks their meaningful length without
  // changing the supplied object; store.save() trims the values when saving them.
  for (const field of ['courseId', 'studentId']) {
    if (!input[field].trim() || input[field].trim().length > 50) {
      errors[field] = 'Enter an ID between 1 and 50 characters.'
    }
  }
  if (!isValidDate(input.date)) errors.date = 'Enter a valid date.'
  // An allowlist rejects arbitrary values such as 'late' that this sprint does not support.
  if (!attendanceStatuses.includes(input.status)) {
    errors.status = 'Choose an attendance status.'
  }
  if (input.notes.trim().length > 300) errors.notes = 'Use 300 characters or fewer.'
  return errors
}
/** Checks optional history filters. Blank fields mean no restriction on that field. */
export function validateFilter(filter) {
  const errors = {}
  for (const field of ['courseId', 'studentId']) {
    if (filter[field].length > 50) errors[field] = 'Use 50 characters or fewer.'
  }
  // Unlike the attendance date, filter dates may be omitted. Validate only supplied dates.
  for (const field of ['from', 'to']) {
    if (filter[field] && !isValidDate(filter[field])) errors[field] = 'Enter a valid date.'
  }
  // Compare the range only after both dates pass validation. Fixed-width YYYY-MM-DD
  // strings sort in calendar order, so this comparison catches a reversed date range.
  if (!errors.from && !errors.to && filter.from && filter.to && filter.from > filter.to) {
    errors.to = 'End date must be on or after the start date.'
  }
  return errors
}
