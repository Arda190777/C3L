/** @file router.js
 * @brief HTML form, history page and JSON endpoints mounted by the shared router.
 */
import { Elysia, t } from 'elysia'
import { validateAttendance, validateFilter } from './attendance'
import { renderForm, renderHistory } from './pages'
const inputSchema = t.Object({
  courseId: t.String({ maxLength: 200 }),
  studentId: t.String({ maxLength: 200 }),
  date: t.String({ maxLength: 30 }),
  status: t.String({ maxLength: 30 }),
  notes: t.Optional(t.String({ maxLength: 1000 })),
})
function historyFilter(query) {
  return {
    courseId: (query.courseId ?? '').trim(),
    studentId: (query.studentId ?? '').trim(),
    from: query.from ?? '',
    to: query.to ?? '',
  }
}
/** Uses injected storage so route tests never write to the demo database. */
export function createAttendanceRouter(store, base) {
  return new Elysia()
    .get('/', () => renderForm(base))
    .post(
      '/attendance',
      ({ body, set }) => {
        const input = { ...body, notes: body.notes ?? '' }
        const errors = validateAttendance(input)
        if (Object.keys(errors).length) {
          set.status = 422
          return renderForm(base, input, errors)
        }
        try {
          store.save(input)
        } catch {
          set.status = 503
          return renderForm(base, input, {
            storage: 'Could not save attendance. Please try again.',
          })
        }
        const query = new URLSearchParams({
          courseId: input.courseId.trim(),
          studentId: input.studentId.trim(),
          saved: '1',
        })
        return new Response(null, {
          status: 303,
          headers: { Location: `${base}/history?${query}` },
        })
      },
      { body: inputSchema },
    )
    .get('/history', ({ query, set }) => {
      const filter = historyFilter(query)
      const errors = validateFilter(filter)
      if (Object.keys(errors).length) {
        set.status = 422
        return renderHistory(base, [], filter, errors)
      }
      try {
        return renderHistory(base, store.list(filter), filter, {}, query.saved === '1')
      } catch {
        set.status = 503
        return renderHistory(base, [], filter, {
          storage: 'Could not load attendance. Please try again.',
        })
      }
    })
    .get('/api/attendance', ({ query, set }) => {
      const filter = historyFilter(query)
      const errors = validateFilter(filter)
      if (Object.keys(errors).length) {
        set.status = 422
        return { errors }
      }
      try {
        return { records: store.list(filter) }
      } catch {
        set.status = 503
        return { error: 'Could not load attendance.' }
      }
    })
    .post(
      '/api/attendance',
      ({ body, set }) => {
        const input = { ...body, notes: body.notes ?? '' }
        const errors = validateAttendance(input)
        if (Object.keys(errors).length) {
          set.status = 422
          return { errors }
        }
        try {
          return { record: store.save(input) }
        } catch {
          set.status = 503
          return { error: 'Could not save attendance.' }
        }
      },
      { body: inputSchema },
    )
}
