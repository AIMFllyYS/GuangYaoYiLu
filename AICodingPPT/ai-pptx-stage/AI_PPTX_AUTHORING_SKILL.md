# AI PPTX Authoring Skill

本文件是 `ai-pptx-stage` 的唯一 AI 创作协议。每次生成 TS 版 PPT 前，必须先阅读并遵守本文件。

## 目标

本项目不是 PPTX 生成器，也不是网页幻灯片工具。它是一个 AI 原生的 TS 版 PPTX 编排系统：

- TypeScript deck spec 是作品源文件。
- 浏览器负责预览、拖动调参、图层管理、Morph 验证和 PPTX 手工复刻参数展示。
- 最终真实 PPTX 由人工在 PowerPoint 中按 Inspector 参数和 `morphKey` 复刻。

## 允许修改范围

普通 PPT 创作任务只允许修改：

```text
src/decks/<deck-id>/**
```

禁止修改系统层，除非任务明确要求开发工具能力：

```text
src/App.tsx
src/components/**
src/deck/types.ts
src/deck/builders.ts
src/deck/pptx.ts
src/deck/morph.ts
src/styles.css
scripts/**
```

## Deck 文件夹协议

一套 TS 版 PPT 必须是一个独立文件夹：

```text
src/decks/<deck-id>/
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

要求：

- `<deck-id>` 使用小写 kebab-case。
- `deck.ts` 是该套 PPT 的入口。
- `pages/*` 按 `001-name`、`002-name` 排序。
- 每个页面文件夹只表示一页 PPT。
- 页面素材优先放在该页自己的 `assets/`，全局素材放在 deck 根目录 `assets/`。

## Page 编码协议

每个 `page.ts` 必须导出一个 `SlideSpec`：

```ts
import { defineSlide, text, rect } from "../../../deck/authoring";

export const slide = defineSlide({
  id: "001-opening",
  title: "开场",
  background: "#030405",
  transition: {
    type: "morph",
    durationMs: 900,
    easing: "cubic-bezier(.22,1,.36,1)"
  },
  elements: [
    text({
      id: "main-title",
      morphKey: "!!main-title",
      content: "AI Coding 决赛答辩",
      x: 120,
      y: 90,
      w: 980,
      h: 90
    }),
    rect({
      id: "title-underlay",
      morphKey: "!!title-underlay",
      x: 96,
      y: 82,
      w: 1040,
      h: 118
    })
  ]
});

export default slide;
```

要求：

- `slide.id` 必须等于页面文件夹名。
- 坐标统一使用 `1920 x 1080`。
- 页面外元素允许存在，可用于 Morph 飞入、飞出、放大或背景推进。
- 所有元素必须有稳定 `id`。
- 跨页 Morph 元素必须有稳定 `morphKey`。
- `morphKey` 必须以 `!!` 开头，和 PowerPoint 选择窗格对象名一致。
- 文字必须使用 `text()`，禁止把文字做成图片。

## 审美自由边界

允许在页面文件夹内写高级 TypeScript 审美 helper：

```text
pages/001-opening/
  page.ts
  layout.ts
  components.ts
  palette.ts
```

允许：

- 用函数批量生成背景、星芒、机械环、对话组、标签、信息卡。
- 用循环和数组生成复杂层级。
- 用 SVG data URI 做图标或纹理，但必须保留 PPTX 手工复刻提示。
- 用页面外大元素参与 Morph。

禁止：

- 在 `page.ts` 里 import React。
- 在页面里直接写 DOM、JSX、CSS 注入或操作浏览器 API。
- import `src/App.tsx`、`src/components/**`、`src/styles.css`。
- 修改系统渲染器来迁就某一页。
- 使用 PPTX 难复刻的浏览器专属效果作为核心信息承载。

一句话：可以自由写审美代码，但最终必须通过 authoring API 输出 PPTX-compatible `SlideElement[]`。

## Authoring API

普通页面只允许从以下入口导入：

```ts
import {
  defineDeck,
  defineSlide,
  text,
  rect,
  ellipse,
  line,
  image,
  icon,
  group,
  wide16x9
} from "../../../deck/authoring";
```

相对路径按页面深度调整，但必须指向 `src/deck/authoring.ts`。

## 验证

每次创作或修改完成后必须运行：

```bash
npm run typecheck
npm run build
npm run validate:utf8
npm run validate:decks
```

涉及交互、放映、缩放、Morph、Inspector 时，还必须启动 dev server 后运行：

```bash
npm run smoke:browser
```

## 交付说明

最终回复必须说明：

- 新增或修改了哪套 deck。
- 新增或修改了哪些页面。
- 是否只改动了 `src/decks/<deck-id>/**`。
- 验证命令结果。
- 本阶段 commit hash。
