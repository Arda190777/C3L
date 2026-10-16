import { describe, expect, test } from 'bun:test'
import { isValidDate, validateAttendance, validateFilter } from './attendance'
const mark = {
  courseId: 'PROG3000',
  studentId: 'S1001',
  date: '2026-10-16',
  status: 'present',
  notes: '',
}
describe('attendance validation', () => {
  test('VAL-01 accepts all three attendance statuses', () => {
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
    for (const date of ['2026-02-29', '2026-02-30', '2026-13-01', '16/10/2026', '', '0000-01-01']) {
      expect(isValidDate(date)).toBe(false)
    }
    expect(isValidDate('2028-02-29')).toBe(true)
    expect(validateAttendance({ ...mark, date: '2026-02-30' })).toHaveProperty('date')
  })
  test('VAL-04 rejects unknown status and long notes', () => {
    expect(validateAttendance({ ...mark, status: 'late' })).toHaveProperty('status')
    expect(validateAttendance({ ...mark, notes: 'x'.repeat(301) })).toHaveProperty('notes')
    expect(validateAttendance({ ...mark, notes: 'x'.repeat(300) })).toEqual({})
  })
  test('VAL-05 checks history dates and ID lengths', () => {
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
