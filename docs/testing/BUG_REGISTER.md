# Bug Register

This register records defects identified during Task 09 review and the outcome
of each item.

| ID | Finding | Severity | Status | Fix / Decision |
| --- | --- | --- | --- | --- |
| QA-001 | The reset-password unit test initially omitted the `confirmPassword` field and did not exercise the validation branch correctly. | Low | Resolved | Added the missing field and re-ran the auth test suite successfully. |
| QA-002 | The testing documentation set was missing the operational support docs for ZAP, SonarQube, accessibility, performance, regression, evidence, coverage, and final QA reporting. | Low | Resolved | Added the missing Task 09 documents and cross-linked them from the testing index. |
| QA-003 | No product defect was identified in the current codebase after the security, backend, frontend, and testing review. | None | Closed - No defect | No code change required. The remaining risk is documented separately in the final QA report. |

## Summary

- No unresolved product defects remain from the Task 09 review.
- Any future defect discovered during browser automation or external scans should
  be added here with a stable ID and linked evidence.

