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
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000'))
    return false
  // Use midnight UTC to avoid the computer's local timezone changing the calendar day.
  const date = new Date(`${value}T00:00:00Z`)
  // Invalid dates have a NaN timestamp. Comparing the converted date with the input
  // also rejects rollover: February 30 must not silently become a day in March.
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
/** Returns errors keyed by input name; an empty object means every rule passed. */
function validateRecord(input) {
  // Callers supply string fields; the route's schema rejects missing/wrong-type values.
  // Matching error keys to form field names lets the UI show each message beside its input.
  const errors = {}
  // Both IDs use the same rule. trim() checks their meaningful length without
  // changing the supplied object; store.save() trims the values when saving them.
  for (const field of ['courseId', 'studentId']) {
    if (
      typeof input[field] !== 'string' ||
      !input[field].trim() ||
      input[field].trim().length > 50
    ) {
      errors[field] = 'Enter an ID between 1 and 50 characters.'
    }
  }
  if (!isValidDate(input.date)) errors.date = 'Enter a valid date.'
  if (typeof input.notes !== 'string' || input.notes.trim().length > 300) {
    errors.notes = 'Use 300 characters or fewer.'
  }
  return errors
}

export function validateAttendance(input) {
  const errors = validateRecord(input)
  // An allowlist rejects arbitrary values such as 'late'.
  if (!attendanceStatuses.includes(input.status)) {
    errors.status = 'Choose an attendance status.'
  }
  return errors
}

/** Participation uses a documented integer score from 0 to 5 per activity. */
export function validateParticipation(input) {
  const errors = validateRecord(input)
  if (
    typeof input.activity !== 'string' ||
    !input.activity.trim() ||
    input.activity.trim().length > 100
  ) {
    errors.activity = 'Enter an activity between 1 and 100 characters.'
  }
  const score = Number(input.score)
  const isNumberOrText = typeof input.score === 'number' || typeof input.score === 'string'
  if (
    !isNumberOrText ||
    String(input.score).trim() === '' ||
    !Number.isInteger(score) ||
    score < 0 ||
    score > 5
  ) {
    errors.score = 'Enter a whole-number score from 0 to 5.'
  }
  return errors
}
/** Checks optional history filters. Blank fields mean no restriction on that field. */
export function validateFilter(filter) {
  const errors = {}
  for (const field of ['courseId', 'studentId']) {
    if (typeof filter[field] !== 'string' || filter[field].length > 50) {
      errors[field] = 'Use 50 characters or fewer.'
    }
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
