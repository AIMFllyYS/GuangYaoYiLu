# 光药医路 PPT · Codex 通用工作流规范

> 本文档是交给 Codex 的**主任务说明**，每次新会话开始时完整提供。
> 配合 `SLIDE_CATALOG.md` 一起使用（每页的具体细节在那里查找）。

---

## 一、项目背景

**项目名称**：光药医路 · 三支部联合答辩 PPT
**总页数**：22 页（16:9）
**目标产物**：每页一个可编辑的 `.pptx`，最终合并为完整 pptx

**目录结构（仓库整理后；canonical 多页资源在 `交付物/快速答辩`，legacy 单页实验在 `交付物/答辩PPT_legacy`）**：

```
交付物/快速答辩/
  full-all-slides/newXX.png        ← 快速答辩全页底图（build_pptx 使用）
  layers/slide_XX/                 ← 照片层与 logo（与脚本一致）
  build_pptx.py

交付物/答辩PPT_legacy/
  new_full_slides/slide_XX.png     ← 历史：STEP 1 重生成的干净版
  layers/slide_01/                 ← 仅保留第 1 页分层示例
  single_slides/slide_01.pptx
  preview/slide_01_preview.png
  prompt/                          ← 本目录（提示词规范）
  scripts/build_slide_01.py
```

---

## 二、全局硬性规则（任何步骤均不得违反）

### 画布规格

| 参数 | 值 |
|---|---|
| 像素尺寸 | **1920 × 1080 px**（16:9） |
| pptx 宽高 | **13.333 × 7.5 英寸** |
| EMU 换算 | 1 px = 4762.5 EMU（横向）≈ 4762 EMU（纵向） |
| 颜色模式 | RGB（图片层）/ 系统字体 RGB（文本框） |

### 永远不做的事

- ❌ 右下角任何页码（"XX/22"、"第X页"等一概不出现）
- ❌ 左上角任何占位框文字（"校徽位置预留区"等彻底消除）
- ❌ 从 `full-all-slides/` 中裁切元素（只做视觉参考）
- ❌ 把**正文段落、感悟语录**烧入图片层（STEP 3 文本框处理）
- ❌ 删除或替换艺术大字（书法标题是视觉核心，STEP 1 必须保留）
- ❌ 整页只放一张大图的 pptx（必须多 shape 分层）

### 品牌色系

```
浅米纸色  RGB(246, 241, 226)    ← 背景底色基准
深绿/药草绿 RGB(45, 106, 69)    ← 主色
思政红    RGB(174, 38, 43)      ← 强调色
金色      RGB(185, 143, 70)     ← 点缀色
墨色      RGB(47, 55, 43)       ← 深色文字
华科蓝    RGB(0, 84, 135)       ← HUST Logo 专用
```

### 三支部规范称呼（所有文字层必须严格使用，不得简化或变体）

| 全称 | 允许的简称 | 禁止写法 |
|---|---|---|
| 药学（中外合作办学）2503班团支部 | 药学（中外）2503 | 药学2503、药学班、中外2503 |
| 光电信息科学与工程2506班团支部 | 光电2506 | 光电班、2506班 |
| 基础医学（强基计划实验班）2501班团支部 | 基医（强基）2501 | 基医2501、强基班、基础医学2501 |
| 三支部合称 | 联合团支部 / 光药医路联合支部 | 三个班、联合班 |

> 注意：两处括号均为**中文括号**（）且必须保留，不得省略。

---

## 三、STEP 1 · 用 gpt-image-2 重新生成干净版底图

**目的**：生成无污染、抠图友好的新版底图，存入 `new_full_slides/`。

### 调用规范

每次调用 gpt-image-2 时，提供：
1. `full-all-slides/slide_XX.png` 作为**视觉参考输入**
2. 下方的**文字指令**

### 通用文字指令模板（每页必须包含）

