# 决赛 PPT 的 AI Coding 探索路径

本目录记录「光药医路」决赛 PPT 从传统制作、分层复刻、图片优先，到最终沉淀为独立 AI PPTX 生产平台的探索过程。

最终独立项目仓库：

[https://github.com/AIMFllyYS/ai-pptx-stage](https://github.com/AIMFllyYS/ai-pptx-stage)

本仓库主项目：

[https://github.com/AIMFllyYS/GuangYaoYiLu](https://github.com/AIMFllyYS/GuangYaoYiLu)

## 为什么单独做这个目录

决赛 PPT 不是简单的“把总结书内容搬到幻灯片”。它同时要求：

- 中文内容准确，不乱码。
- 主题叙事清楚，能体现联合支部成长。
- 视觉足够强，适合答辩现场。
- PPTX 尽量可编辑，而不是一整页死图。
- Morph 动效和对象命名能在 PowerPoint 中稳定复现。
- 过程可复用，不只服务本次「光药医路」。

所以这里的工作重点，不只是做出一份 PPT，而是把“AI 怎么可靠生产 PPT”这件事做成一个可持续的方法。

## 探索路径一：传统 PPT 与人工复刻

最早的路径是常规 PPT 制作：人工整理内容、选图、排版，再在 PowerPoint 中逐页调整。

这个路径的优点是稳，所有内容都在 PowerPoint 原生环境里；缺点也很明显：

- 30 页以上内容很难快速重构。
- Morph 对象命名和跨页连续性靠人工记忆，容易乱。
- 视觉方案改一轮就要大量重复劳动。
- AI 只能给建议，很难直接变成可验证的工程产物。

这条路适合最后人工润色，但不适合高强度迭代。

## 探索路径二：分层 PPTX Skill

第二条路是 `pptx-layer-merge` 方向：把页面拆成 manifest、底图、文字层、图片层，再由脚本组装成 PPTX。

它解决了两个大问题：

- 能把页面拆成可管理的层。
- 能用脚本检查 PPTX 包结构，减少打不开、损坏、丢层的问题。

这个方向沉淀在：

```text
skills/pptx-layer-merge/
```

它对“高端 PPTX 分层组装”很有价值，也适合做交付物级别的分层合并。但它更偏向“已有视觉稿如何变成 PPTX”，还不是一个完整的新作 PPT 创作平台。

## 探索路径三：图片优先方案

第三条路是图片优先：先生成或设计整页视觉，再把整页作为背景放进 PPT。

这个路径的优点是：

- 视觉冲击力最容易拉高。
- 复杂风格、光影、海报感、纹理都比较好做。
- 对 AI 图像生成和视觉排版很友好。

但它的问题也很硬：

- 文字不可编辑。
- 后期改字成本高。
- PPTX 文件更像图片册。
- Morph 很难细到对象级。
- 答辩现场临时修改不方便。

所以它适合封面、章节页、强视觉页，但不适合作为全项目唯一方案。

## 探索路径四：TS Deck + 浏览器预览

第四条路是把 PPT 当成一个 TypeScript deck 来写。

页面不是直接在 PPT 里拖，而是写成：

```text
src/decks/<deck-id>/pages/<page-id>/page.ts
```

每个元素都有：

- `id`
- 坐标
- 尺寸
- 层级
- 样式
- `morphKey`
- PPTX 同步信息

浏览器负责预览、选中、拖拽、看图层、看 Inspector、检查 Morph。

这条路最大的价值是：PPT 开始变成可验证、可复用、可被 AI 修改的工程文件。

## 最终路径：AI PPTX Stage

最后我们把第四条路做满，形成了 `ai-pptx-stage`。

它现在有三套体系：

### 1. 真实可编辑 PPTX 生产体系

- 使用 PptxGenJS 生成真实 `.pptx`。
- 文本、矩形、圆形、线条、图片尽量导出为 PowerPoint 原生对象。
- 使用 `objectName` 写入 `!!morphKey`。
- 使用 JSZip / OOXML 后处理写入 Morph transition。
- 复杂渐变、阴影、浏览器专属效果不硬失败，而是写入导出报告。

常用命令：

```bash
npm run export:pptx -- --deck guang-yao-yi-lu-final-defense
```

### 2. 结构、视觉、导出校验体系

平台会检查：

- TypeScript 类型。
- 构建是否通过。
- 中文 UTF-8 是否有坏码。
- deck 目录结构是否规范。
- 图片是否缺失或不可读。
- 文本框是否明显溢出。
- PPTX zip 结构是否完整。
- slide 数是否正确。
- 图片是否嵌入。
- `!!objectName` 是否保留。
- Morph transition 是否写入。
- 浏览器 smoke 是否通过。
- 指定页面视觉抽帧是否正常。

总闸：

```bash
npm run verify
```

### 3. AI 本地创作工作流体系

这个体系不接模型 API，不放密钥。它只做本地工作流：

- `deck:new` 新建 deck。
- `ai:brief` 生成可交给 Codex/AI 的摘要。
- `prompts/review-prompts.md` 提供五类 review prompt。
- `sectionTitle`、`infoCard`、`photoStrip`、`pageNumber` 等 presets 提供常见页面结构。

新建一套 PPT：

```bash
npm run deck:new -- --id my-new-deck --title "我的新PPT" --slides 10
npm run ai:brief -- --deck my-new-deck
```

## 光药医路决赛 PPT 在这里的角色

`guang-yao-yi-lu-final-defense` 是这套平台的压力样例。

它不是一个随手 demo，而是一个真实项目验证集：

- 30 页。
- 大量中文。
- 多种图片素材。
- 多章节叙事。
- 真实答辩语境。
- Morph 对象命名与跨页连续。
- 导出后仍要保持 PPTX 可检查、可编辑、可复核。

也就是说，光药医路决赛 PPT 不只是被这个工具服务，它也反过来把这个工具逼成了真正能用的平台。

## 为什么最后要拆出独立仓库

`GuangYaoYiLu` 是具体项目归档，里面包含团支部材料、总结书、交付物、素材、工具和历史过程。

`ai-pptx-stage` 已经超出了单次答辩 PPT 的范围。它可以服务以后任何新作 PPT，所以单独拆成仓库：

[https://github.com/AIMFllyYS/ai-pptx-stage](https://github.com/AIMFllyYS/ai-pptx-stage)

拆分后的好处：

- 可以独立安装依赖。
- 可以独立升级导出器和校验器。
- 不再被本项目的大量素材、总结书、历史交付物干扰。
- 可以作为通用 AI PPTX 生产平台继续演进。

本仓库仍保留 `AICodingPPT/ai-pptx-stage` 作为光药医路项目内的完整历史版本；独立仓库用于后续平台化开发。

## 当前推荐使用方式

如果只是看光药医路项目：

```text
继续在 GuangYaoYiLu 仓库阅读归档和交付物。
```

如果要继续开发 AI PPTX 工具：

```bash
cd D:\new_project\ai-pptx-stage
npm install
npm run dev
```

如果要做新的 PPT：

```bash
npm run deck:new -- --id <deck-id> --title "<PPT标题>" --slides <页数>
npm run ai:brief -- --deck <deck-id>
npm run export:pptx -- --deck <deck-id>
```

一句话总结：

> 光药医路决赛 PPT 是起点，AI PPTX Stage 是沉淀出来的通用生产工具。
