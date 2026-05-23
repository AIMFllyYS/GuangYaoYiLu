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
