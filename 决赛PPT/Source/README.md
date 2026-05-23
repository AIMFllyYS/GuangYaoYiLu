# 决赛PPT Source 知识库

本目录用于沉淀决赛答辩 PPT 的制作依据、AI 生成流程、质量标准和可复用提示词。资料整理日期：2026-05-23。

## 文件索引

- `pptx_research_knowledge_base.md`：普通 PPTX 制作、答辩叙事、版式设计、PPTX 工程结构、可访问性与验收标准。
- `ai_ppt_generation_playbook.md`：AI 生成 PPT 的工具能力、提示词策略、分层制作工作流、风险控制和决赛项目落地流程。

## 使用原则

1. 先定答辩叙事，再做视觉。PPT 不是资料仓库，而是现场讲述的视觉轨道。
2. 事实、日期、奖项、数据、校名、队名、项目名必须来自本项目材料或可核验来源，不允许 AI 臆造。
3. 中文内容一律按 UTF-8 读写，交付前做乱码和替换字符扫描。
4. 决赛稿优先采用“视觉母图 + 语义图层 + 原生文字/图片”的混合路线，兼顾冲击力、可编辑性和稳定性。
5. 每个阶段完成后进行本地 commit，避免大批量不可回滚改动。

## 外部资料来源

- Microsoft Support: Slide Master, themes and layouts: https://support.microsoft.com/en-us/office/what-is-a-slide-master-in-powerpoint-b9abb2a0-7aef-4257-a14e-4329c904da54
- Microsoft Learn: PresentationML document structure: https://learn.microsoft.com/en-us/office/open-xml/presentation/structure-of-a-presentationml-document
- Microsoft Support: PowerPoint accessibility: https://support.microsoft.com/en-US/accessibility/powerpoint/make-your-powerpoint-presentations-accessible-to-people-with-disabilities
- UC San Diego: Evidence-based presentation design: https://multimedia.ucsd.edu/best-practices/presentation-design.html
- Microsoft Support: Copilot in PowerPoint FAQ: https://support.microsoft.com/en-gb/office/frequently-asked-questions-about-copilot-in-powerpoint-3e229188-9086-4f4c-9f9f-824cd25ae84f
- OpenAI Help Center: ChatGPT for PowerPoint: https://help.openai.com/en/articles/20001242-chatgpt-for-powerpoint
- Gamma Help Center: importing slides/documents: https://help.gamma.app/en/articles/11047840-how-can-i-import-slides-or-documents-into-gamma
- Gamma Help Center: exporting to PowerPoint/PDF/PNG: https://help.gamma.app/ru/articles/8022861-%D0%BA%D0%B0%D0%BA-%D1%8D%D0%BA%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C-%D0%B3%D0%B0%D0%BC%D0%BC%D1%8B
- Beautiful.ai Support: DesignerBot AI presentation generation: https://support.beautiful.ai/hc/en-us/articles/12885226948109-DesignerBot-Create-a-presentation
- OutlineSpark paper: outline-first AI slide generation: https://arxiv.org/abs/2403.09121
- PPTBench paper: PowerPoint layout and design understanding benchmark: https://arxiv.org/abs/2512.02624
