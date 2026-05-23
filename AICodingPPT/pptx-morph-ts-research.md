# PPTX 平滑动效 TypeScript 原型方案调研

## 结论先行

本次方案是可行的，但目标要定义准确：我们不是用代码直接生成最终 PPTX，也不是把每页做成图片，而是先用 TypeScript 搭建一个“PPTX 放映语义原型”。它用原生可编辑元素的思路组织文字、形状、图标、图片和跨页状态，并在浏览器里预演接近 PowerPoint Morph 的平滑动效。最后人工把元素、命名和跨页状态 1:1 转移到 PowerPoint。

这条路线的关键价值是：先把顶级 PPT 的叙事节奏、元素层级、运动路径、焦点转移和视觉密度在代码里验证清楚，再进入 PowerPoint 精修。它避免了 AI 生图式 PPT 的不可编辑问题，也避免了直接写 PPTX 动画 XML 的高风险。

## PPT 制作正常的本质

优秀 PPT 的底层不是模板堆砌，而是三个系统同时成立：

1. 内容系统：每页只承担一个叙事动作，标题、主证据、辅助说明和视觉焦点的层级稳定。
2. 元素系统：文本框、形状、图片、图标、表格等都是可编辑对象，并且有统一坐标、字体、颜色、间距、命名和阅读顺序。
3. 运动系统：动画服务于“观众该看哪里”和“前后逻辑如何连续”，不是为了炫技。

这正好对应 PowerPoint 本身的对象模型：PPTX 是由 PresentationML 和 DrawingML 等 XML 部件组成的包，页面里的对象是形状树、文本、图片和关系资源，而不是天然的一张截图。Microsoft 的 Open XML 文档也说明，动画和切换信息位于 slide XML 的 `<transition/>` 和 `<timing/>` 中，动画模型与 SMIL 概念相近，是面向对象和时间的描述。

## PowerPoint Morph 的真实机制

Microsoft 官方对 Morph 的描述非常关键：Morph 用于在幻灯片之间创建平滑移动。要有效使用它，通常需要两页之间至少有一个共同对象，最稳的做法是复制上一页，然后在下一页移动、缩放或修改对象，再把 Morph 应用到第二页。

Morph 支持的对象包括文本、形状、图片、SmartArt 和艺术字，但官方明确说图表不参与 Morph。它可以在跨页之间平滑处理移动、缩放、旋转、翻转、颜色和格式变化；文字还可以设置按对象、词或字符进行 Morph。进入和退出也可以通过“新增对象、删除对象、把对象放到画布外”等方式模拟淡入、淡出、飞入和飞出。

高级控制点是命名。Microsoft 支持用自定义命名方案强制匹配相邻页上的对象，常见规则是用 `!!` 前缀命名对象。也就是说，我们的 TypeScript 原型必须从第一天就给每个可跨页对象设置稳定的 `morphKey`，后续转 PowerPoint 时就对应到选择窗格里的 `!!xxx` 对象名。

## 为什么不直接代码生成 PPTX Morph

理论上 PPTX 里确实存在动画和切换 XML；Microsoft 的 MS-PPTX 扩展文档也覆盖 slide transitions 和 slide animations。但实践上不建议把本阶段押在“直接写 Morph XML”上：

1. Morph 是 PowerPoint 的高级切换效果，内部匹配和兼容性有不少 Office 版本差异。
2. Office JavaScript API 目前主要暴露演示文稿、幻灯片、形状、表格、文本等对象管理能力，没有把 Morph/动画编辑作为稳定的高层 API。
3. PptxGenJS、officegen 一类库适合生成静态 PPTX，动画和 Morph 支持通常不是强项。
4. 决赛 PPT 的最终质量需要在 PowerPoint 里人工微调，手动转移反而更可控。

所以更稳的路线是“代码做放映语义和运动预演，PowerPoint 做最终承载”。

## TypeScript 放映原型应如何建模

建议把整个 PPT 当作一个受控数据结构，而不是一堆页面组件。核心数据模型：

```ts
type SlideElement = {
  id: string;
  morphKey?: string;
  kind: "text" | "shape" | "image" | "icon" | "group";
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  opacity?: number;
  z: number;
  style?: ElementStyle;
  content?: string;
  asset?: string;
};

type SlideSpec = {
  id: string;
  title: string;
  elements: SlideElement[];
  transition?: {
    type: "morph" | "cut" | "fade";
    durationMs: number;
    easing: string;
    textMorph?: "object" | "word" | "char";
  };
};
```

坐标建议使用 16:9 的固定设计坐标，例如 `1920 x 1080`，再按容器等比缩放。这样后续转到 PPT 时可以稳定换算到宽屏尺寸，避免响应式布局导致对象位置不确定。

## 浏览器端如何模拟 Morph

实现上用 FLIP 思路最接近 Morph：先记录上一页元素的几何状态，再渲染下一页元素状态，然后对同 `morphKey` 的对象计算位移、缩放、旋转和样式差值，最后播放补间动画。

最低可行 Morph 能力：

1. 匹配：`prev.elements[morphKey]` 对 `next.elements[morphKey]`。
2. 几何：插值 `x/y/w/h/rotate`。
3. 视觉：插值 `opacity/fill/stroke/textColor/fontSize`。
4. 进出场：只有上一页有的对象执行淡出或飞出；只有下一页有的对象执行淡入或飞入。
5. 文字：对象级先做；需要高级效果时再做 word/char split。
6. 图片裁切/缩放：用固定容器加 `object-position/object-size` 模拟。

