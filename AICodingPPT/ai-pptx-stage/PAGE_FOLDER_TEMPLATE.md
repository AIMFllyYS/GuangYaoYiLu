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
import { defineSlide, rect, text } from "../../../../deck/authoring";

const titleBlock = [
  rect({
    id: "title-underlay",
    morphKey: "!!title-underlay",
    name: "标题底板",
    x: 96,
    y: 82,
    w: 1040,
    h: 118,
    z: 1,
    style: {
      fill: "rgba(255,255,255,.06)",
      stroke: "rgba(70,201,255,.3)",
      strokeWidth: 2,
      borderRadius: 24
    }
  }),
  text({
    id: "main-title",
    morphKey: "!!main-title",
    name: "主标题",
    content: "AI Coding 决赛答辩",
    x: 120,
    y: 100,
    w: 980,
    h: 72,
    z: 2,
    style: {
      fontSize: 48,
      fontWeight: 800,
      color: "#ffffff"
    }
  })
];

export const slide = defineSlide({
  id: "001-opening",
  title: "开场",
  background: "#030405",
  transition: {
    type: "morph",
    durationMs: 900,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [...titleBlock]
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