```
【风格锁定——最高优先级，所有其他指令服从于此】
参考图是唯一的风格标准。输出图必须在以下所有维度与参考图保持一致，
文字指令只描述需要改变的内容（去掉什么、加什么），
不改变的视觉质感以参考图为准，不重新诠释：

  · 笔触质感：写实水墨插画 + 工笔渲染，有宣纸颗粒感和墨色晕染层次
  · 细节密度：信息层次丰富、装饰元素精细，禁止简化
  · 光影处理：元素有立体感和光影层次，禁止纯色平铺
  · 色彩过渡：有渐变与渲染，禁止色块分割式填色
  · 人物风格：写实古风仕女插画，飘逸衣裙、发光质感，有衣纹细节
              禁止用几何形体、抽象图形、折纸形态替代人物
  · 书法文字：真实毛笔笔触，有飞白、墨迹深浅变化，禁止描边扁平字体

【绝对禁止的风格】：
  扁平设计 / 矢量图 / 几何色块 / 简化轮廓 / 剪纸风 / 卡通风 / 低细节密度插画

重新生成要求：
1. 构图与内容布局与参考图保持一致（主要元素位置、比例不变）。
2. 【必须】左上角区域保持干净留白（约 320×90px 范围），不放任何文字、框线或装饰——此区域将叠加 HUST 官方 logo。
3. 【必须】右下角不出现任何页码数字或页码框（参考图中如有"XX/22"或占位框，全部去除）。
4. 【文字规则】——分三类处理：
   a. 【必须保留】艺术大字（书法/毛笔风格的大标题，如"光药医路""初识白"等）：
      必须出现在画面中，这是设计的视觉骨骼。保留笔触质感、飞白、墨迹等艺术特征。
      可在原设计基础上进行风格优化，但不得删除或替换。
   b. 【可选添加】装饰性短文字（参考逐字稿）：
      信息图节点标签（如"壹/主题贯穿"）、单行副标题短句、图示说明文字等，
      可根据版面需要适度添加，令画面内容更完整、可读。
   c. 【禁止出现】以下文字：
      - 页码（"XX/22"、"第X页"等任何形式）
      - 占位框说明文字（"校徽位置预留区"等）
      - 3行以上的正文段落（将在 STEP 3 通过 python-pptx 文本框添加）
      - 手写感悟语录（将在 STEP 3 通过 python-pptx 文本框添加）
5. 排版微调以利于元素分离：
   a. 大型装饰元素（茶壶、植物、人物、插画）放置在背景色相对简洁的区域，与背景有明显轮廓对比。
   b. 背景纹样（山水、金色光迹）保持在底层，不与主体装饰元素重叠融合。
   c. 照片留白框（如有）的边框清晰，框内保持纯白/纯米色，周边装饰不侵入框内。
6. 输出尺寸：1920×1080 px，横向，无透明通道（opaque）。
7. 高质量，细节精致。

【本页特定说明】：（此处填写 SLIDE_CATALOG.md 中该页的 STEP1_NOTE）
```

### 输出

- 保存路径：`交付物/答辩PPT_legacy/new_full_slides/slide_XX.png`
- 每页生成后，人工目视检查：
  - 艺术大字清晰呈现 ✓
  - 无页码 ✓
  - 无占位框文字 ✓
  - 左上角干净（约 320×90px 净空）✓
  - 整体版式与参考图方向一致 ✓

---

## 四、STEP 2 · 分元素单独生成各层 PNG

**目的**：以 `new_full_slides/slide_XX.png` 为设计蓝图，逐元素单独生成透明底 PNG。

### 元素分类与规则

#### A 类：图片层（PNG 文件，叠放进 pptx）

| 元素 | 文件名 | 透明底 | 说明 |
|---|---|---|---|
| 背景纹样 | `background.png` | 否（不透明） | 全 1920×1080，含山水纹理、底色，无任何文字 |
| 装饰边框/丝带 | `deco_border.png` | 是（RGBA） | 全画布，透明区域 alpha=0 |
| 装饰植物/物件 | `deco_props.png` | 是（RGBA） | 茶壶、药材、植物等装饰物 |
| **艺术大字** | `art_title.png` | 是（RGBA） | 参照 new_full_slides 中的艺术字风格，**单独重新生成**（不从合成图裁切），透明底，保留完整笔触/飞白质感 |
| 插画人物 | `figure.png` | 是（RGBA） | 瑶光等人物形象，轮廓清晰 |
| 信息图形 | `infograph.png` | 是（RGBA） | 圆形图示、流程图等 |

> **所有 PNG 画布尺寸必须是 1920×1080**（不裁剪，保留全画布，元素外透明）。

#### B 类：业务素材（直接引用，不重新生成）

| 元素 | 来源 | 放置规则 |
|---|---|---|
| HUST Logo | `layers/slide_XX/hust_logo.png` | 左上角，x=46px, y=24px, w=270px, h=65px |
| 活动照片 | `layers/slide_XX/photo_XX.png` | 按该页照片框 bbox 放置（见 manifest.json）|

#### C 类：文本框（python-pptx，不进图片）

| 类型 | 内容来源 | 字体 | 是否转文本框 |
|---|---|---|---|
| 副标题/小标题 | 逐字稿对应章节 | 微软雅黑 | ✅ 必须 |
| 正文段落 | 逐字稿对应章节 | 宋体 | ✅ 必须 |
| 感悟语录 | 逐字稿对应章节 | 华文行楷（手写体感） | ✅ 必须 |
| **艺术大字** | — | — | ❌ 图片层，不转文本框 |
| 页码 | — | — | ❌ 不加 |
| 标签贴片文字 | 逐字稿 | 微软雅黑 | ✅ 必须（如"清理广告"等标签） |

### 生成顺序（从底到顶，z-index）

```
z=0   background.png          ← 背景纹样，不透明
z=10  deco_border.png         ← 装饰边框/底部丝带（透明）
z=20  deco_props.png          ← 装饰物件，茶壶等（透明）
z=30  figure.png              ← 人物插画（透明）
z=40  infograph.png           ← 信息图形（透明，如有）
z=50  art_title.png           ← 艺术大字（透明）
z=60  hust_logo.png           ← HUST logo（业务素材）
z=70  photo_01~N.png          ← 活动照片（业务素材）
z=80  [文本框]                 ← 所有可编辑文字
```

