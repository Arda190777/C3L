/** @file Attendance data and validation shared by the form and JSON API. */
export const attendanceStatuses = ['present', 'excused', 'unexcused']
export const statusLabels = {
  present: 'Present',
  excused: 'Absent - excused',
  unexcused: 'Absent - unexcused',
}
/** Rejects impossible dates such as February 30 instead of allowing date rollover. */
export function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
export function validateAttendance(input) {
  const errors = {}
  for (const field of ['courseId', 'studentId']) {
    if (!input[field].trim() || input[field].trim().length > 50) {
      errors[field] = 'Enter an ID between 1 and 50 characters.'
    }
  }
  if (!isValidDate(input.date)) errors.date = 'Enter a valid date.'
  if (!attendanceStatuses.includes(input.status)) {
    errors.status = 'Choose an attendance status.'
  }
  if (input.notes.trim().length > 300) errors.notes = 'Use 300 characters or fewer.'
  return errors
}
export function validateFilter(filter) {
  const errors = {}
  for (const field of ['courseId', 'studentId']) {
    if (filter[field].length > 50) errors[field] = 'Use 50 characters or fewer.'
  }
  for (const field of ['from', 'to']) {
    if (filter[field] && !isValidDate(filter[field])) errors[field] = 'Enter a valid date.'
  }
  if (!errors.from && !errors.to && filter.from && filter.to && filter.from > filter.to) {
    errors.to = 'End date must be on or after the start date.'
  }
  return errors
}
