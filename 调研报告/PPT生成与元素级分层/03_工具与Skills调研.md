# 工具与 Skills 调研

## 1. 本地已安装 skill

最相关的是本地 Codex `Presentations` skill：

`C:/Users/AIMFl/.codex/plugins/cache/openai-primary-runtime/presentations/26.426.12240/skills/presentations/SKILL.md`

关键要求：

- 输出应是 editable presentation-native content，不是网页截图或整页截图。
- 使用 Granola JSX 和 PPTX-safe primitives。
- 最终 PNG previews 必须渲染并检查。
- montage/contact sheet 不能当作 PPTX parity。
- PPTX validation 是 blocking。
- saved `.pptx` 需要用可用的 headless PPTX/package/import 工具重新打开或检查。
- 重要文本节点应命名，并用 layout JSON 检查 text overflow、lineCount、bbox。

这和本项目当前 v3/v4 的“纯图分层”路线有冲突：v3/v4 更偏视觉播放稳定，而不是 editable native PPTX。

## 2. skills.sh 搜索结果

命令：`npx skills find pptx`

结果：

- `anthropics/skills@pptx`：93.4K installs
- `supercent-io/skills-template@pptx-presentation-builder`：8K installs
- `minimax-ai/skills@pptx-generator`：2.6K installs
- `claude-office-skills/skills@pptx-manipulation`：1.2K installs
- `davila7/claude-code-templates@pptx`：620 installs
- `smithery.ai@pptx`：578 installs

命令：`npx skills find powerpoint`

结果：

- `willem4130/claude-code-skills@elite-powerpoint-designer`：2.7K installs
- `igorwarzocha/opencode-workflows@powerpoint`：1.7K installs
- `aktsmm/agent-skills@powerpoint-automation`：1.3K installs
- `practicalswan/agent-skills@powerpoint-ppt`：147 installs
- `autobyteus/autobyteus-skills@infographic-powerpoint-deck`：143 installs
- `microsoft/hve-core@powerpoint`：106 installs

命令：`npx skills find presentation`

结果：

- `googleworkspace/cli@recipe-create-presentation`：12.9K installs
- `supercent-io/skills-template@pptx-presentation-builder`：8K installs
- `supercent-io/skills-template@presentation-builder`：4.1K installs
- `refoundai/lenny-skills@giving-presentations`：1.4K installs
- `jwynia/agent-skills@presentation-design`：1.3K installs
- `getsentry/skills@presentation-creator`：689 installs

命令：`npx skills find openxml`

结果：未找到 openxml 相关 skill。

结论：外部 skill 很多偏“生成/设计/自动化”，但没有直接解决 OpenXML schema validation 和 PowerPoint 修复问题的高可信 openxml skill。当前更应该先使用本地 Presentations skill 的验证纪律，或者引入 Open XML SDK / mature PPTX library，而不是盲目换另一个 PPT 生成 skill。

## 3. 主流库对比

### Codex Presentations runtime / artifact-tool

优势：

- 面向 Codex 工作流，支持 compose-first layout。
- 有 `text`、`image`、`shape`、`chart`、`table` 等 native primitives。
- 本地 skill 已内置 QA 规范。
- 强制关注 saved-PPTX parity 和 layout JSON。

风险：

- 需要按它的 runtime 工作流搭建，而不是继续当前 Python 手写 XML。
- 对复杂动画未必是主目标。

适用：后续重建一个稳定、可编辑、可验证的答辩 PPTX。

### python-pptx

优势：

- Python 生态，易于和当前脚本衔接。
- 可添加 text box、picture、shape、table。
- 以 PowerPoint 原生 shape tree 为对象模型。
- 不需要手写大部分 package 结构。

风险：

- 动画、复杂 chart、部分高级 PPT 功能支持有限。
- 美术级复杂 layout 需要自己管理。

适用：稳定生成静态 native PPTX、按元素构建对象、解析已有 PPTX 元素。

### PptxGenJS

优势：

- 官方文档说明可创建 text、tables、shapes、images、charts 等主要 slide objects。
- 输出 OOXML，兼容 PowerPoint、Keynote、LibreOffice Impress、Google Slides import。
- 支持 custom slide masters。
- 适合 Node/JS 工作流。

风险：

- 中文字体、复杂动画、精细 PowerPoint parity 仍需实测。
- 当前项目主脚本是 Python，迁移成本略高。

适用：JS 方向重建 PPTX，尤其需要 tables/charts/masters 时。

### Open XML SDK

优势：

- Microsoft 官方级 OpenXML API。
- 可用 `OpenXmlValidator` 做 schema validation。
- 对结构完整性和规范最有帮助。

风险：

- 当前机器没有 `dotnet`。
- SDK 低层，直接写代码复杂。

适用：作为验证工具，或在有 .NET 环境时生成/修复结构。

### LibreOffice headless

优势：

- 可作为 saved-PPTX 导入/渲染 smoke test。
- 命令行可把 PPTX 转 PDF/PNG 间接验证。

风险：

- 当前机器没有 `soffice` 或 `libreoffice` 命令。
- LibreOffice 和 PowerPoint 渲染不完全一致。

适用：没有 PowerPoint 自动化时的第二层兼容验证。

## 4. 当前机器可用性

已检查：

- `python.exe` 可用：`C:/Python314/python.exe`
- `node.exe` 可用：`C:/Program Files/nodejs/node.exe`
- Codex bundled Python/Node runtime 可用。
- `dotnet` 不可用。
- `soffice` / `libreoffice` 不可用。

因此当前机器不能直接运行 OpenXmlValidator，也不能直接做 LibreOffice headless render。后续如果要补齐验证链，需要安装 .NET SDK 或 LibreOffice，或换到有这些工具的环境。

## 5. 推荐工具组合

短期稳定路线：

1. 用 python-pptx 或 PptxGenJS 从模板生成静态 native PPTX。
2. 保留当前 PIL 预览图作为视觉参考，不作为 PPTX 本体。
3. 当前 `validate_pptx_package.py` 保留为 package smoke。
4. 增加“解析 PPTX 元素清单”的脚本，确保输出里有 native text/picture/shape/table/chart。
5. 在有 `dotnet` 的环境跑 OpenXmlValidator。
6. 用 PowerPoint 或 LibreOffice headless 做 saved-PPTX render。

中长期高质量路线：

1. 使用 Codex Presentations skill / artifact-tool 重建。
2. 每个关键节点命名并导出 layout 检查。
3. 用 native primitives 保留可编辑性。
4. 只把真实照片、logo、生成背景作为 image asset，不把整页 PPT rasterize。

## 6. 资料依据

- PptxGenJS introduction：<https://gitbrent.github.io/PptxGenJS/docs/introduction/>
- PptxGenJS tables：<https://gitbrent.github.io/PptxGenJS/docs/api-tables.html>
- PptxGenJS charts：<https://gitbrent.github.io/PptxGenJS/docs/api-charts.html>
- python-pptx quickstart：<https://python-pptx.readthedocs.io/en/stable/user/quickstart.html>
- Microsoft create presentation document：<https://learn.microsoft.com/en-us/office/open-xml/presentation/how-to-create-a-presentation-document-by-providing-a-file-name>

