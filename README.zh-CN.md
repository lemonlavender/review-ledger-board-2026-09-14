# 审查证据看板 · Review Ledger Board

[English](README.md)

把审查证据 JSON 转为看板和 Markdown 交接文档的离线 MCP App。这是一个**界面插件**，与[Copilot Review Verifier Skill](https://github.com/lemonlavender/copilot-review-verifier-2026-09-14)分别交付。

**支持在 [iPolloWork](https://github.com/Devin-AXIS/iPolloWork) 中使用。** 独立开发、MIT 开源，不代表官方认证。

主题标签：`ai`、`plugin`、`mcp-apps`、`ipollowork`、`github-copilot`、`code-review`、`evidence`。

## 在 iPollo 中安装并打开

1. 从 [Releases](https://github.com/lemonlavender/review-ledger-board-2026-09-14/releases/latest) 下载 **review-ledger-board-1.0.0.ipollowork-plugin**，无需解压。
2. 点击 **扩展 → 插件 → 添加 → 文件**，选择安装包。
3. 核对预览中的名称、版本及“已通过声明式安全检查”，点击 **安装插件**。
4. 进入项目中的一个任务，点击右上角 **打开右侧面板 → Review Ledger**。如果右侧已有面板，使用 **+ / 添加侧面板入口** 选择它。
5. 看板应显示 **iPollo 已连接 / Connected**。点击 **载入模拟案例 / Sample**，应看到 3 条意见、2 条待处理、1 条有用户提供的修复证据。
6. 点击 **仅待处理**，应只看到 R17 和 R19。点击 **生成交接文档**，复制并保存选中的 Markdown。

插件详情可能显示 **0 个应用 · 0 个技能 · 1 项其他能力**，这是 UI 资源的展示方式。实际入口在任务的右侧面板中，不在插件详情页。

**实测环境：** iPollo **0.50.12**、macOS arm64。手动导入 JSON、筛选和导出不依赖模型、账号或网络；可选的模型工具调用使用宿主已有的模型配置。详见[桌面验收](docs/desktop-acceptance.md)。

## 导入自己的审查记录

运行配套 Skill，或参照[示例 JSON](examples/review-ledger.json)准备记录，粘贴后点击 **生成看板**。插件检查 schemaVersion 1、评论 ID 唯一性、判定与证据来源枚举、提交号、必要的未知字段和基本大小限制。

head 已变化时需提供 `latestHead`，并显示过期证据提示。看板展示导入结论，不独立证明它正确，也不会跑测试、拉取 PR、关闭评论或修改仓库。导入失败时明确显示错误，并保留上一次有效看板。

内容仅保留在当前面板，关闭前请导出保存。插件没有持久化存储、网络依赖、账号要求或隐藏遥测。

## 模型调用

面板打开时，提供 MCP Apps 工具 `import_ledger({ledger})` 和 `get_summary({})`。后者返回 Markdown 及结构化摘要、原始记录。调用时保持面板打开；宿主可能包装工具或加前缀。

## 构建与打包

需要 Node.js 22+ 和 `zip` 命令（macOS/Linux）。无需安装 npm 包，没有第三方运行依赖。

```sh
node --test tests/*.test.mjs
node scripts/build.mjs
node package.mjs
```

`ui/index.html` 是预构建的独立界面。输出到 `dist/` 的安装包仅包含根目录 `ipollowork.plugin.json` 和 `ui/index.html`。未声明插件权限、自定义授权、原生引擎、本地服务、执行命令、外部 CSP 域名或 MCP 服务进程，使用普通文件入口接受的不受信任声明式清单。

GitHub 源码压缩包是源码，不是安装包。下载 Release 列出的全部文件后，可运行 `shasum -a 256 -c SHA256SUMS` 校验。原始安装包摘要与清单 checksum 分开记录。

## 热点与边界

本项目于 2026-09-14 选题，关联 GitHub [2026-09-11 Copilot 评论自动解决更新](https://github.blog/changelog/2026-09-11-auto-resolution-and-analysis-updates-in-copilot-code-review/)。解决的是评论状态变化后的证据交接问题。内置案例为模拟数据，不冒充真实仓库记录。参见[热点来源](docs/hot-topic.md)、[更新日志](CHANGELOG.md)和 [MIT 许可证](LICENSE)。

本版本仅声明上述实测宿主版本兼容性，尚未验收 Windows、Linux 桌面和其他宿主版本。