技术选型上有三条路：

1. Web Animations API：官方浏览器 API，能用 JS 控制 keyframes、duration、easing、pause/play，适合我们自己掌控 Morph 引擎。
2. GSAP Flip：成熟 FLIP 工具，擅长跨布局状态动画，开发效率高，适合快速做复杂元素运动。
3. Motion for React：支持 `layout` 和 `layoutId` 共享布局动画，React 体验好，但要警惕过度依赖它的自动布局，导致后续难以 1:1 转 PPT。

View Transition API 也有参考价值，它能在 SPA 状态更新时捕获旧视图和新视图快照，并通过 `view-transition-name` 做共享元素过渡。但它更像浏览器级视图切换，对“精确模拟 PPT 对象属性”不如自建 FLIP 引擎可控。

## 和 PowerPoint 1:1 转移的约束

代码原型必须从一开始限制自己，只使用 PowerPoint 能稳定复刻的东西：

1. 文本：真实文本框，不把文字栅格化；限制字体、字号、行高和字重。
2. 图标：优先 SVG 路径或可转成 PPT 形状/图标的矢量资源。
3. 形状：矩形、圆角矩形、圆、线、箭头、简单路径。
4. 图片：明确裁切框、缩放方式和焦点位置。
5. 颜色：统一主题变量，不使用难以复刻的复杂滤镜。
6. 动效：只使用 Morph 可表达的移动、缩放、旋转、透明度、颜色和裁切变化。
7. 命名：所有跨页对象保留 `morphKey`，转 PPT 时命名为 `!!key`。

尽量避免 CSS-only 高级视觉，例如 `backdrop-filter`、复杂混合模式、动态粒子、真实 3D 透视、路径形变和浏览器字体特性。它们在网页里好看，但转到 PowerPoint 会失真。

## 推荐工作流

第一阶段：资料与叙事骨架。确定决赛答辩的页序、每页一句话结论、关键证据和需要平滑连接的对象。

第二阶段：元素资产库。准备图标、Logo、标题文字、关键数字、流程图节点、截图、装饰线和主题变量，并给资产建立命名规范。

第三阶段：TypeScript 原型。用 React + Vite + TypeScript 搭建 16:9 放映器，先实现 `SlideSpec`、舞台渲染、键盘翻页、当前页缩略调试和 Morph 引擎。

第四阶段：运动验证。逐页检查每一次转场是否真的帮助叙事，删掉没有信息价值的动画，保留“焦点转移”“结构展开”“因果推进”的动效。

第五阶段：人工转 PPTX。在 PowerPoint 里按相同元素、坐标、命名和跨页状态复刻，给第二页应用 Morph，逐页预览微调。

## 关键风险

1. 浏览器预演不是 PowerPoint 内核，最终 Morph 仍需在 PowerPoint 里验证。
2. 字体渲染和换行差异会影响 1:1 迁移，尤其是中文标题和长句。
3. PowerPoint 对分组、占位符、图表、复杂 SVG、裁切图片的 Morph 行为可能不稳定。
4. 如果网页原型过度依赖动态布局，迁移会变慢；必须坚持固定坐标和元素命名。
5. 如果动效太多，答辩现场会显得拖沓；动效应该只服务信息显现和论证推进。

## 可执行判断

这次应该采用“TypeScript 放映原型 + PowerPoint 手工落版”的路线。它的核心不是替代 PPT，而是把 PPT 最难的部分提前工程化：元素命名、跨页状态、平滑动效、叙事节奏和可复刻资产。只要我们严格限制元素能力边界，后续转入 PowerPoint 会比直接在 PPT 里反复试错更快，也更容易做出顶尖感。

## 参考资料

- Microsoft Support: Use the Morph transition in PowerPoint, https://support.microsoft.com/en-gb/office/use-the-morph-transition-in-powerpoint-8dd1c7b2-b935-44f5-a74c-741d8d9244ea
- Microsoft Support: Morph transition tips and tricks, https://support.microsoft.com/en-gb/office/morph-transition-tips-and-tricks-bc7f48ff-f152-4ee8-9081-d3121788024f
- Microsoft Learn: Working with animation in PresentationML, https://learn.microsoft.com/it-it/office/open-xml/presentation/working-with-animation
- Microsoft Learn: MS-PPTX overview, https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/b9ff79b4-5e24-4c85-b567-e5f43d498375
- Microsoft Learn: PowerPoint JavaScript API requirement set 1.8, https://learn.microsoft.com/en-us/javascript/api/requirement-sets/powerpoint/powerpoint-api-1-8-requirement-set
- MDN: Using the Web Animations API, https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API
- MDN: Using the View Transition API, https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
- GSAP Docs: Flip plugin, https://gsap.com/docs/v3/Plugins/Flip/
- Motion Docs: React layout animations, https://motion.dev/docs/react-layout-animations
- Material Design: Duration and easing, https://m1.material.io/motion/duration-easing.html
- Microsoft Support: Make PowerPoint presentations accessible, https://support.microsoft.com/en-US/accessibility/powerpoint/make-your-powerpoint-presentations-accessible-to-people-with-disabilities
