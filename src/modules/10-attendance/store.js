/** @file Local SQLite storage; no extra database package is required by Bun. */
import { Database } from 'bun:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { validateAttendance, validateFilter } from './attendance'
const columns = `id, course_id AS courseId, student_id AS studentId,
  attendance_date AS date, status, notes, updated_at AS updatedAt`
/** Owns the attendance table. The database is opened only when a route uses it. */
export class AttendanceStore {
  filename
  database
  constructor(filename) {
    this.filename = filename
  }
  get db() {
    if (!this.database) {
      if (this.filename !== ':memory:') mkdirSync(dirname(this.filename), { recursive: true })
      this.database = new Database(this.filename, { create: true })
      this.database.run('PRAGMA busy_timeout = 5000')
      this.database.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY,
        course_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        attendance_date TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('present', 'excused', 'unexcused')),
        notes TEXT NOT NULL DEFAULT '',
        updated_at TEXT NOT NULL,
        UNIQUE(course_id, student_id, attendance_date)
      )`)
    }
    return this.database
  }
  /** Saves a mark, or corrects the existing mark for the same student/course/date. */
  save(input) {
    if (Object.keys(validateAttendance(input)).length) throw new Error('Invalid attendance record')
    return this.db
      .query(`INSERT INTO attendance (course_id, student_id, attendance_date, status, notes, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(course_id, student_id, attendance_date) DO UPDATE SET
           status = excluded.status, notes = excluded.notes, updated_at = excluded.updated_at
         RETURNING ${columns}`)
      .get(
        input.courseId.trim(),
        input.studentId.trim(),
        input.date,
        input.status,
        input.notes.trim(),
        new Date().toISOString(),
      )
  }
  /** Returns matching marks, newest date first. Filters use exact IDs and inclusive dates. */
  list(filter) {
    if (Object.keys(validateFilter(filter)).length) throw new Error('Invalid attendance filter')
    return this.db
      .query(`SELECT ${columns} FROM attendance
         WHERE (? = '' OR course_id = ?) AND (? = '' OR student_id = ?)
           AND (? = '' OR attendance_date >= ?) AND (? = '' OR attendance_date <= ?)
         ORDER BY attendance_date DESC, course_id, student_id`)
      .all(
        filter.courseId,
        filter.courseId,
        filter.studentId,
        filter.studentId,
        filter.from,
        filter.from,
        filter.to,
        filter.to,
      )
  }
  close() {
    this.database?.close()
    this.database = undefined
  }
}
