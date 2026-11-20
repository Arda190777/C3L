# Actual browser checks - November 20, 2026

Candidate code 86d64cc, app on localhost:3100. Only fictional IDs were entered. Screenshot evidence and downloaded CSV are adjacent to this file.

| Action | Observed result | Evidence |
| --- | --- | --- |
| Attendance Present, S3DEMO101/S3DEMO001, 2026-11-20 | One recorded present mark | statistics-final.jpg |
| Class discussion score 4 corrected to 2 with the same key | One corrected activity, no duplicate | participation-corrected-browser.png |
| Add Group exercise score 5 | Two activities, seven points, average 3.5 | statistics-final.jpg |
| Open filtered Reports and download CSV | Report fields agree; real downloaded row contains 1 present / 2 activities / 7 points / 3.5 average | report-browser.png; browser-attendance-report.csv |
| Filter unknown course | Empty report message | report-empty-browser.png |
| Submit reversed date range | Validation error, HTTP 422 | statistics-error-browser.png |
| Statistics at 320px width | Document scrollWidth/clientWidth both 320; content wraps | statistics-mobile.jpg |
| Keyboard pass on final statistics page | All 13 controls reached; date subfields keep outline after focus-within fix | statistics-rendered.json; ui-rendered-audit.txt |

The browser screenshots before the final date-outline CSS fix still show the same data/layout. The final rendered audit was repeated after the fix. This is a sampled UI check, not complete assistive-technology certification. A generic source scan's raw-color count is a low styling warning, not a behavior failure.
