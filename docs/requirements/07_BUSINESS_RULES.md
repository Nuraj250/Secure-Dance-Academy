# Business Rules

| ID | Rule | Rationale |
| --- | --- | --- |
| BRULE-01 | Parents may access only the child artist profiles linked to their account. | Protect family privacy boundaries. |
| BRULE-02 | Coaches may manage only the artists assigned to them. | Limit operational scope. |
| BRULE-03 | Attendance may not be duplicated for the same artist and session. | Preserve record integrity. |
| BRULE-04 | Medical records require explicit authorization and are visible only to restricted roles. | Safeguard sensitive health data. |
| BRULE-05 | Deleted users remain in audit history and cannot erase accountability records. | Preserve evidence. |
| BRULE-06 | Role changes require administrator approval and are logged. | Prevent privilege abuse. |
| BRULE-07 | An artist record must exist before attendance, performance, or injury records can be created. | Preserve referential business integrity. |
| BRULE-08 | Performance and injury updates must be attributed to an accountable role. | Preserve provenance. |
| BRULE-09 | Administrative settings changes are restricted to approved administrator roles. | Prevent configuration abuse. |
| BRULE-10 | Search, filter, and export operations may only return data visible to the requesting role. | Prevent information leakage. |

## Business Rule Notes

- These rules are enforceable business expectations, not implementation details.
- Rules involving children and medical information are treated as high sensitivity.
