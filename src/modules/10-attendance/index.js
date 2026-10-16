// Module 10: Attendance & Participation Tracking.
// Sprint 1 covers daily attendance, history and excused/unexcused absences.
import { join } from 'node:path'
import { defineModule, moduleBase } from '../../core/defineModule'
import { createAttendanceRouter } from './router'
import { AttendanceStore } from './store'
const base = moduleBase(import.meta.dir)
const store = new AttendanceStore(join(import.meta.dir, 'data', 'attendance.sqlite'))
export default defineModule({
  name: 'Module 10: Attendance & Participation Tracking',
  description: 'Record daily attendance and view attendance history',
  router: createAttendanceRouter(store, base),
})
