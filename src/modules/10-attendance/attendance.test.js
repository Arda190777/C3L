// Unit tests exercise validation without routes or a database. describe() groups cases,
// test() defines a case, and expect() checks its result. VAL IDs match the test plan.
import { describe, expect, test } from 'bun:test'
import {
  isValidDate,
  validateAttendance,
  validateFilter,
  validateParticipation,
} from './attendance'
// Reuse one valid example. {...mark, field: value} changes only the field under test,
// leaving the original example intact so tests do not affect each other's input.
const mark = {
  courseId: 'PROG3000',
  studentId: 'S1001',
  date: '2026-10-16',
  status: 'present',
  notes: '',
}

test('PART-01 allows integer participation scores from zero to five', () => {
  const input = { ...mark, activity: 'Discussion', score: 0 }
  expect(validateParticipation(input)).toEqual({})
  input.score = '5'
  expect(validateParticipation(input)).toEqual({})
  for (const score of ['', ' ', -1, 6, 1.5, 'abc', null, true]) {
    input.score = score
    expect(validateParticipation(input)).toHaveProperty('score')
  }
})

test('PART-02 checks activity, date, ID and notes limits', () => {
  const input = { ...mark, activity: '', score: 3 }
  expect(validateParticipation(input)).toHaveProperty('activity')
  input.activity = 'x'.repeat(101)
  expect(validateParticipation(input)).toHaveProperty('activity')
  input.activity = 'Discussion'
  input.date = '2026-02-30'
  input.studentId = ' '
  input.notes = 'x'.repeat(301)
  const errors = validateParticipation(input)
  expect(errors).toHaveProperty('date')
  expect(errors).toHaveProperty('studentId')
  expect(errors).toHaveProperty('notes')
})

test('PART-03 wrong-type IDs, dates and filters return validation errors', () => {
  expect(
    validateParticipation({ ...mark, courseId: 123, activity: 'Discussion', score: 3 }),
  ).toHaveProperty('courseId')
  expect(isValidDate(null)).toBe(false)
  expect(validateFilter({ courseId: [], studentId: '', from: '', to: '' })).toHaveProperty(
    'courseId',
  )
})
describe('attendance validation', () => {
  test('VAL-01 accepts all three attendance statuses', () => {
    // toEqual({}) checks that validation returns no field errors for each allowed status.
    for (const status of ['present', 'excused', 'unexcused']) {
      expect(validateAttendance({ ...mark, status })).toEqual({})
    }
  })
  test('VAL-02 rejects blank and oversized IDs', () => {
    expect(
      validateAttendance({ ...mark, courseId: '   ', studentId: 'x'.repeat(51) }),
    ).toHaveProperty('courseId')
    expect(validateAttendance({ ...mark, studentId: '' })).toHaveProperty('studentId')
    expect(validateAttendance({ ...mark, courseId: 'x'.repeat(51) })).toHaveProperty('courseId')
  })
  test('VAL-03 rejects impossible dates and accepts leap days', () => {
    // Cover calendar rules as well as formatting: a correctly shaped date can still
    // be impossible. 2028 is a leap year, while 2026 is not.
    for (const date of ['2026-02-29', '2026-02-30', '2026-13-01', '16/10/2026', '', '0000-01-01']) {
      expect(isValidDate(date)).toBe(false)
    }
    expect(isValidDate('2028-02-29')).toBe(true)
    expect(validateAttendance({ ...mark, date: '2026-02-30' })).toHaveProperty('date')
  })
  test('VAL-04 rejects unknown status and long notes', () => {
    // Test both sides of the notes boundary: 300 characters pass, 301 fail.
    expect(validateAttendance({ ...mark, status: 'late' })).toHaveProperty('status')
    expect(validateAttendance({ ...mark, notes: 'x'.repeat(301) })).toHaveProperty('notes')
    expect(validateAttendance({ ...mark, notes: 'x'.repeat(300) })).toEqual({})
  })
  test('VAL-05 checks history dates and ID lengths', () => {
    // Empty filters are allowed, but supplied dates/IDs still have rules; a valid
    // pair of dates also needs the start to be no later than the end.
    expect(validateFilter({ courseId: '', studentId: '', from: '', to: '' })).toEqual({})
    expect(validateFilter({ courseId: '', studentId: '', from: 'bad', to: '' })).toHaveProperty(
      'from',
    )
    expect(
      validateFilter({ courseId: '', studentId: '', from: '2026-10-17', to: '2026-10-16' }),
    ).toHaveProperty('to')
    expect(
      validateFilter({ courseId: 'x'.repeat(51), studentId: '', from: '', to: '' }),
    ).toHaveProperty('courseId')
  })
})
