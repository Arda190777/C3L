# Sprint 3 executed evidence

Final tested source: 86d64cc. Run November 20, 2026, Windows/Bun 1.4.3.

- module-tests.txt: 47 pass, 0 fail, 230 assertions.
- full-check.txt: lint, TypeScript host check, 103 pass / 401 assertions and all 12 module front pages pass.
- browser-results.md: actual UI checks, screenshot descriptions and downloaded CSV.
- ui-rendered-audit.txt/statistics-rendered.json: sampled statistics contrast/target/keyboard audit after the date focus fix. This is not full accessibility certification.
- pre-fix-red-tests.txt: real failing tests before implementation, including the invalid-course input behavior recorded in #15.
- api-*.json: API helper reports. No breaking changes against the reconstructed old attendance contract. Generic production score warnings remain; authentication/pagination are not implemented.

Historical *-2026-11-20.txt logs contain the earlier 04dd3ac baseline (28 module / 84 repository tests), not final Sprint 3 results. Keep them for comparison. Terminal trailing spaces may be normalized; result values are unchanged. Automated execution does not constitute real teammate peer review.
