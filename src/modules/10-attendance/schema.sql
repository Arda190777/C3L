-- Version 2 is additive: existing attendance rows and IDs stay unchanged.
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY,
  course_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  attendance_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('present', 'excused', 'unexcused')),
  notes TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL,
  UNIQUE(course_id, student_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS participation (
  id INTEGER PRIMARY KEY,
  course_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  participation_date TEXT NOT NULL,
  activity TEXT NOT NULL CHECK(length(trim(activity)) BETWEEN 1 AND 100),
  score INTEGER NOT NULL CHECK(typeof(score) = 'integer' AND score BETWEEN 0 AND 5),
  notes TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL,
  UNIQUE(course_id, student_id, participation_date, activity)
);

CREATE INDEX IF NOT EXISTS attendance_course_date ON attendance(course_id, attendance_date);
CREATE INDEX IF NOT EXISTS participation_course_date ON participation(course_id, participation_date);
PRAGMA user_version = 2;
