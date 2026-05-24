# Deck Authoring Area

`src/decks/` 是 AI 创作 TS 版 PPT 的唯一合法区域。

普通 PPT 创作任务只允许在这里新增或修改：

```text
src/decks/<deck-id>/**
```

不要修改：

```text
src/App.tsx
src/components/**
src/deck/**
src/styles.css
scripts/**
```

系统层升级任务可以修改上述文件；普通新作不要修改。

## 快速新建

```bash
npm run deck:new -- --id <deck-id> --title "<PPT 标题>" --slides <n>
npm run ai:brief -- --deck <deck-id>
```

脚手架会生成 `deck.ts`、`theme.ts`、`README.md`、`assets/` 和每页 `page.ts/notes.md`。Deck selector 会通过 `import.meta.glob` 自动发现新 deck，不需要改中心注册文件。

## 目录协议

每套 PPT：

```text
<deck-id>/
  deck.ts
  theme.ts
  README.md
  assets/
  pages/
    001-opening/
      page.ts
      notes.md
      assets/
```

每个页面文件夹代表一页。页面按 `001-name`、`002-name`、`003-name` 排序。

## 编码协议

- 页面必须导出 `SlideSpec`。
- `slide.id` 必须等于页面文件夹名。
- 坐标使用 `1920 x 1080`。
- 文本使用 `text()`，不要做成图片。
- 跨页 Morph 元素使用 `!!` 开头的 `morphKey`。
- 页面可以自由写 TypeScript helper，但最终必须通过 authoring API 输出 PPTX-compatible 元素。

## 导出与校验

```bash
npm run export:pptx -- --deck <deck-id>
npm run validate:assets -- --deck <deck-id>
npm run validate:layout -- --deck <deck-id>
npm run validate:export -- --deck <deck-id>
```

导出的 `.pptx`、报告、截图和 AI brief 都写入 ignored `dist/`。复杂 CSS 允许降级，但必须进入导出 report 的 `unsupportedEffects`。
