// Storage tests call AttendanceStore directly, independently of the HTTP routes.
// Most use in-memory SQLite; the final case verifies persistence with a temporary file.
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { AttendanceStore } from './store'
// Blank filter values disable all restrictions, so list(emptyFilter) reads every row.
const emptyFilter = { courseId: '', studentId: '', from: '', to: '' }
const mark = {
  courseId: 'PROG3000',
  studentId: 'S1001',
  date: '2026-10-16',
  status: 'present',
  notes: '',
}
describe('attendance storage', () => {
  let store
  // beforeEach creates an empty database for every case; afterEach releases it.
  beforeEach(() => {
    store = new AttendanceStore(':memory:')
  })
  afterEach(() => store.close())
  test('DB-01 starts with an empty history', () => {
    expect(store.list(emptyFilter)).toEqual([])
  })
  test('DB-02 saves trimmed IDs and notes', () => {
    const saved = store.save({ ...mark, courseId: ' PROG3000 ', notes: ' Class discussion ' })
    expect(saved.courseId).toBe('PROG3000')
    expect(saved.notes).toBe('Class discussion')
    expect(saved.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
  test('DB-03 corrects a mark without creating a duplicate', () => {
    // Check the row ID as well as row count and values: a correction must retain
    // the existing record's identity while replacing its status and notes.
    const first = store.save(mark)
    const corrected = store.save({ ...mark, status: 'excused', notes: 'Correction' })
    expect(corrected.id).toBe(first.id)
    expect(store.list(emptyFilter)).toHaveLength(1)
    expect(store.list(emptyFilter)[0].status).toBe('excused')
    expect(store.list(emptyFilter)[0].notes).toBe('Correction')
  })
  test('DB-04 keeps different students, courses and dates separate', () => {
    store.save(mark)
    store.save({ ...mark, studentId: 'S1002' })
    store.save({ ...mark, courseId: 'PROG4000' })
    store.save({ ...mark, date: '2026-10-17' })
    expect(store.list(emptyFilter)).toHaveLength(4)
    expect(store.list(emptyFilter)[0].date).toBe('2026-10-17')
  })
  test('DB-05 combines exact ID filters with inclusive date limits', () => {
    // Seed near-matching rows to prove that all conditions apply together.
    // A partial student ID must not match, and equal date bounds include that day.
    store.save(mark)
    store.save({ ...mark, date: '2026-10-17' })
    store.save({ ...mark, courseId: 'PROG4000' })
    store.save({ ...mark, studentId: 'S1002' })
    expect(
      store.list({
        ...emptyFilter,
        courseId: 'PROG3000',
        studentId: 'S1001',
        from: '2026-10-16',
        to: '2026-10-16',
      }),
    ).toHaveLength(1)
    expect(store.list({ ...emptyFilter, studentId: 'S100' })).toEqual([])
  })
  test('DB-06 treats SQL-looking IDs as literal data', () => {
    // Quotes and SQL-looking syntax remain part of the ID because queries bind values.
    const studentId = "S1001' OR 1=1 --"
    store.save({ ...mark, studentId })
    expect(store.list({ ...emptyFilter, studentId })[0].studentId).toBe(studentId)
    expect(store.list({ ...emptyFilter, studentId: 'S1001' })).toEqual([])
  })
  test('DB-07 rejects invalid data before it reaches SQLite', () => {
    // Passing a function to toThrow lets the assertion catch the expected exception.
    expect(() => store.save({ ...mark, status: 'bad' })).toThrow('Invalid attendance')
    expect(() => store.list({ ...emptyFilter, from: 'bad' })).toThrow('Invalid attendance filter')
    expect(store.list(emptyFilter)).toEqual([])
  })
  test('DB-08 retains records after closing and reopening a file database', () => {
    // Two store instances open the same temporary file at different times, modelling
    // a server restart. Seeing the saved row proves it was persisted, not just held in memory.
    const folder = mkdtempSync(join(tmpdir(), 'c3l-attendance-'))
    const filename = join(folder, 'attendance.sqlite')
    const first = new AttendanceStore(filename)
    const second = new AttendanceStore(filename)
    try {
      first.save(mark)
      first.close()
      expect(second.list(emptyFilter)[0].studentId).toBe('S1001')
    } finally {
      // finally releases connections and removes the test fixture even if an assertion fails.
      first.close()
      second.close()
      rmSync(folder, { recursive: true })
    }
  })
})
