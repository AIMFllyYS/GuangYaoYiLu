# AI PPTX Stage Review Prompt Pack

这些 prompt 用于本地 Codex/AI 协作，不包含模型密钥或远程 API 假设。使用前先运行 `npm run ai:brief -- --deck <deck-id>`。

## 1. 创作前 Brief Prompt

你正在更新 `ai-pptx-stage` 的一个新作 deck。请先阅读 `dist/ai-briefs/<deck-id>.md`、`src/decks/<deck-id>/README.md`、每页 `notes.md` 和当前 `page.ts`。普通创作只修改 `src/decks/<deck-id>/**`。请输出逐页更新计划，标明每页的叙事目标、素材缺口、可编辑 PPTX 对象策略、Morph key 复用策略、需要运行的验证命令。保持 UTF-8 中文安全，不要改系统层。

## 2. 逐页审美 Review Prompt

请审查 `src/decks/<deck-id>/pages/<page-id>/page.ts`。重点看画面层级、文字密度、对齐、留白、图片裁切、品牌一致性、中文可读性、移动到 PPTX 后的可编辑性。只给可执行修改建议，按风险排序，并指出会触发 `validate:layout` 或 `validate:export` 的问题。

## 3. Morph 复刻 Prompt

请比较相邻两页 `<from-page>` 和 `<to-page>` 的 `morphKey`。目标是在 PowerPoint Morph 中保留核心对象连续性：同一实体必须使用同一个 `!!objectName`，入场/退场对象要有清晰的 off-canvas 或透明状态。请列出应新增、复用、改名或删除的 Morph key，并说明对应元素的起止位置。

## 4. PPTX 导出 Prompt

请基于 `npm run validate:export -- --deck <deck-id>` 的报告审查 PPTX 导出质量。关注 slide 数、图片嵌入、中文 XML、`!!objectName`、Morph transition、unsupportedEffects。复杂 CSS 不阻断导出，但必须在 report warning 中有可解释 fallback。请给出最小改动清单。

## 5. 最终验收 Prompt

请作为发布前 reviewer 检查 `<deck-id>`。必须确认：`typecheck/build/validate:utf8/validate:decks/validate:assets/validate:layout/validate:export/validate:visual/smoke:browser` 通过；`dist/` 产物未入 git；中文未出现坏码；新作仅改 deck 目录；导出的 PPTX 仍以原生可编辑对象为主。最后给出 go/no-go 判断。
