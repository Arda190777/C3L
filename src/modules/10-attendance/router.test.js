// Integration tests send Request objects through the router and real SQLite storage.
// They check HTTP statuses, response formats and resulting data without opening a port.
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { Elysia } from 'elysia'
import { createApp } from '../../app'
import { finishResponse } from '../../core/finishResponse'
import { attendanceStatuses } from './attendance'
import { createAttendanceRouter } from './router'
import { AttendanceStore } from './store'
const base = '/10-attendance'
async function readBody(response) {
  return await response.json()
}
const mark = {
  courseId: 'PROG3000',
  studentId: 'S1001',
  date: '2026-10-16',
  status: 'present',
  notes: '',
}
describe('attendance routes through the shared prefix', () => {
  let store
  let handle
  // A fresh in-memory database isolates every test from the others and the demo file.
  // Mount under the real prefix so links/redirects are tested as they appear in C3L.
  beforeEach(() => {
    store = new AttendanceStore(':memory:')
    const app = new Elysia().group(base, (app) => app.use(createAttendanceRouter(store, base)))
    handle = (request) => app.handle(request)
  })
  afterEach(() => store.close())
  // Build full mounted URLs. The post helper serializes a JavaScript object into
  // JSON and declares its content type, matching a real API client's request.
  const request = (path, init) => new Request(`http://localhost${base}${path}`, init)
  const post = (data) =>
    request('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  test('HTTP-01 serves the form as HTML through finishResponse', async () => {
    // Include the shared response helper here because it supplies the HTML content type.
    const req = request('')
    const response = await finishResponse(req, await handle(req))
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(await response.text()).toContain(`action="${base}/attendance"`)
  })
  test('HTTP-02 saves and retrieves JSON for each status', async () => {
    for (const [i, status] of attendanceStatuses.entries()) {
      const response = await handle(post({ ...mark, studentId: `S${i}`, status }))
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')
      expect((await readBody(response)).record.status).toBe(status)
    }
    const response = await handle(request('/api/attendance'))
    expect((await readBody(response)).records).toHaveLength(3)
  })
  test('HTTP-03 rejects malformed or missing JSON fields', async () => {
    // These cases fail parsing/schema checks before attendance business rules run.
    expect((await handle(post({}))).status).toBe(422)
    expect((await handle(post({ ...mark, courseId: 123 }))).status).toBe(422)
    expect(
      (
        await handle(
          request('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{',
          }),
        )
      ).status,
    ).toBeGreaterThanOrEqual(400)
  })
  test('HTTP-04 rejects invalid date, blank ID and unsupported status', async () => {
    const response = await handle(
      post({ ...mark, date: '2026-02-30', courseId: ' ', status: 'late' }),
    )
    expect(response.status).toBe(422)
    const body = await readBody(response)
    expect(body.errors).toHaveProperty('date')
    expect(body.errors).toHaveProperty('courseId')
    expect(body.errors).toHaveProperty('status')
    expect((await readBody(await handle(request('/api/attendance')))).records).toEqual([])
  })
  test('HTTP-05 form submission redirects after saving', async () => {
    // URLSearchParams sends form-encoded data. Check the redirect, then request its
    // destination explicitly because an in-process router call does not follow it.
    const response = await handle(
      request('/attendance', {
        method: 'POST',
        body: new URLSearchParams(mark),
      }),
    )
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe(
      `${base}/history?courseId=PROG3000&studentId=S1001&saved=1`,
    )
    const history = await handle(new Request(`http://localhost${response.headers.get('location')}`))
    const html = await history.text()
    expect(html).toContain('Attendance saved.')
    expect(html).toContain('S1001')
  })
  test('HTTP-06 form errors preserve escaped values', async () => {
    // Submit HTML-like text alongside an invalid date. The returned form must retain
    // the text safely, and mark invalid controls for assistive technology.
    const response = await handle(
      request('/attendance', {
        method: 'POST',
        body: new URLSearchParams({ ...mark, courseId: '<script>x</script>', date: '2026-02-30' }),
      }),
    )
    expect(response.status).toBe(422)
    const html = await response.text()
    expect(html).toContain('&lt;script&gt;x&lt;/script&gt;')
    expect(html).toContain('aria-invalid="true"')
    expect(html).not.toContain('<script>x</script>')
  })
  test('HTTP-07 history escapes stored notes and IDs', async () => {
    await handle(post({ ...mark, studentId: '<img src=x>', notes: '<script>alert(1)</script>' }))
    const html = await (await handle(request('/history'))).text()
    expect(html).toContain('&lt;img src=x&gt;')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).not.toContain('<script>')
  })
  test('HTTP-08 validates date filters for both history endpoints', async () => {
    for (const path of ['/history', '/api/attendance']) {
      expect((await handle(request(`${path}?from=bad`))).status).toBe(422)
      expect((await handle(request(`${path}?from=2026-10-17&to=2026-10-16`))).status).toBe(422)
    }
  })
  test('HTTP-09 filters records and shows an empty state', async () => {
    await handle(post(mark))
    await handle(post({ ...mark, courseId: 'PROG4000' }))
    const response = await handle(
      request('/api/attendance?courseId=PROG3000&studentId=S1001&from=2026-10-16&to=2026-10-16'),
    )
    expect((await readBody(response)).records).toHaveLength(1)
    expect(await (await handle(request('/history?studentId=missing'))).text()).toContain(
      'No attendance records match',
    )
  })
  test('HTTP-10 corrects an existing mark through the API', async () => {
    // The same course/student/date must update one record, not create a second mark.
    await handle(post(mark))
    await handle(post({ ...mark, status: 'unexcused' }))
    const records = (await readBody(await handle(request('/api/attendance')))).records
    expect(records).toHaveLength(1)
    expect(records[0].status).toBe('unexcused')
  })
  test('HTTP-11 uses a friendly error when storage fails', async () => {
    // Inject a deliberately failing store to exercise error handling reliably.
    // The response should report 503 without revealing the private exception text.
    class UnavailableStore extends AttendanceStore {
      save() {
        throw new Error('private storage path')
      }
      list() {
        throw new Error('private storage path')
      }
    }
    const app = createAttendanceRouter(new UnavailableStore(':memory:'), base)
    const response = await app.handle(
      new Request('http://localhost/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mark),
      }),
    )
    expect(response.status).toBe(503)
    expect(await response.text()).not.toContain('private storage path')
    expect((await app.handle(new Request('http://localhost/history'))).status).toBe(503)
  })
})
// This final case uses the real loader/main app, verifying discovery of index.js
// and that attendance remains compatible with the home page and shared 404 handling.
test('APP-01 discovers Module 10 and keeps the main site working', async () => {
  const app = await createApp()
  const home = await app.fetch(new Request('http://localhost/'))
  expect(home.status).toBe(200)
  expect(await home.text()).toContain('/10-attendance')
  const attendance = await app.fetch(new Request('http://localhost/10-attendance'))
  expect(attendance.status).toBe(200)
  expect(attendance.headers.get('content-type')).toContain('text/html')
  expect(await attendance.text()).toContain('Record attendance')
  expect((await app.fetch(new Request('http://localhost/not-a-module'))).status).toBe(404)
})

