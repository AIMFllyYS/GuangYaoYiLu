# AI PPTX Stage 审美强化提示词

请你接手 `D:\project\GuangYaoYiLus\GuangYaoYiLu\AICodingPPT\ai-pptx-stage` 项目，目标是对现有 “AI 原生 PPTX Morph 编排器” 做一轮高质量审美与交互打磨。

## 必读约束

开始前必须完整阅读并严格结合：

- `D:\project\AGENTS.md`
- `D:\project\globals.css`
- `D:\project\GuangYaoYiLus\GuangYaoYiLu\AICodingPPT\ai-pptx-stage\VERIFICATION.md`
- `D:\project\GuangYaoYiLus\GuangYaoYiLu\AICodingPPT\ai-pptx-stage\src\styles.css`
- `D:\project\GuangYaoYiLus\GuangYaoYiLu\AICodingPPT\ai-pptx-stage\src\deck\sampleDeck.ts`

尤其注意：

- 禁止破坏中文，所有新增/修改文件保持 UTF-8。
- 只修改 `AICodingPPT/ai-pptx-stage/` 内的文件，不碰 `new_web`、`决赛PPT/WorkShape`、素材库或其他工作区改动。
- 每完成一个明确阶段都要本地 commit。
- 不使用 AI 生图，不生成 PPTX，不引入 PPTX skill，不做真实 Office 编辑器。
- 该项目是给 AI 使用的 TS-first PPTX Morph 编排系统，TypeScript deck spec 是作品源文件，浏览器只是预览、调参、校验和 PPTX 手工复刻辅助。

## 当前项目能力

当前项目已经具备：

- Vite + React + TypeScript 独立项目。
- `defineDeck / defineSlide / text / rect / ellipse / line / image / icon / group` typed deck schema。
- 固定 `1920x1080` 幻灯片坐标系和画布外 pasteboard。
- 左侧图层面板，中间 stage，右侧 Inspector。
- 点击选中、拖动移动、隐藏、锁定、层级调整。
- Morph 放映预览，同 `morphKey` 对象跨页平滑变化。
- Inspector 展示 TS 数据、PPTX 英寸参数、选择窗格命名提示。
- 复制 TS patch、复制当前页 PPTX 手工复刻清单。
- `npm run typecheck`、`npm run build`、`npm run validate:decks`、`npm run validate:utf8`、`npm run smoke:browser` 验证脚本。

## 审美目标

请把它打磨成一个真正“顶尖 AI 演示编排工具”的界面，而不是普通后台工具。

视觉方向：

- 深色专业工具界面，参考真实 PPT 编辑场景：中间有固定幻灯片框，外部是可见工作区，画布外元素参与 Morph。
- 氛围应该像“AI 编排控制台 + 高级演示工作台”，安静、精密、有舞台感。
- 使用 `D:\project\globals.css` 中的设计变量思想和颜色体系，优先抽象成 CSS 变量；可以在本项目内建立映射变量，但不要直接照搬一整份全局 CSS。
- 避免一味紫蓝渐变，不要做廉价霓虹。重点是层级、边缘、透明度、空间、焦点态、图层信息密度。
- 不要把工具做成营销落地页，不要 hero 页面，不要大段说明卡片；第一屏必须就是可用的编辑器。

交互方向：

- 所有按钮必须是原生 `button`，纯图标按钮必须有准确 `aria-label`。
- 所有可聚焦控件要有可见 `:focus-visible`。
- 点击目标至少 24px，主要工具按钮建议 34-44px。
- 拖动时避免文本选择，拖拽态要清晰。
- 放映模式要明显，但不能打断演示预览。
- 动画必须尊重 `prefers-reduced-motion`。
- 普通 UI 动画只用 `transform` 和 `opacity`，不要使用 `transition: all`。
- 保留 Web Animations API Morph 核心，不要为了视觉改坏放映逻辑。

## 必须改进的重点

1. 重新设计顶部工具栏
   - 更像专业编辑工具，而不是普通 header。
   - 当前页、总页数、播放状态、缩放值、放映裁切模式要清晰。
   - 图标按钮使用 `lucide-react`，并补齐 `aria-label`。

2. 优化左侧图层面板
   - 图层行要更紧凑、更利于扫描。
   - 区分 `text / image / rect / ellipse / line / icon` 类型。
   - `morphKey` 是核心信息，必须视觉突出。
   - 锁定/隐藏/层级按钮要更清楚，hover/focus/active 状态完整。

3. 优化中间舞台
   - slide frame 和 pasteboard 的边界要更像 PPT 编辑环境。
   - 画布外元素要可见但不能喧宾夺主。
   - 选中态要高级，避免粗糙 outline。
   - 放映裁切模式要真正聚焦到固定页面，背景外元素被裁切的感觉要明确。

4. 优化右侧 Inspector
   - 信息密度要高，但不能乱。
   - 分区：AI Source、Geometry、PPTX Manual Sync、Validation。
   - 复制按钮要清晰反馈。
   - 校验信息需要有层级，不只靠颜色区分。

5. 统一视觉变量
   - 在 `src/styles.css` 中建立清晰变量层，例如 surface、border、text、accent、danger、warning、success。
   - 借鉴 `D:\project\globals.css` 的 `--color-ds-*`、`--geist-space-*`、radius、dark token 思路。
   - 不要破坏现有类名和测试选择器，尤其是 `.slide-frame`、`.editor-grid.is-show-mode`、`.morph-overlay`、`[data-element-id]`。

6. 修正现有不符合全局规则的地方
   - 去掉或替换 `transition: all`。
   - 补全图标按钮 `aria-label`。
   - 补全 focus-visible。
   - 对 `prefers-reduced-motion` 做降级。
   - 确保中文文本不溢出、不乱码。

## 禁止事项

- 不要重构成 Next.js。
- 不要接入 `new_web`。
- 不要改 deck schema 的核心字段含义。
- 不要把文字或元素改成图片。
- 不要删除 Morph、Inspector、图层、拖动、复制清单、校验器。
- 不要把放映器做成纯视觉 demo。
- 不要为了审美引入大型 UI 框架。
- 不要修改仓库中其他现有改动。

## 验证要求

完成后必须运行：

```bash
cd D:\project\GuangYaoYiLus\GuangYaoYiLu\AICodingPPT\ai-pptx-stage
npm run typecheck
npm run build
npm run validate:decks
npm run validate:utf8
npm run smoke:browser
```

如 `npm run smoke:browser` 前没有 dev server，先启动：

```bash
npm run dev -- --port 5173
```

浏览器检查至少确认：

- 页面首屏就是编辑器。
- 幻灯片框仍保持 16:9。
- 页面外元素仍可见。
- 选中元素后 Inspector 仍显示 TS/PPTX 参数。
- 拖动元素后参数变化。
- 放映裁切模式可用。
- ArrowRight 可触发 Morph 到第 2 页。
- 中文无乱码。

## 交付方式

请最终说明：

- 你改了哪些审美/交互层。
- 哪些全局约束来自 `D:\project\AGENTS.md` 和 `D:\project\globals.css`。
- 验证命令结果。
- 本阶段 commit hash。
