/** @file store.js
 * @brief Local SQLite storage using Bun's built-in database support.
 */
import { Database } from 'bun:sqlite'
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { validateAttendance, validateFilter, validateParticipation } from './attendance'

// Reuse the same columns for saved and listed records. SQL AS changes names
// such as student_id into the studentId properties used by the pages.
const columns = `id, course_id AS courseId, student_id AS studentId,
  attendance_date AS date, status, notes, updated_at AS updatedAt`
const participationColumns = `id, course_id AS courseId, student_id AS studentId,
  participation_date AS date, activity, score, notes, updated_at AS updatedAt`

/** Owns the attendance table. The database is opened only when a route uses it. */
export class AttendanceStore {
  // Use a file for saved data, or ':memory:' for an isolated test database.
  constructor(filename) {
    this.filename = filename
    this.database = null
  }

  // Open once and reuse the connection. Importing the module creates no data files.
  openDatabase() {
    if (this.database !== null) {
      return this.database
    }

    // File databases need a folder. In-memory tests do not.
    if (this.filename !== ':memory:') {
      const folder = dirname(this.filename)
      mkdirSync(folder, { recursive: true })
    }

    const database = new Database(this.filename, { create: true })
    try {
      database.run('PRAGMA busy_timeout = 5000')
      const version = database.query('PRAGMA user_version').get().user_version
      if (version > 2) throw new Error('Database schema is newer than this module.')
      const schema = readFileSync(join(import.meta.dir, 'schema.sql'), 'utf8')
      // Create both tables and set the version together. No existing rows are removed.
      const migrate = database.transaction(() => database.exec(schema))
      migrate()
      this.database = database
    } catch (error) {
      database.close()
      throw error
    }
    return this.database
  }

  /** Saves a mark, or corrects the existing mark for the same student/course/date. */
  save(input) {
    // Validate here too, because tests and other callers can use the store directly.
    const errors = validateAttendance(input)
    if (Object.keys(errors).length > 0) {
      throw new Error('Invalid attendance record')
    }

    const database = this.openDatabase()
    const courseId = input.courseId.trim()
    const studentId = input.studentId.trim()
    const notes = input.notes.trim()
    // Store the server's current UTC time.
    const updatedAt = new Date().toISOString()

    // ON CONFLICT updates the existing mark. "excluded" means the new values.
    const sql = `INSERT INTO attendance (course_id, student_id, attendance_date, status, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(course_id, student_id, attendance_date) DO UPDATE SET
        status = excluded.status, notes = excluded.notes, updated_at = excluded.updated_at
      RETURNING ${columns}`

    const query = database.query(sql)
    // Each question mark receives a value separately from the SQL text.
    // RETURNING and get() give back the saved row, including its ID.
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

  /** Counts recorded marks by status for one course. */
  countByStatus(courseId) {
    if (typeof courseId !== 'string' || !courseId.trim() || courseId.trim().length > 50) {
      throw new Error('Invalid course ID')
    }
    const normalizedCourseId = courseId.trim()
    const sql = `SELECT
      COUNT(*) FILTER (WHERE status = 'present') AS present,
      COUNT(*) FILTER (WHERE status = 'excused') AS excused,
      COUNT(*) FILTER (WHERE status = 'unexcused') AS unexcused
      FROM attendance
      WHERE course_id = ?`
    return this.openDatabase().query(sql).get(normalizedCourseId)
  }

  /** The same course/student/date/activity corrects one participation entry. */
  saveParticipation(input) {
    const errors = validateParticipation(input)
    if (Object.keys(errors).length > 0) throw new Error('Invalid participation record')

    const sql = `INSERT INTO participation
      (course_id, student_id, participation_date, activity, score, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(course_id, student_id, participation_date, activity) DO UPDATE SET
        score = excluded.score, notes = excluded.notes, updated_at = excluded.updated_at
      RETURNING ${participationColumns}`
    const query = this.openDatabase().query(sql)
    return query.get(
      input.courseId.trim(),
      input.studentId.trim(),
      input.date,
      input.activity.trim(),
      Number(input.score),
      input.notes.trim(),
      new Date().toISOString(),
    )
  }

  listParticipation(filter) {
    if (Object.keys(validateFilter(filter)).length > 0) throw new Error('Invalid attendance filter')
    const sql = `SELECT ${participationColumns} FROM participation
      ORDER BY participation_date DESC, course_id, student_id, activity`
    const records = this.openDatabase().query(sql).all()
    const matchingRecords = []
    for (const record of records) {
      if (filter.courseId !== '' && record.courseId !== filter.courseId) continue
      if (filter.studentId !== '' && record.studentId !== filter.studentId) continue
      if (filter.from !== '' && record.date < filter.from) continue
      if (filter.to !== '' && record.date > filter.to) continue
      matchingRecords.push(record)
    }
    return matchingRecords
  }

  /** One report row per course/student, including participation-only students. */
  getReport(filter) {
    const marks = this.list(filter)
    const activities = this.listParticipation(filter)
    const rows = []

    function studentRow(record) {
      let row = rows.find(
        (item) => item.courseId === record.courseId && item.studentId === record.studentId,
      )
      if (!row) {
        row = {
          courseId: record.courseId,
          studentId: record.studentId,
          present: 0,
          excused: 0,
          unexcused: 0,
          totalMarks: 0,
          presentRate: 0,
          participationEntries: 0,
          participationPoints: 0,
          averageScore: 0,
        }
        rows.push(row)
      }
      return row
    }

    for (const mark of marks) {
      const row = studentRow(mark)
      row[mark.status] += 1
      row.totalMarks += 1
    }
    for (const activity of activities) {
      const row = studentRow(activity)
      row.participationEntries += 1
      row.participationPoints += activity.score
    }
    for (const row of rows) {
      if (row.totalMarks > 0)
        row.presentRate = Math.round((row.present / row.totalMarks) * 10000) / 100
      if (row.participationEntries > 0)
        row.averageScore =
          Math.round((row.participationPoints / row.participationEntries) * 100) / 100
    }
    rows.sort(
      (a, b) => a.courseId.localeCompare(b.courseId) || a.studentId.localeCompare(b.studentId),
    )
    return rows
  }

  getStatistics(filter) {
    const rows = this.getReport(filter)
    const statistics = {
      present: 0,
      excused: 0,
      unexcused: 0,
      totalMarks: 0,
      presentRate: 0,
      participationEntries: 0,
      participationPoints: 0,
      averageScore: 0,
    }
    for (const row of rows) {
      statistics.present += row.present
      statistics.excused += row.excused
      statistics.unexcused += row.unexcused
      statistics.totalMarks += row.totalMarks
      statistics.participationEntries += row.participationEntries
      statistics.participationPoints += row.participationPoints
    }
    if (statistics.totalMarks > 0)
      statistics.presentRate =
        Math.round((statistics.present / statistics.totalMarks) * 10000) / 100
    if (statistics.participationEntries > 0)
      statistics.averageScore =
        Math.round((statistics.participationPoints / statistics.participationEntries) * 100) / 100
    return statistics
  }

  // Closing twice is safe. Setting null allows the store to open again later.
  close() {
    if (this.database !== null) {
      this.database.close()
      this.database = null
    }
  }
}
