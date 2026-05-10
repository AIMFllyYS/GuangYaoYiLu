# pptx-layer-merge · 技术沉淀与实战复盘

[**English**](experience.en.md)

> 本文档记录 `pptx-layer-merge` 技能从项目实战中诞生的完整过程：问题起源、路线演化、设计取舍、当前验证链覆盖范围，以及尚未闭环的困境清单。供未来协作者、Agent 或同类项目参考。

---

## 一、技术事后分析

### 1.1 问题起源：为什么 PowerPoint 总弹「需要修复」

本项目（光药医路联合团支部答辩 PPT）在 v1–v4 阶段，所有 PPTX 均由 Python 脚本**手写 ZIP 包 + PresentationML XML** 拼装而成。这些文件能通过浅层 package 检查（ZIP CRC 正常、关系目标存在、媒体图片可解码），但用 Microsoft PowerPoint 打开时**一律弹出修复弹窗**。

根因并非中文编码或图片损坏，而是 **OOXML 包结构语义不完整**：

- 缺少 `ppt/slideMasters/`、`ppt/slideLayouts/`、`ppt/theme/theme1.xml`、`ppt/presProps.xml`。
- Microsoft 规范要求最小合法 PPTX 必须包含 presentation part + presProps + slide master + slide layout + theme；仅有 slide XML 和图片不构成健康包。
- v2 以后还手写了 `<p:transition>` 和 `<p:timing>` 动画 XML，进一步增加 PowerPoint 修复触发概率。

详见：[`调研报告/PPT生成与元素级分层/01_PPTX损坏根因.md`](../调研报告/PPT生成与元素级分层/01_PPTX损坏根因.md)

### 1.2 路线演化：v1 → v6 → Skill

| 版本 | Commit | 日期 | 关键变化 | 结果 |
|------|--------|------|----------|------|
| v1 | `ed52a16` | 2026-05-07 | 手写 OOXML，15 页全图 + 文本框 | PowerPoint 修复弹窗 |
| v2 | `d78d980` | 2026-05-07 | 加入手写动画 timing + 讲稿画布外文本 | 修复弹窗 + 动画不稳定 |
| v3 | `4a8c80c` | 2026-05-08 | 纯图分层（header/left_field/center_field 区域切片） | 修复弹窗；分层非元素级 |
| v4 | `dcb5178` | 2026-05-09 | 安全工具 + QA 检查 + 22 页补充 | 修复弹窗；验证脚本只覆盖浅层 |
| v5 | `78518d6` | 2026-05-09 | **python-pptx 重建**，完整 master/layout/theme | ✅ 首次无修复弹窗 |
| v6 | `6c65ac9` | 2026-05-09 | 语义分层 + image2-first 策略 | ✅ 稳定；分层接近元素级 |
| Skill 初版 | `d3332ae` | 2026-05-10 | scaffold `premium-pptx-producer` | 规范文档 + 脚本骨架 |
| Skill 改名 | `e1529d4` | 2026-05-10 | → `pptx-layer-merge` | 统一命名 |
| Skill 文档 | `e22a406` | 2026-05-10 | Apache-2.0 + 双语 README | 对外可发布状态 |

**转折点是 v5**：放弃手写 OOXML，改用 `python-pptx`（成熟库自动生成 master/layout/theme/presProps），PowerPoint 首次无修复弹窗。这验证了调研报告的核心结论——**不要把「手写完整 PPTX 包」作为主路径**。

### 1.3 Skill 设计取舍

**选择 manifest-driven + python-pptx 的理由：**

1. **manifest 是合约层**：将视觉设计（生成图层）与 PPTX 组装（脚本）解耦；Agent 只需输出 JSON manifest，脚本负责坐标转换和包结构。
2. **python-pptx 是安全网**：它自动处理 master/layout/theme/presProps/relationship 等 PowerPoint 要求的包结构，避免手写 OOXML 的系统性风险。
3. **preview 是验证前置**：`build_pptx_from_manifest.py` 同时输出 PPTX 和 PNG preview，在没有 PowerPoint 的环境下也能做视觉 QA。

**未选择的路线及原因：**

| 方案 | 未选原因 |
|------|----------|
| PptxGenJS | 当前项目主脚本为 Python，迁移成本高；中文字体实测不足 |
| Open XML SDK (.NET) | 机器无 dotnet；SDK 低层，直接写代码复杂度高 |
| Codex Presentations runtime | 依赖 Codex 特定环境，不可移植到 Cursor/通用 CLI |
| 手写 OOXML + 动画 | v1–v4 已证伪，高风险 |

### 1.4 当前验证链覆盖范围

```
✅ 已覆盖                          ❌ 未覆盖
─────────────────────────────────  ─────────────────────────────────
ZIP CRC + 文件完整性               OpenXML schema validation (.NET)
必要 part 存在性                   LibreOffice headless render
relationship target 解析           PowerPoint 桌面打开/另存为
媒体图片 PIL verify                saved-PPTX parity 检查
slide 数量匹配                     动画 timing 合法性
forbidden text 扫描                shape id 唯一性深度检查
UTF-8 / mojibake 扫描              跨平台字体可用性验证
native text 存在性(strict)
single-image slide 检测(strict)
```