describe('Sprint 3 participation, statistics and reports', () => {
  let store
  let app
  const activity = { ...mark, activity: 'Discussion', score: 4 }
  const request = (path, init) => new Request(`http://localhost${base}${path}`, init)
  const post = (path, body) =>
    request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  beforeEach(() => {
    store = new AttendanceStore(':memory:')
    app = new Elysia().group(base, (scope) => scope.use(createAttendanceRouter(store, base)))
  })
  afterEach(() => store.close())

  test('S3-HTTP-01 participation API saves, corrects and filters activities', async () => {
    const first = await app.handle(post('/api/participation', activity))
    expect(first.status).toBe(200)
    const id = (await first.json()).record.id
    const corrected = await app.handle(post('/api/participation', { ...activity, score: 2 }))
    expect((await corrected.json()).record.id).toBe(id)
    await app.handle(post('/api/participation', { ...activity, courseId: 'OTHER' }))
    const response = await app.handle(
      request('/api/participation?courseId=PROG3000&studentId=S1001'),
    )
    const records = (await response.json()).records
    expect(records.length).toBe(1)
    expect(records[0].score).toBe(2)
  })

  test('S3-HTTP-02 participation form redirects and safely displays stored text', async () => {
    const response = await app.handle(
      request('/participation', {
        method: 'POST',
        body: new URLSearchParams({
          ...activity,
          score: '4',
          activity: '<script>alert(1)</script>',
        }),
      }),
    )
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe(
      `${base}/participation?courseId=PROG3000&studentId=S1001&saved=1`,
    )
    const history = await app.handle(
      new Request(`http://localhost${response.headers.get('location')}`),
    )
    const html = await history.text()
    expect(html).toContain('Participation saved.')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).not.toContain('<script>alert(1)</script>')
  })

  test('S3-HTTP-03 invalid participation returns 422 without writing a row', async () => {
    const response = await app.handle(post('/api/participation', { ...activity, score: 6 }))
    expect(response.status).toBe(422)
    expect((await response.json()).errors).toHaveProperty('score')
    const form = await app.handle(
      request('/participation', {
        method: 'POST',
        body: new URLSearchParams({ ...activity, score: '', activity: '<b>keep</b>' }),
      }),
    )
    expect(form.status).toBe(422)
    const html = await form.text()
    expect(html).toContain('&lt;b&gt;keep&lt;/b&gt;')
    expect(html).toContain('aria-invalid="true"')
    expect(
      (await app.handle(post('/api/participation', { ...activity, score: true }))).status,
    ).toBe(422)
    expect((await app.handle(post('/api/participation', {}))).status).toBe(422)
    expect(store.listParticipation({ courseId: '', studentId: '', from: '', to: '' })).toEqual([])
  })

  test('S3-HTTP-04 statistics expose filtered attendance and participation totals', async () => {
    await app.handle(post('/api/attendance', mark))
    await app.handle(post('/api/attendance', { ...mark, date: '2026-10-17', status: 'excused' }))
    await app.handle(post('/api/attendance', { ...mark, courseId: 'OTHER' }))
    await app.handle(post('/api/participation', activity))
    const response = await app.handle(request('/api/statistics?courseId=PROG3000'))
    const statistics = (await response.json()).statistics
    expect(statistics.totalMarks).toBe(2)
    expect(statistics.presentRate).toBe(50)
    expect(statistics.participationPoints).toBe(4)
    const empty = await app.handle(request('/api/statistics?studentId=MISSING'))
    expect((await empty.json()).statistics.presentRate).toBe(0)
    const page = await app.handle(request('/statistics?courseId=PROG3000'))
    expect(await page.text()).toContain('50%')
  })

  test('S3-HTTP-05 JSON report and downloadable CSV preserve data and neutralize formulas', async () => {
    const input = { ...mark, courseId: '=2+2', studentId: 'S,"007' }
    await app.handle(post('/api/attendance', input))
    const response = await app.handle(request('/api/reports/attendance'))
    expect((await response.json()).rows[0].studentId).toBe('S,"007')
    const download = await app.handle(request('/reports/attendance.csv'))
    expect(download.status).toBe(200)
    expect(download.headers.get('content-type')).toContain('text/csv')
    expect(download.headers.get('content-disposition')).toContain(
      'attachment; filename="attendance-report.csv"',
    )
    expect(download.headers.get('cache-control')).toBe('no-store')
    const csv = await download.text()
    expect(csv).toContain('"\'=2+2"')
    expect(csv).toContain('"S,""007"')
    expect(csv).toContain('\r\n')
    const reportPage = await app.handle(request('/reports'))
    expect(await reportPage.text()).toContain('S,&quot;007')
  })

  test('S3-HTTP-06 every new read endpoint rejects reversed or impossible dates', async () => {
    const paths = [
      '/participation',
      '/statistics',
      '/reports',
      '/api/participation',
      '/api/statistics',
      '/api/reports/attendance',
      '/reports/attendance.csv',
    ]
    for (const path of paths) {
      expect((await app.handle(request(`${path}?from=2026-11-02&to=2026-11-01`))).status).toBe(422)
      expect((await app.handle(request(`${path}?from=2026-02-30`))).status).toBe(422)
    }
  })

  test('S3-HTTP-07 new routes give friendly storage errors without leaking details', async () => {
    class FailingStore extends AttendanceStore {
      saveParticipation() {
        throw new Error('private file path')
      }
      listParticipation() {
        throw new Error('private file path')
      }
      getReport() {
        throw new Error('private file path')
      }
      getStatistics() {
        throw new Error('private file path')
      }
    }
    const failing = new Elysia().group(base, (scope) =>
      scope.use(createAttendanceRouter(new FailingStore(':memory:'), base)),
    )
    for (const path of [
      '/participation',
      '/statistics',
      '/reports',
      '/api/participation',
      '/api/statistics',
      '/api/reports/attendance',
      '/reports/attendance.csv',
    ]) {
      const response = await failing.handle(request(path))
      expect(response.status).toBe(503)
      expect(await response.text()).not.toContain('private file path')
    }
    expect((await failing.handle(post('/api/participation', activity))).status).toBe(503)
    const form = await failing.handle(
      request('/participation', {
        method: 'POST',
        body: new URLSearchParams({ ...activity, score: '4' }),
      }),
    )
    expect(form.status).toBe(503)
  })

  test('S3-HTTP-08 new screens have reachable links and clear empty states', async () => {
    const home = await app.handle(request(''))
    const html = await home.text()
    for (const path of ['/participation', '/statistics', '/reports']) {
      expect(html).toContain(`href="${base}${path}"`)
      const req = request(path)
      const response = await finishResponse(req, await app.handle(req))
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('text/html')
      expect(await response.text()).toMatch(
        /No (participation entries|recorded data|student records)/,
      )
    }
  })
})
