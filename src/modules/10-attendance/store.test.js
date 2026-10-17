import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { AttendanceStore } from './store'

describe('attendance storage', () => {
  let store
  let mark
  let filter
  let temporaryFolder

  beforeEach(() => {
    // Start each test with its own empty database and sample values.
    store = new AttendanceStore(':memory:')
    temporaryFolder = null
    mark = {
      courseId: 'PROG3000',
      studentId: 'S1001',
      date: '2026-10-16',
      status: 'present',
      notes: '',
    }
    filter = {
      courseId: '',
      studentId: '',
      from: '',
      to: '',
    }
  })

  afterEach(() => {
    store.close()
    if (temporaryFolder !== null) {
      rmSync(temporaryFolder, { recursive: true })
    }
  })

  test('DB-01 starts with an empty history', () => {
    const records = store.list(filter)
    expect(records).toEqual([])
  })

  test('DB-02 saves trimmed IDs and notes', () => {
    mark.courseId = ' PROG3000 '
    mark.studentId = ' S1001 '
    mark.notes = ' Class discussion '

    const saved = store.save(mark)

    expect(saved.courseId).toBe('PROG3000')
    expect(saved.studentId).toBe('S1001')
    expect(saved.notes).toBe('Class discussion')
    expect(saved.updatedAt.length).toBe(24)
    expect(saved.updatedAt.endsWith('Z')).toBe(true)
  })

  test('DB-03 corrects a mark without creating a duplicate', () => {
    const first = store.save(mark)

    mark.status = 'excused'
    mark.notes = 'Correction'
    const corrected = store.save(mark)
    const records = store.list(filter)

    expect(corrected.id).toBe(first.id)
    expect(records.length).toBe(1)
    expect(records[0].status).toBe('excused')
    expect(records[0].notes).toBe('Correction')
  })

  test('DB-04 keeps different students, courses and dates separate', () => {
    store.save(mark)

    mark.studentId = 'S1002'
    store.save(mark)

    mark.studentId = 'S1001'
    mark.courseId = 'PROG4000'
    store.save(mark)

    mark.courseId = 'PROG3000'
    mark.date = '2026-10-17'
    store.save(mark)

    const records = store.list(filter)
    expect(records.length).toBe(4)
    expect(records[0].date).toBe('2026-10-17')
  })

  test('DB-05 combines exact ID filters with inclusive date limits', () => {
    store.save(mark)

    mark.date = '2026-10-17'
    store.save(mark)

    mark.date = '2026-10-15'
    store.save(mark)

    mark.date = '2026-10-16'
    mark.courseId = 'PROG4000'
    store.save(mark)

    mark.courseId = 'PROG3000'
    mark.studentId = 'S1002'
    store.save(mark)

    filter.courseId = 'PROG3000'
    filter.studentId = 'S1001'
    filter.from = '2026-10-16'
    filter.to = '2026-10-16'
    const records = store.list(filter)

    expect(records.length).toBe(1)
    expect(records[0].date).toBe('2026-10-16')

    // A partial student ID should not match S1001.
    filter.studentId = 'S100'
    const partialMatches = store.list(filter)
    expect(partialMatches).toEqual([])
  })

  test('DB-06 treats SQL-looking IDs as literal data', () => {
    mark.studentId = "S1001' OR 1=1 --"
    store.save(mark)

    filter.studentId = mark.studentId
    const records = store.list(filter)
    expect(records[0].studentId).toBe(mark.studentId)

    filter.studentId = 'S1001'
    const otherRecords = store.list(filter)
    expect(otherRecords).toEqual([])
  })

  test('DB-07 rejects invalid data before it reaches SQLite', () => {
    mark.status = 'bad'
    expect(() => store.save(mark)).toThrow('Invalid attendance')

    filter.from = 'bad'
    expect(() => store.list(filter)).toThrow('Invalid attendance filter')

    filter.from = ''
    const records = store.list(filter)
    expect(records).toEqual([])
  })

  test('DB-08 retains records after closing and reopening a file database', () => {
    // Use a temporary file, never the application's attendance database.
    temporaryFolder = mkdtempSync(join(tmpdir(), 'c3l-attendance-'))
    const filename = join(temporaryFolder, 'attendance.sqlite')

    store.close()
    store = new AttendanceStore(filename)
    store.save(mark)
    store.close()

    store = new AttendanceStore(filename)
    const records = store.list(filter)
    expect(records[0].studentId).toBe('S1001')
  })
})
