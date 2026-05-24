# Page Folder Template

新建一页时，使用以下结构：

```text
pages/001-opening/
  page.ts
  notes.md
  assets/
```

`page.ts` 示例：

```ts
import { defineSlide, infoCard, pageNumber, sectionTitle } from "../../../../deck/authoring";

export const slide = defineSlide({
  id: "001-opening",
  title: "开场",
  background: "#F7FAF8",
  transition: {
    type: "morph",
    durationMs: 900,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    ...sectionTitle({
      id: "opening-title",
      kicker: "AI PPTX Stage",
      title: "AI Coding 决赛答辩"
    }),
    ...infoCard({
      id: "opening-card",
      title: "核心信息",
      body: "本页观点、证据、画面意图。",
      x: 120,
      y: 360,
      w: 720,
      h: 300
    }),
    ...pageNumber({ index: 1, total: 10 })
  ]
});

export default slide;
```

`notes.md` 应包含：

```md
# 001-opening

## 叙事目标

这一页要让观众理解……

## Morph 意图

- `!!main-title` 从上一页/下一页如何变化。
- 哪些元素在画布外作为起点或终点。

## PPTX 复刻注意

- PowerPoint 中对象命名。
- 需要手工近似的渐变、纹理或 SVG。
```

要求：

- `slide.id` 必须等于页面文件夹名。
- 所有跨页对象使用 `!!` 开头的 `morphKey`。
- 页面可写 helper，但最终必须输出 `SlideElement[]`。
- 可使用 `sectionTitle`、`infoCard`、`photoStrip`、`pageNumber`、`logoLockup`、`watermark` 等 presets；它们仍输出原生 `SlideElement[]`。
- 复杂 CSS 可以作为视觉近似，但导出时会进入 `unsupportedEffects`，不要让它承载唯一关键信息。
