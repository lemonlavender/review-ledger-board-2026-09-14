# Desktop acceptance / 桌面验收

Date / 日期: **2026-09-14**. Host / 宿主: **iPollo 0.50.12**, macOS **arm64**, **OpenCode** engine, the app's existing **GPT-5.5** model configuration. An isolated project was used; no other plugins were modified.

## Observed results / 实际结果

| Check / 检查 | Observation / 观察 |
| --- | --- |
| Initial Skill 1.0.0 import | Rejected: “This plugin contains local code or privileged capabilities that are only allowed in reviewed official packages”. Install disabled. |
| Root cause and fix | Initial optional workspace/network permissions crossed the ordinary importer boundary. Version 1.1.0 removes them; no new privileges or trust flags were added. |
| Skill 1.1.0 file preview | Correct version, 1 skill, passed declarative safety check. |
| Skill installation | Installed and enabled; AI Review Evidence Audit enabled. |
| Actual Skill invocation | Host processing log showed loading copilot-review-verifier, reading handoff.md and review-case.md, writing skill-acceptance.md/json and reading the output files. |
| Skill verdicts | R17 still-present; R18 verified-fixed with supplied evidence and null command; R19 needs-evidence. No invented repository or executed regression. Head recheck unavailable. |
| UI plugin 1.0.0 file preview | Correct version and passed declarative safety check. |
| UI plugin installation | Enabled; Review Ledger available from the task right panel. |
| Host handshake | Board displayed “iPollo 已连接 / Connected”. |
| Manual sample | 3 findings, 2 needing attention, 1 with fix evidence, 0 independently executed. |
| Attention filter | Only R17 and R19 remained visible. |
| Markdown export | Export text contained all three findings, separate UI/technical states and explicit missing commands. |
| Invalid input | schemaVersion 99 rejected with “schemaVersion must be 1”; previous valid board retained. |
| Actual cross-project format handoff | Model read skill-acceptance.json and called the host workspace-app tools to invoke import_ledger and get_summary. Board updated to the actual Chinese Skill output. |
| Tool-return persistence | board-handoff.md saved in the project. Its content equals the plugin formatter output for that ledger after trimming final whitespace. |

公开可复核的模拟验收产物： [输入案例](../examples/review-case.md)、[Skill JSON](../examples/skill-acceptance.json)、[Skill 摘要](../examples/skill-acceptance.md)、[插件交接文档](../examples/board-handoff.md)。

本次确实在桌面导入和调用；不是只通过清单校验。Skill 1.0.0 失败后修复为 1.1.0，并重新导入验证。UI 插件安装后的真实入口是任务右侧面板的 Review Ledger；插件详情中的应用数量不能用来判断该 UI 是否有入口。

## Reproduce / 复现

Follow this repository's README file-import steps. Run the synthetic case through the Skill. With Review Ledger open, ask the model to import the resulting JSON through the panel tools, then call get_summary and save the returned Markdown. The expected count is 3 / 2 / 1, with 0 independently executed evidence. Manual users can paste the same JSON and export directly.

按 README 安装，在项目中运行模拟案例。保持看板打开，要求模型使用面板工具导入 Skill JSON 并调用 get_summary 保存 Markdown；或手动粘贴 JSON、生成看板并导出。

## Limits / 边界

This is a synthetic supplied-evidence exercise, not a live PR audit. No real repository regression was run. Standalone Skill-folder import, app restart, uninstall, in-place version update, other OSes, other models and other host versions were not tested. Closing/reopening the board during acceptance worked and starts with an empty board as documented.

这是模拟证据验收，不是实际 PR 复核或项目回归测试。独立 Skill 文件夹导入、应用重启、卸载、原地版本更新、其他操作系统/模型/宿主版本未测试。验收期间关闭并重新打开看板正常，按设计以空数据开始。

See release SHA256SUMS for the archive hashes. Those hashes identify the actual desktop-tested installation files; source archives are separate.
