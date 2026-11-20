// Module 10: Attendance & Participation Tracking.
// Sprint 3 covers attendance, participation, statistics and CSV reports.
import { join } from 'node:path'
import { defineModule, moduleBase } from '../../core/defineModule'
import { createAttendanceRouter } from './router'
import { AttendanceStore } from './store'
// The shared loader discovers this index.js. moduleBase() turns this folder's name
// into '/10-attendance', which the views use when building links and form actions.
const base = moduleBase(import.meta.dir)
// Keep the database beside this module, independently of the terminal's working folder.
// Creating the store does not open SQLite yet; the store opens it on the first query.
const store = new AttendanceStore(join(import.meta.dir, 'data', 'attendance.sqlite'))
// Export the module's metadata and router for the main app to register. This file
// does not start another server; the existing C3L server serves the module's routes.
export default defineModule({
  name: 'Module 10: Attendance & Participation Tracking',
  description: 'Attendance, participation, statistics and downloadable reports',
  router: createAttendanceRouter(store, base),
})
