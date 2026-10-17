/** @file store.js
 * @brief Local SQLite storage using Bun's built-in database support.
 */
import { Database } from 'bun:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { validateAttendance, validateFilter } from './attendance'

// Use JavaScript field names when returning database records.
const columns = `id, course_id AS courseId, student_id AS studentId,
  attendance_date AS date, status, notes, updated_at AS updatedAt`

/** Owns the attendance table. The database is opened only when a route uses it. */
export class AttendanceStore {
  constructor(filename) {
    this.filename = filename
    this.database = null
  }

  openDatabase() {
    if (this.database !== null) {
      return this.database
    }

    // File databases need a folder. In-memory tests do not.
    if (this.filename !== ':memory:') {
      const folder = dirname(this.filename)
      mkdirSync(folder, { recursive: true })
    }

    this.database = new Database(this.filename, { create: true })
    // Wait up to five seconds if another connection is using the database.
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

    return this.database
  }

  /** Saves a mark, or corrects the existing mark for the same student/course/date. */
  save(input) {
    const errors = validateAttendance(input)
    if (Object.keys(errors).length > 0) {
      throw new Error('Invalid attendance record')
    }

    const database = this.openDatabase()
    const courseId = input.courseId.trim()
    const studentId = input.studentId.trim()
    const notes = input.notes.trim()
    const updatedAt = new Date().toISOString()

    // ON CONFLICT updates the existing mark. "excluded" means the new values.
    const sql = `INSERT INTO attendance (course_id, student_id, attendance_date, status, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(course_id, student_id, attendance_date) DO UPDATE SET
        status = excluded.status, notes = excluded.notes, updated_at = excluded.updated_at
      RETURNING ${columns}`

    const query = database.query(sql)
    // Each question mark receives a value separately from the SQL text.
    const savedRecord = query.get(courseId, studentId, input.date, input.status, notes, updatedAt)
    return savedRecord
  }

  /** Returns matching marks, newest date first. Filters use exact IDs and inclusive dates. */
  list(filter) {
    const errors = validateFilter(filter)
    if (Object.keys(errors).length > 0) {
      throw new Error('Invalid attendance filter')
    }

    const database = this.openDatabase()
    const sql = `SELECT ${columns} FROM attendance
      ORDER BY attendance_date DESC, course_id, student_id`
    const query = database.query(sql)
    const records = query.all()
    const matchingRecords = []

    // For this small local prototype, check each record against the filters.
    for (const record of records) {
      if (filter.courseId !== '' && record.courseId !== filter.courseId) {
        continue
      }
      if (filter.studentId !== '' && record.studentId !== filter.studentId) {
        continue
      }
      // YYYY-MM-DD dates can be compared in this order. Both limits are included.
      if (filter.from !== '' && record.date < filter.from) {
        continue
      }
      if (filter.to !== '' && record.date > filter.to) {
        continue
      }
      matchingRecords.push(record)
    }

    return matchingRecords
  }

  close() {
    if (this.database !== null) {
      this.database.close()
      this.database = null
    }
  }
}