验证脚本：[`scripts/validate_pptx_artifact.py`](pptx-layer-merge/scripts/validate_pptx_artifact.py)

---

## 二、第一人称复盘

### 2.1 改名心路

最初命名为 `premium-pptx-producer`，意图是「高端 PPTX 生产者」。但在实际使用中发现这个名字有两个问题：

1. **语义模糊**：「premium」不传达技术特征，外部用户无法从名字推断这个 skill 做什么。
2. **与核心能力不匹配**：skill 的真正差异化不是「高端」，而是「分层 manifest 驱动的组装 + 包级校验」。

改名为 `pptx-layer-merge` 后，名字直接传达了两个核心动作：**layer**（分层）和 **merge**（组装）。这也与 `SKILL.md` 中 Workflow 第 4–5 步（Split into composition layers → Assemble PPTX）对齐。

Commit: `e1529d4`（2026-05-10）

### 2.2 Known Gaps（未闭环困境清单）

| # | 困境 | 证据 | 成因 | 候选解法 |
|---|------|------|------|----------|
| 1 | **缺 .NET / OpenXmlValidator** | `调研报告/.../04_验证与交付清单.md` §3；机器 `dotnet` 不存在 | 开发环境未安装 .NET SDK | 安装 .NET SDK；或在 CI 环境（GitHub Actions）补齐 |
| 2 | **缺 LibreOffice headless** | `调研报告/.../04_验证与交付清单.md` §4；机器 `soffice` 不存在 | 开发环境未安装 LibreOffice | 安装 LibreOffice；或 Docker 化验证步骤 |
| 3 | **无模板母体注入** | `scripts/build_pptx_from_manifest.py` 第 1 行 `Presentation()` 从空白创建 | 脚本设计时优先保证最小可运行 | 新增 `--template` 参数，从 `.potx` 继承 master/layout/theme |
| 4 | **无 legacy→skill 迁移路径** | v1–v4 产物（`交付物/答辩PPT/答辩PPT_v1~v4`）无法被 skill 流水线消费 | 旧版手写 OOXML 结构与 manifest schema 不兼容 | 写 `legacy_to_manifest.py` 转换脚本 |
| 5 | **跨平台字体硬编码** | `scripts/build_pptx_from_manifest.py` `FONT_DIR = Path("C:/Windows/Fonts")` | 开发环境为 Windows，未考虑 macOS/Linux | font fallback chain + `PPTX_FONT_DIR` 环境变量 |
| 6 | **无端到端 demo** | 无 CI 脚本或 Makefile 可一键跑通 scaffold→manifest→build→validate | 技能刚从项目中提取，尚未做独立验证 | 新增 `smoke_test.py` 或 GitHub Actions workflow |
| 7 | **动画 timing 未纳入** | `SKILL.md` Operating Rules: "Keep the first stable version static" | 设计决策：先静态后动画；v2 手写动画已证伪 | Future scope；待 python-pptx 或成熟库支持后再引入 |

### 2.3 对未来协作者 / Agent 的提醒

使用本 skill 前，请确认以下三件事：

1. **不要手写 OOXML**。如果你发现自己在拼 `<p:presentation>`、`<p:sldIdLst>`、`<p:timing>` 等 XML，请停下来。用 `python-pptx` 或等价成熟库。v1–v4 的教训已经足够。

2. **validate 通过 ≠ PowerPoint 不报错**。`validate_pptx_artifact.py` 只是 package smoke test。真正的交付必须有 PowerPoint 桌面打开确认，或至少 LibreOffice headless 转 PDF 成功。如果两者都不可用，请在交付报告中明确标注为 Known Gap。

3. **区域切片 ≠ 元素级分层**。`header`、`left_field`、`center_field` 这类按网格切出来的 PNG 不是 PowerPoint 元素。真正的元素是 shape tree 里的对象（`<p:sp>`、`<p:pic>`、`<p:graphicFrame>`）。如果你的 manifest 里出现区域名而非语义 id（如 `slide-title`、`photo-01`、`logo-primary`），说明分层粒度不够。

---

## 参考文件索引

| 文件 | 角色 |
|------|------|
| [`pptx-layer-merge/SKILL.md`](pptx-layer-merge/SKILL.md) | 技能主文档 |
| [`pptx-layer-merge/references/guangyaoyilu-lessons.md`](pptx-layer-merge/references/guangyaoyilu-lessons.md) | 项目经验提炼 |
| [`pptx-layer-merge/references/workspace-contract.md`](pptx-layer-merge/references/workspace-contract.md) | 工作区约定与 manifest schema |
| [`pptx-layer-merge/references/quality-gates.md`](pptx-layer-merge/references/quality-gates.md) | 质检门槛 |
| [`../调研报告/PPT生成与元素级分层/`](../调研报告/PPT生成与元素级分层/) | 5 篇调研报告（损坏根因 / 分层方案 / 工具调研 / 验证清单 / 证据附录） |
| [`../交付物/快速答辩/build_pptx.py`](../交付物/快速答辩/build_pptx.py) | 当前快速构建脚本（python-pptx） |

---

*Copyright © 2026 AIMFllyYS（羽升）. Licensed under Apache-2.0.*
