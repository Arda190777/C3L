/** CSV export escapes quotes and prevents spreadsheet formulas in text IDs. */
export function attendanceCsv(rows) {
  const header = [
    'Course',
    'Student',
    'Present',
    'Excused',
    'Unexcused',
    'Recorded marks',
    'Present rate (%)',
    'Participation entries',
    'Participation points',
    'Average score (0-5)',
  ]

  function cell(value) {
    let text = String(value)
    if (/^\s*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`
    return `"${text.replaceAll('"', '""')}"`
  }

  const lines = [header.map(cell).join(',')]
  for (const row of rows) {
    const values = [
      row.courseId,
      row.studentId,
      row.present,
      row.excused,
      row.unexcused,
      row.totalMarks,
      row.presentRate,
      row.participationEntries,
      row.participationPoints,
      row.participationEntries > 0 ? row.averageScore : '',
    ]
    lines.push(values.map(cell).join(','))
  }
  return `${lines.join('\r\n')}\r\n`
}
