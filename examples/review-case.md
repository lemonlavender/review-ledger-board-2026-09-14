# Synthetic review exercise / 模拟审查案例

This is an invented PR, not a live GitHub review. Short SHAs are fixture identifiers.
这是模拟 PR，不是真实 GitHub 审查。短提交号仅用于测试。

PR #42 has current head `b222222`. Review these findings without posting or merging:

- **R17 — resolved:** code moved from `src/cache.ts:8` to `src/memo.ts:31`. Only the function name changed. The intended cache accepts numeric key `0`, but `if(key)` still skips it. No current regression was run.
- **R18 — open:** reviewer reported duplicate event listeners. The supplied `b222222` diff shows cleanup removes the same listener reference. The user reports a targeted regression failed at `a111111` and passed at `b222222`. The exact command and log are unavailable.
- **R19 — outdated:** reviewer reported a null-pointer issue. A test passed at `a111111`; current source and test results are unavailable.

Expected: R17 `still-present`; R18 `verified-fixed` **based on supplied evidence**, with command `null`; R19 `needs-evidence`. `headRecheck` is `unavailable`. Do not invent a repository URL or imply tests were executed during the audit.

预期：R17 问题仍在；R18 根据用户提供证据判为已修复，不能说本次已执行测试，命令保留 `null`；R19 缺少当前版本证据。输出摘要和 JSON 记录。
