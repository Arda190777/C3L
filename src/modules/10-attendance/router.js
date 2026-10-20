/** @file router.js
 * @brief HTML form, history page and JSON endpoints mounted by the shared router.
 */
import { Elysia, t } from 'elysia'
import { validateAttendance, validateFilter } from './attendance'
import { renderForm, renderHistory } from './pages'
// Elysia's schema checks request shape and string types before the POST handlers run.
// These outer limits are larger than the business limits in validateAttendance(),
// allowing that validator to return useful field messages for ordinary length errors.
const inputSchema = t.Object({
  courseId: t.String({ maxLength: 200 }),
  studentId: t.String({ maxLength: 200 }),
  date: t.String({ maxLength: 30 }),
  status: t.String({ maxLength: 30 }),
  notes: t.Optional(t.String({ maxLength: 1000 })),
})
// Both history endpoints use this same conversion. ?? supplies empty strings for
// missing parameters, and trim() removes surrounding whitespace from ID filters.
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
  // Paths are relative to the module mount: '/' becomes '/10-attendance' in C3L.
  // Passing the store in makes the router usable with a separate database in tests.
  return new Elysia()
    .get('/', () => renderForm(base))
    .post(
      '/attendance',
      ({ body, set }) => {
        // body holds submitted fields; set controls the HTTP response. Normalize
        // omitted notes to '', so validation and storage can treat notes as a string.
        const input = { ...body, notes: body.notes ?? '' }
        const errors = validateAttendance(input)
        // An empty errors object has zero keys. 422 means the supplied values are invalid;
        // re-render the form with its previous values instead of discarding the user's work.
        if (Object.keys(errors).length) {
          set.status = 422
          return renderForm(base, input, errors)
        }
        try {
          store.save(input)
        } catch {
          // 503 reports a storage failure with a readable message, without exposing
          // the database path or internal exception in the response.
          set.status = 503
          return renderForm(base, input, {
            storage: 'Could not save attendance. Please try again.',
          })
        }
        // URLSearchParams encodes the saved IDs for a filtered history URL.
        const query = new URLSearchParams({
          courseId: input.courseId.trim(),
          studentId: input.studentId.trim(),
          saved: '1',
        })
        // POST -> 303 redirect -> GET history. Refreshing the destination requests
        // history again instead of submitting the attendance form a second time.
        return new Response(null, {
          status: 303,
          headers: { Location: `${base}/history?${query}` },
        })
      },
      { body: inputSchema },
    )
    .get('/history', ({ query, set }) => {
      // The HTML history page and JSON history endpoint share filter/storage rules;
      // this route passes the resulting rows to the history view to build a table.
      const filter = historyFilter(query)
      const errors = validateFilter(filter)
      if (Object.keys(errors).length) {
        set.status = 422
        return renderHistory(base, [], filter, errors)
      }
      try {
        // saved=1 controls the confirmation banner after a successful form redirect.
        return renderHistory(base, store.list(filter), filter, {}, query.saved === '1')
      } catch {
        set.status = 503
        return renderHistory(base, [], filter, {
          storage: 'Could not load attendance. Please try again.',
        })
      }
    })
    .get('/api/attendance', ({ query, set }) => {
      // Returning an object lets Elysia produce JSON for API clients instead of HTML.
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
        // JSON writes use the same validation and save() operation as the browser form,
        // but return the saved record directly instead of redirecting to a page.
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