### 输出 manifest.json（每页必须生成）

```json
{
  "slide": 1,
  "canvas": {"w": 1920, "h": 1080},
  "layers": [
    {
      "id": "background",
      "file": "background.png",
      "bbox": {"x": 0, "y": 0, "w": 1920, "h": 1080},
      "z": 0,
      "type": "image",
      "transparent": false
    },
    {
      "id": "art_title",
      "file": "art_title.png",
      "bbox": {"x": 120, "y": 80, "w": 900, "h": 320},
      "z": 50,
      "type": "image",
      "transparent": true
    }
  ],
  "textboxes": [
    {
      "id": "subtitle",
      "content": "瑶光引路·汇聚光药医路的青年力量",
      "bbox": {"x": 200, "y": 420, "w": 800, "h": 60},
      "z": 80,
      "font": "微软雅黑",
      "font_size": 24,
      "color": "RGB(45,106,69)",
      "align": "center"
    }
  ],
  "photo_slots": [
    {
      "id": "photo_01",
      "file": "photo_01.png",
      "bbox": {"x": 80, "y": 200, "w": 640, "h": 480},
      "z": 70,
      "radius": 22
    }
  ]
}
```

---

## 五、STEP 3 · 单页组装与审核

**目的**：用 python-pptx 把各层拼装为单页 `.pptx`，生成预览图供人工审核。

### 脚本规范

每页生成 `scripts/build_slide_XX.py`，执行后产出：
- `single_slides/slide_XX.pptx`
- `preview/slide_XX_preview.png`（Pillow 合成所有图层 + 模拟文字位置）

### python-pptx 关键参数

```python
from pptx import Presentation
from pptx.util import Emu, Pt
from pptx.dml.color import RGBColor

prs = Presentation()
prs.slide_width  = Emu(9144000)   # 13.333 inch
prs.slide_height = Emu(5143500)   # 7.5 inch

# px → EMU 换算（以 1920×1080 为基准）
def px_to_emu_x(px): return int(px * 9144000 / 1920)
def px_to_emu_y(px): return int(px * 5143500 / 1080)
```

### 图片放置规则

```python
# 以 manifest.json 中的 bbox（px）为准，转换为 EMU 放置
slide.shapes.add_picture(
    image_file,
    left   = px_to_emu_x(bbox['x']),
    top    = px_to_emu_y(bbox['y']),
    width  = px_to_emu_x(bbox['w']),
    height = px_to_emu_y(bbox['h'])
)
```

### 文本框放置规则

```python
from pptx.util import Pt
from pptx.enum.text import PP_ALIGN

txBox = slide.shapes.add_textbox(left, top, width, height)
tf = txBox.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.text = "文字内容"
p.alignment = PP_ALIGN.LEFT   # 或 CENTER / RIGHT
run = p.runs[0]
run.font.name = "微软雅黑"
run.font.size = Pt(24)
run.font.color.rgb = RGBColor(45, 106, 69)
```

### 审核标准（每页交付前自动验证）

```python
# 验证项
assert slide_shape_count['sp'] > 0, "必须有文本框"
assert slide_shape_count['pic'] > 1, "必须有多个图片层"
assert hust_logo_present, "必须有 hust_logo"
assert no_page_number_in_images, "图片层不含页码"
```

### 审核流程

```
Codex 生成 → 输出 preview/slide_XX_preview.png
           → 用户目视检查
           → 满意：进入 slide_(XX+1)
           → 不满意：反馈具体问题 → Codex 仅修改本页 → 重新预览
```

---

## 六、STEP 4 · 最终合并

当全部 22 页审核通过后，执行合并：

```python
from pptx import Presentation

# 按顺序合并22个单页pptx
# 注意：python-pptx 不原生支持 merge，使用 pptx-merge 或手动复制 slide XML
# 推荐方案：用 lxml 直接操作 OOXML，把每页 slide XML 复制进主 pptx

# 验收：
# - 共 22 页
# - 每页尺寸一致（9144000 × 5143500 EMU）
# - 每页 sp（文本框）数量 > 0
# - 输出 shape 统计报告
```

输出：`交付物/答辩PPT_legacy/光药医路_final.pptx`

---

## 七、单页请求格式（每次只触发一页）

```
生成 slide_XX。

当前任务：STEP [1/2/3]
参考图：`交付物/快速答辩/full-all-slides/` 或 legacy 导出的全页图
新底图（STEP2/3时使用）：`交付物/答辩PPT_legacy/new_full_slides/slide_XX.png`
补充素材：**优先** `交付物/快速答辩/layers/slide_XX/`（与快速答辩一致）；仅 slide_01 特殊分层见 `交付物/答辩PPT_legacy/layers/slide_01/`
逐字稿：`交付物/答辩PPT_legacy/prompt/SLIDE_CATALOG.md` → slide_XX 章节

请按 MASTER_WORKFLOW.md 中对应 STEP 的规范执行，完成后输出：
  ✓ 文件路径列表
  ✓ manifest.json 摘要
  ✓ 验证结果
等待审核反馈后再进入下一页。
```
