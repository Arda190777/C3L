import { afterEach, beforeEach, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Database } from 'bun:sqlite'
import { AttendanceStore } from './store'

let store
let mark
let filter
let temporaryFolder
let participation

// Give each test a new database and the same starting values.
beforeEach(() => {
  store = new AttendanceStore(':memory:')
  temporaryFolder = null
  mark = {
    courseId: 'PROG3000',
    studentId: 'S1001',
    date: '2026-10-16',
    status: 'present',
    notes: '',
  }
  filter = { courseId: '', studentId: '', from: '', to: '' }
  participation = {
    courseId: 'PROG3000',
    studentId: 'S1001',
    date: '2026-10-16',
    activity: 'Class discussion',
    score: 4,
    notes: '',
  }
})

afterEach(() => {
  store.close()
  if (temporaryFolder !== null) {
    rmSync(temporaryFolder, { recursive: true })
  }
})

test('DB-01 new database has no records', () => {
  const records = store.list(filter)
  expect(records.length).toBe(0)
})

test('DB-02 saves a record and removes extra spaces', () => {
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

test('DB-03 saving the same mark updates it', () => {
  const first = store.save(mark)

  mark.status = 'excused'
  mark.notes = 'Correction'
  const updated = store.save(mark)
  const records = store.list(filter)

  expect(records.length).toBe(1)
  expect(updated.id).toBe(first.id)
  expect(records[0].status).toBe('excused')
  expect(records[0].notes).toBe('Correction')
})

test('DB-04 different students, courses and dates create separate records', () => {
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

test('DB-05a course filter finds the selected course', () => {
  store.save(mark)
  mark.courseId = 'PROG4000'
  store.save(mark)

  filter.courseId = 'PROG3000'
  const records = store.list(filter)

  expect(records.length).toBe(1)
  expect(records[0].courseId).toBe('PROG3000')
})

test('DB-05b student filter needs the complete student ID', () => {
  store.save(mark)
  mark.studentId = 'S1002'
  store.save(mark)

  filter.studentId = 'S1001'
  const records = store.list(filter)
  expect(records.length).toBe(1)
  expect(records[0].studentId).toBe('S1001')

  filter.studentId = 'S100'
  const partialMatches = store.list(filter)
  expect(partialMatches.length).toBe(0)
})

test('DB-05c date filter includes the selected day', () => {
  store.save(mark)
  mark.date = '2026-10-15'
  store.save(mark)
  mark.date = '2026-10-17'
  store.save(mark)

  filter.from = '2026-10-16'
  filter.to = '2026-10-16'
  const records = store.list(filter)

  expect(records.length).toBe(1)
  expect(records[0].date).toBe('2026-10-16')
})

test('DB-06 SQL-looking text stays part of the student ID', () => {
  mark.studentId = "S1001' OR 1=1 --"
  store.save(mark)

  filter.studentId = mark.studentId
  const records = store.list(filter)
  expect(records[0].studentId).toBe(mark.studentId)

  filter.studentId = 'S1001'
  const otherRecords = store.list(filter)
  expect(otherRecords.length).toBe(0)
})

test('DB-07 invalid input gives an error', () => {
  mark.status = 'bad'
  expect(() => store.save(mark)).toThrow('Invalid attendance record')

  filter.from = 'bad'
  expect(() => store.list(filter)).toThrow('Invalid attendance filter')

  filter.from = ''
  const records = store.list(filter)
  expect(records.length).toBe(0)
})

test('DB-08 file database keeps records after reopening', () => {
  // This file is temporary. The application's real database is not used.
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

test('DB-09 counts statuses for one course after a correction', () => {
  store.save(mark)
  store.save({ ...mark, studentId: 'S1002' })
  store.save({ ...mark, studentId: 'S1003', status: 'excused' })
  store.save({ ...mark, courseId: 'PROG4000', status: 'unexcused' })

  expect(store.countByStatus(mark.courseId)).toEqual({ present: 2, excused: 1, unexcused: 0 })

  store.save({ ...mark, status: 'unexcused' })

  expect(store.countByStatus(mark.courseId)).toEqual({ present: 1, excused: 1, unexcused: 1 })
})

test('DB-10 course counts handle empty courses, whitespace and invalid IDs', () => {
  expect(store.countByStatus('UNKNOWN')).toEqual({ present: 0, excused: 0, unexcused: 0 })
  store.save(mark)
  expect(store.countByStatus(' PROG3000 ')).toEqual({ present: 1, excused: 0, unexcused: 0 })
  expect(() => store.countByStatus(' ')).toThrow('Invalid course ID')
  expect(() => store.countByStatus('x'.repeat(51))).toThrow('Invalid course ID')
})

test('DB-11 saves participation with trimmed values and a numeric score', () => {
  participation.studentId = ' S1001 '
  participation.activity = ' Class discussion '
  participation.score = '4'
  const saved = store.saveParticipation(participation)
  expect(saved.studentId).toBe('S1001')
  expect(saved.activity).toBe('Class discussion')
  expect(saved.score).toBe(4)
})

test('DB-12 corrects the same activity but keeps different activities separate', () => {
  const first = store.saveParticipation(participation)
  participation.score = 2
  const corrected = store.saveParticipation(participation)
  expect(corrected.id).toBe(first.id)

  participation.activity = 'Group exercise'
  store.saveParticipation(participation)
  const records = store.listParticipation(filter)
  expect(records.length).toBe(2)
  expect(records.find((record) => record.activity === 'Class discussion').score).toBe(2)
})

test('DB-13 filters participation by course, student and inclusive dates', () => {
  store.saveParticipation(participation)
  participation.date = '2026-10-17'
  store.saveParticipation(participation)
  participation.date = '2026-10-15'
  store.saveParticipation(participation)
  participation.date = '2026-10-16'
  participation.courseId = 'OTHER'
  store.saveParticipation(participation)
  participation.courseId = 'PROG3000'
  participation.studentId = 'S1002'
  store.saveParticipation(participation)

  filter.courseId = 'PROG3000'
  filter.studentId = 'S1001'
  filter.from = '2026-10-16'
  filter.to = '2026-10-16'
  const records = store.listParticipation(filter)
  expect(records.length).toBe(1)
  expect(records[0].studentId).toBe('S1001')
  expect(records[0].date).toBe('2026-10-16')
})

test('DB-14 reports combine attendance and participation without inventing absences', () => {
  store.save(mark)
  mark.date = '2026-10-17'
  mark.status = 'excused'
  store.save(mark)
  store.saveParticipation(participation)
  participation.studentId = 'S1002'
  participation.score = 0
  store.saveParticipation(participation)
  mark.courseId = 'OTHER'
  store.save(mark)

  filter.courseId = 'PROG3000'
  const rows = store.getReport(filter)
  const firstStudent = rows.find((row) => row.studentId === 'S1001')
  const participationOnly = rows.find((row) => row.studentId === 'S1002')
  expect(rows.length).toBe(2)
  expect(firstStudent.totalMarks).toBe(2)
  expect(firstStudent.presentRate).toBe(50)
  expect(firstStudent.participationPoints).toBe(4)
  expect(participationOnly.totalMarks).toBe(0)
  expect(participationOnly.unexcused).toBe(0)

  const statistics = store.getStatistics(filter)
  expect(statistics.totalMarks).toBe(2)
  expect(statistics.present).toBe(1)
  expect(statistics.excused).toBe(1)
  expect(statistics.presentRate).toBe(50)
  expect(statistics.participationEntries).toBe(2)
  expect(statistics.averageScore).toBe(2)

  filter.from = '2026-10-17'
  const dated = store.getStatistics(filter)
  expect(dated.totalMarks).toBe(1)
  expect(dated.participationEntries).toBe(0)
})

test('DB-15 empty summaries return zero and invalid participation is not saved', () => {
  const statistics = store.getStatistics(filter)
  expect(statistics.totalMarks).toBe(0)
  expect(statistics.presentRate).toBe(0)
  expect(statistics.averageScore).toBe(0)
  expect(store.getReport(filter)).toEqual([])

  participation.score = ''
  expect(() => store.saveParticipation(participation)).toThrow('Invalid participation record')
  participation.score = 6
  expect(() => store.saveParticipation(participation)).toThrow('Invalid participation record')
  participation.score = 2.5
  expect(() => store.saveParticipation(participation)).toThrow('Invalid participation record')
  participation.score = 3
  participation.activity = ' '
  expect(() => store.saveParticipation(participation)).toThrow('Invalid participation record')
  expect(store.listParticipation(filter)).toEqual([])
})

test('DB-16 upgrades an old file without losing attendance and persists participation', () => {
  temporaryFolder = mkdtempSync(join(tmpdir(), 'c3l-attendance-'))
  const filename = join(temporaryFolder, 'attendance.sqlite')
  const oldDatabase = new Database(filename, { create: true })
  oldDatabase.run(`CREATE TABLE attendance (
    id INTEGER PRIMARY KEY, course_id TEXT NOT NULL, student_id TEXT NOT NULL,
    attendance_date TEXT NOT NULL, status TEXT NOT NULL, notes TEXT NOT NULL,
    updated_at TEXT NOT NULL, UNIQUE(course_id, student_id, attendance_date))`)
  oldDatabase
    .query('INSERT INTO attendance VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(42, 'PROG3000', 'S1001', '2026-10-16', 'present', '', '2026-10-16T00:00:00Z')
  oldDatabase.close()

  store.close()
  store = new AttendanceStore(filename)
  expect(store.list(filter)[0].id).toBe(42)
  store.saveParticipation(participation)
  store.close()

  store = new AttendanceStore(filename)
  expect(store.listParticipation(filter)[0].score).toBe(4)
  expect(store.list(filter)[0].id).toBe(42)
  expect(store.openDatabase().query('PRAGMA user_version').get().user_version).toBe(2)
})

test('DB-17 refuses a newer database version instead of downgrading it', () => {
  temporaryFolder = mkdtempSync(join(tmpdir(), 'c3l-attendance-'))
  const filename = join(temporaryFolder, 'attendance.sqlite')
  const newerDatabase = new Database(filename, { create: true })
  newerDatabase.run('PRAGMA user_version = 99')
  newerDatabase.close()
  store.close()
  store = new AttendanceStore(filename)
  expect(() => store.list(filter)).toThrow('newer')
  expect(() => store.list(filter)).toThrow('newer')
})
