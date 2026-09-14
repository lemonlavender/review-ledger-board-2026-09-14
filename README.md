# Review Ledger Board

[简体中文](README.zh-CN.md)

An offline MCP App that turns review-evidence JSON into a board and a Markdown handoff. It is a **UI plugin**, separate from the [Copilot Review Verifier Skill](https://github.com/lemonlavender/copilot-review-verifier-2026-09-14).

**Supports use in [iPolloWork](https://github.com/Devin-AXIS/iPolloWork).** Independent MIT project; no official certification is claimed.

Topics: `ai` · `plugin` · `mcp-apps` · `ipollowork` · `github-copilot` · `code-review` · `evidence`.

## Install and open in iPollo

1. From [Releases](https://github.com/lemonlavender/review-ledger-board-2026-09-14/releases/latest), download **review-ledger-board-1.0.0.ipollowork-plugin**. Do not unzip it.
2. Open **扩展 / Extensions → 插件 / Plugins → 添加 / Add → 文件 / File**. Select the package.
3. Check the preview name/version and the passed declarative safety check, then click **安装插件 / Install plugin**.
4. Open a task in your project. Click **打开右侧面板 / Open right panel** at the top right, then **Review Ledger**. If a panel is already open, use **+ / 添加侧面板入口** to select it.
5. The board should show **iPollo 已连接 / Connected**. Click **载入模拟案例 / Sample**: expect 3 findings, 2 needing attention, and 1 with supplied fix evidence.
6. Click **仅待处理 / Needs attention** to see R17 and R19. Click **生成交接文档 / Export Markdown**, then copy/save the selected Markdown.

The plugin details may show **0 apps · 0 skills · 1 other capability** because this is a UI resource. Open it through the task's right panel, not the installed-plugin details page.

**Tested:** iPollo **0.50.12**, macOS arm64. Manual JSON import, filtering and export need no model, login or network connection. Optional model tools use the host's existing model configuration. See [desktop acceptance](docs/desktop-acceptance.md).

## Use your own ledger

Run the companion Skill, or prepare JSON matching [the example](examples/review-ledger.json), paste it into the board, and click **Build board**. The board validates schemaVersion 1, unique thread IDs, verdicts, evidence origins, revisions, required unknown fields, and basic size limits.

A changed head requires `latestHead` and displays a stale-evidence banner. Imported verdicts are displayed; the board does not certify them, run regressions, fetch PRs, resolve threads, or modify repository files. Failed imports display an error and keep the last valid board visible.

Data lives only in the current panel. Export before closing. There is no persistent storage, network dependency, account requirement, or hidden telemetry in this plugin.

## Model integration

While the panel is open, it offers MCP Apps tools `import_ledger({ledger})` and `get_summary({})`. The latter returns a Markdown handoff plus structured summary and ledger. Keep the panel open while calling these tools. The host may wrap/prefix the tool names.

## Build and package

Requirements: Node.js 22+ and `zip` (macOS/Linux). No npm installation or third-party runtime dependencies.

```sh
node --test tests/*.test.mjs
node scripts/build.mjs
node package.mjs
```

`ui/index.html` is the prebuilt, self-contained UI. The install archive in `dist/` contains only root `ipollowork.plugin.json` and `ui/index.html`. It declares no permissions, authorization methods, native engines, local services, executable commands, external CSP origins, or MCP server processes. Its untrusted declarative manifest follows the ordinary file importer.

GitHub source archives are source, not install packages. Use the release's `SHA256SUMS` to verify downloaded archives, e.g. `shasum -a 256 -c SHA256SUMS` once all listed assets are present. Raw archive hashes are separate from manifest checksums.

## Topic and limits

Selected on 2026-09-14 following GitHub's [2026-09-11 Copilot review auto-resolution update](https://github.blog/changelog/2026-09-11-auto-resolution-and-analysis-updates-in-copilot-code-review/). The useful problem is preserving evidence while review thread states change. The sample is fictional and is never presented as live repository data. See [topic sources](docs/hot-topic.md), [changelog](CHANGELOG.md), and [MIT license](LICENSE).

Only the host version above is declared compatible. Windows, Linux desktops and other host versions have not been accepted in this release.
