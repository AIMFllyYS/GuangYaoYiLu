# New Deck Workflow

## 1. Scaffold

```bash
npm run deck:new -- --id <deck-id> --title "<PPT 标题>" --slides <n>
npm run ai:brief -- --deck <deck-id>
```

只在 `src/decks/<deck-id>/**` 内创作。系统层能力升级另开任务。

## 2. Author

- 在每页 `notes.md` 写叙事目标、素材需求、Morph 意图和导出风险。
- 在 `page.ts` 使用 `defineSlide` 与 `text/rect/ellipse/line/image/icon/group`。
- 常见结构优先用 `sectionTitle`、`infoCard`、`photoStrip`、`pageNumber`、`logoLockup`、`watermark`。
- 图片放在 deck 或页面 `assets/`，文字保持原生 `text()`。
- 跨页连续对象使用相同 `!!morphKey`。

## 3. Local AI Review

Prompt 包位于 `prompts/review-prompts.md`：

- 创作前 brief
- 逐页审美 review
- Morph 复刻 review
- PPTX 导出 review
- 最终验收 review

## 4. Validate And Export

```bash
npm run typecheck
npm run validate:utf8
npm run validate:decks
npm run validate:assets -- --deck <deck-id>
npm run validate:layout -- --deck <deck-id>
npm run validate:export -- --deck <deck-id>
npm run export:pptx -- --deck <deck-id>
```

浏览器验收：

```bash
npm run dev -- --port 5173
npm run smoke:browser
npm run validate:visual -- --deck <deck-id> --pages 1,3,5
```

发布前运行：

```bash
npm run verify
```

所有 `.pptx`、报告、截图和 AI brief 都在 ignored `dist/`。
