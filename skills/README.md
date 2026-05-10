# PPTX 分层组装技能（pptx-layer-merge）

[**English**](README.en.md)

本目录包含自研 **Agent Skill：`pptx-layer-merge`**（由旧版名称演进、**以本目录为唯一正式名称**），用于在严格 UTF-8 与「可编辑原生 PPTX」约束下，从素材、brief、分层 PNG 与 manifest 组装幻灯片并做包级校验。

**许可**： [`LICENSE`](LICENSE)（**Apache License 2.0**；版权：**AIMFllyYS（羽升）**，2026）。

**与本仓库团支部成品的关系**：`skills/` 下的脚本与文档以 Apache-2.0 单独授权；**不等于**仓库内 `交付物/`、`输出终稿/` 等团支部内容开放源码或开放重用，详见根目录 [README.md](../README.md) 的权利声明。

## 全库导航

各主目录的导读与英文章节见根目录 **[README.md](../README.md)** 中的「子目录 README 索引」及 **[README.en.md](../README.en.md)**；**[调研报告](../调研报告/README.md)** 中亦收录了与本技能相关的流水线结论。

## 包含内容

| 路径 | 说明 |
|------|------|
| [`pptx-layer-merge/scripts/`](pptx-layer-merge/scripts/) | 脚手架、manifest 组装、PPTX 校验等 Python 脚本 |
| [`pptx-layer-merge/references/`](pptx-layer-merge/references/) | 工作区约定、质检门槛、本项目沉淀的经验 |
| [`pptx-layer-merge/agents/`](pptx-layer-merge/agents/) | 代理侧配置示例（如 `openai.yaml`） |

## 如何安装到你的环境

以下为常见用法，具体以各产品当期文档为准。

1. **整包复制**：将 **`pptx-layer-merge/`** 目录复制到你的 Agent skills 存放位置（或与项目约定的 `skills/` 路径），保证 `SKILL.md` 在技能根目录。
2. **Cursor**：将技能文件夹放入 Cursor 所识别的 Agent Skills / 用户 skills 目录（参见 Cursor 文档中 *Agent Skills* / `SKILL.md` 约定），或在对话中通过工作区相对路径引用本仓库中的 [`pptx-layer-merge/SKILL.md`](pptx-layer-merge/SKILL.md)。
3. **Codex / 其他 CLI**：按对应工具的 skill 发现规则，指向包含 `SKILL.md` 的 `pptx-layer-merge` 根目录。

依赖：脚本侧通常需要 **Python 3** 与 **`python-pptx`** 等（见各脚本头部或项目内交付物 README）。

## 再次声明

- 使用、再分发 `skills/` 子树时，请保留 **Apache-2.0 全文**（[`LICENSE`](LICENSE)）及版权信息。
- 勿将本技能授权误解为对仓库内团支部正文的许可。

## 链接

- [技能主文档（SKILL.md）](pptx-layer-merge/SKILL.md)
- [Apache-2.0 许可证全文](LICENSE)
- [仓库首页（中文）](../README.md) · [English](../README.en.md)
