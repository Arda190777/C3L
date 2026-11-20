# Sprint 3 - requirement mapping proposal

Local IDs only. The shared SRS link and official IDs are not available. Nasir owns the collaborative update in #13.

| Local ID | Requirement | Verified baseline state | Owner / next work |
| --- | --- | --- | --- |
| M10-FR-01 | Record/correct daily attendance | Implemented and tested | Gera maintains; Arda verifies |
| M10-FR-02 | Filter attendance history | Implemented and tested | Jaspreet UI; Nasir API; Arda verifies |
| M10-FR-03 | Present/excused/unexcused statuses | Implemented and tested | Nasir validation; Gera storage |
| M10-FR-04 | Participation tracking | Not implemented | Gera storage; Nasir API; Jaspreet UI; Arda tests |
| M10-FR-05 | Attendance reports | Not implemented | Gera data; Nasir API/docs; Jaspreet UI; Arda tests |
| M10-FR-06 | Attendance statistics | countByStatus exists in storage only | Gera counts; Nasir API; Jaspreet display; Arda tests |

## Decisions before implementation

- Agree a minimal participation record and scoring policy. No score range is assumed in this plan.
- Agree report fields/output format and the statistics denominator. Recorded marks are not the same as enrolled students.
- Keep the daily attendance uniqueness rule unless the SRS explicitly changes it. Do not infer absences from missing marks.
- Resolve identity/role/enrollment integration in #5 with Modules 1 and 2. Existing attendance routes do not enforce those checks.
- Mark FR-06 partially implemented until both the service contract and accessible UI exist.

## Traceability

#10 storage; #11 tests; #12 UI/demo; #13 APIs/SRS/design/release. Existing scope parents: #5 integration and #6 participation/reports/statistics.
Copy this mapping into the actual collaborative SRS and record its official IDs. This local file does not update that shared document.
