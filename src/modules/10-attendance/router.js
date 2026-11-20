/** @file router.js
 * @brief HTML form, history page and JSON endpoints mounted by the shared router.
 */
import { Elysia, t } from 'elysia'
import { validateAttendance, validateFilter, validateParticipation } from './attendance'
import { renderForm, renderHistory } from './pages'
import { renderParticipation } from './participationPage'
import { renderStatistics, renderReport } from './reportPages'
import { attendanceCsv } from './reportExport'
import specification from './openapi.json'
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
const participationSchema = t.Object({
  courseId: t.String({ maxLength: 200 }),
  studentId: t.String({ maxLength: 200 }),
  date: t.String({ maxLength: 30 }),
  activity: t.String({ maxLength: 300 }),
  score: t.Union([t.String({ maxLength: 30 }), t.Number()]),
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
  function summaryPage(type, query, set) {
    const filter = historyFilter(query)
    const errors = validateFilter(filter)
    const render = type === 'statistics' ? renderStatistics : renderReport
    if (Object.keys(errors).length > 0) {
      set.status = 422
      return render(base, null, filter, errors)
    }
    try {
      const data = type === 'statistics' ? store.getStatistics(filter) : store.getReport(filter)
      return render(base, data, filter)
    } catch {
      set.status = 503
      return render(base, null, filter, {
        storage: 'Could not load the summary. Please try again.',
      })
    }
  }
  // Paths are relative to the module mount: '/' becomes '/10-attendance' in C3L.
  // Passing the store in makes the router usable with a separate database in tests.
  return new Elysia()
    .onRequest(({ set }) => {
      set.headers['Cache-Control'] = 'no-store'
    })
    .get('/openapi.json', () => specification)
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
    .get('/participation', ({ query, set }) => {
      const filter = historyFilter(query)
      const errors = validateFilter(filter)
      if (Object.keys(errors).length > 0) {
        set.status = 422
        return renderParticipation(base, undefined, [], filter, {}, false, errors)
      }
      try {
        return renderParticipation(
          base,
          undefined,
          store.listParticipation(filter),
          filter,
          {},
          query.saved === '1',
        )
      } catch {
        set.status = 503
        return renderParticipation(base, undefined, [], filter, {
          storage: 'Could not load participation. Please try again.',
        })
      }
    })
    .post(
      '/participation',
      ({ body, set }) => {
        const input = { ...body, notes: body.notes ?? '' }
        const errors = validateParticipation(input)
        const filter = historyFilter({})
        if (Object.keys(errors).length > 0) {
          set.status = 422
          return renderParticipation(base, input, [], filter, errors)
        }
        try {
          store.saveParticipation(input)
        } catch {
          set.status = 503
          return renderParticipation(base, input, [], filter, {
            storage: 'Could not save participation. Please try again.',
          })
        }
        const query = new URLSearchParams({
          courseId: input.courseId.trim(),
          studentId: input.studentId.trim(),
          saved: '1',
        })
        return new Response(null, {
          status: 303,
          headers: { Location: `${base}/participation?${query}` },
        })
      },
      { body: participationSchema },
    )
    .get('/api/participation', ({ query, set }) => {
      const filter = historyFilter(query)
      const errors = validateFilter(filter)
      if (Object.keys(errors).length > 0) {
        set.status = 422
        return { errors }
      }
      try {
        return { records: store.listParticipation(filter) }
      } catch {
        set.status = 503
        return { error: 'Could not load participation.' }
      }
    })
    .post(
      '/api/participation',
      ({ body, set }) => {
        const input = { ...body, notes: body.notes ?? '' }
        const errors = validateParticipation(input)
        if (Object.keys(errors).length > 0) {
          set.status = 422
          return { errors }
        }
        try {
          return { record: store.saveParticipation(input) }
        } catch {
          set.status = 503
          return { error: 'Could not save participation.' }
        }
      },
      { body: participationSchema },
    )
    .get('/statistics', ({ query, set }) => summaryPage('statistics', query, set))
    .get('/reports', ({ query, set }) => summaryPage('reports', query, set))
    .get('/api/statistics', ({ query, set }) => {
      const filter = historyFilter(query)
      const errors = validateFilter(filter)
      if (Object.keys(errors).length > 0) {
        set.status = 422
        return { errors }
      }
      try {
        return { statistics: store.getStatistics(filter) }
      } catch {
        set.status = 503
        return { error: 'Could not load statistics.' }
      }
    })
    .get('/api/reports/attendance', ({ query, set }) => {
      const filter = historyFilter(query)
      const errors = validateFilter(filter)
      if (Object.keys(errors).length > 0) {
        set.status = 422
        return { errors }
      }
      try {
        return { rows: store.getReport(filter) }
      } catch {
        set.status = 503
        return { error: 'Could not load the attendance report.' }
      }
    })
    .get('/reports/attendance.csv', ({ query, set }) => {
      const filter = historyFilter(query)
      const errors = validateFilter(filter)
      if (Object.keys(errors).length > 0) {
        set.status = 422
        return { errors }
      }
      try {
        return new Response(attendanceCsv(store.getReport(filter)), {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="attendance-report.csv"',
            'Cache-Control': 'no-store',
          },
        })
      } catch {
        set.status = 503
        return { error: 'Could not export the attendance report.' }
      }
    })
}
