/** @file store.js
 * @brief Local SQLite storage using Bun's built-in database support.
 */
import { Database } from 'bun:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { validateAttendance, validateFilter } from './attendance'
// Reuse one column list for saved and listed records. SQL AS aliases convert database
// names such as student_id into the studentId properties used by the rest of the module.
const columns = `id, course_id AS courseId, student_id AS studentId,
  attendance_date AS date, status, notes, updated_at AS updatedAt`
/** Owns the attendance table. The database is opened only when a route uses it. */
export class AttendanceStore {
  filename
  database
  // Accept a real file for persistence, or ':memory:' for an isolated test database.
  constructor(filename) {
    this.filename = filename
  }
  // A getter runs when this.db is accessed. Open/create the database once, then
  // reuse the connection, so importing the module alone does not create data files.
  get db() {
    if (!this.database) {
      // File databases need a parent directory; an in-memory database needs no folder.
      if (this.filename !== ':memory:') mkdirSync(dirname(this.filename), { recursive: true })
      this.database = new Database(this.filename, { create: true })
      // If another connection holds a lock, allow SQLite to wait up to five seconds.
      this.database.run('PRAGMA busy_timeout = 5000')
      // IF NOT EXISTS preserves saved records on later openings. UNIQUE enforces
      // one mark per course/student/date; CHECK adds a database-level status rule.
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
    // Check again at the storage boundary because callers can use the store directly,
    // without going through an HTTP route's validation.
    if (Object.keys(validateAttendance(input)).length) throw new Error('Invalid attendance record')
    // The ? placeholders bind values separately from SQL, so input is treated as data.
    // ON CONFLICT updates the existing row; excluded means the proposed replacement values.
    // RETURNING + get() returns the saved row, including its existing or newly assigned ID.
    return this.db
      .query(`INSERT INTO attendance (course_id, student_id, attendance_date, status, notes, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(course_id, student_id, attendance_date) DO UPDATE SET
           status = excluded.status, notes = excluded.notes, updated_at = excluded.updated_at
         RETURNING ${columns}`)
      .get(
        // Arguments match the six placeholders in order. Trim IDs/notes and record
        // the server's current UTC timestamp whenever a mark is created or corrected.
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
    // Each (? = '' OR column = ?) disables a condition when that filter is blank.
    // >= and <= include the boundary dates; validated YYYY-MM-DD dates sort correctly
    // as text. DESC puts the newest dates first, then IDs give a consistent tie order.
    return this.db
      .query(`SELECT ${columns} FROM attendance
         WHERE (? = '' OR course_id = ?) AND (? = '' OR student_id = ?)
           AND (? = '' OR attendance_date >= ?) AND (? = '' OR attendance_date <= ?)
         ORDER BY attendance_date DESC, course_id, student_id`)
      .all(
        // Each value appears twice: once to check whether it is blank and once for
        // the comparison. all() returns an array of matching rows, including [] for none.
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
  // Release the connection after use. ?. makes closing an unopened/already-closed
  // store safe; resetting database lets a later query open a fresh connection.
  close() {
    this.database?.close()
    this.database = undefined
  }
}
