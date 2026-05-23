# image-2 第二轮重生提示词规则

整理日期：2026-05-23

## 1. 总原则

第二轮仍然坚持用户指定路线：每页由 image-2 直接生成完整 16:9 PPT 页面图。  
但生产逻辑要从“生成漂亮内容”改为“基于真实素材生成顶尖答辩页面”。

核心句：

```text
Generate a complete 16:9 Chinese PowerPoint defense slide as one final slide image, using the provided real project materials as the only factual evidence. Do not invent event photos, data, logos, documents, QR codes, people, banners, or awards.
```

## 2. 每页通用 Prompt 骨架

```text
Use case: productivity-visual
Asset type: complete 16:9 PowerPoint slide image, final slide-page visual
Project: 光药医路，大学生项目决赛答辩
Language: Chinese only
Style: premium academic defense PowerPoint, green guofeng Chinese medicine visual system, clean modern reporting layout, credible and evidence-based
Canvas: 16:9 widescreen, high-resolution slide image

Page title:
【本页标题】

Core conclusion:
【本页一句话结论】

Required visible text:
【只列终稿必须出现的文字，尽量少】

Real materials to use:
【真实照片/问卷/海报/logo/截图的角色说明】

Layout:
【标题区、证据区、结论区、logo区】

Evidence rule:
Use only the provided real photos/screenshots/logos/charts as factual evidence. Do not create new realistic event photos or fake documents.

Text rule:
Render the Chinese text clearly and exactly. Avoid tiny paragraphs. No English. No gibberish. No random extra text.

Design rule:
Must look like a real competition defense PPT slide, not a poster, not a social-media cover, not a generic AI illustration.

Negative constraints:
No fake QR code, no fake official seal, no fake school logo, no invented policy document text, no fake survey numbers, no invented activity banners, no watermark, no page number unless requested.
```

## 3. 真实素材输入规则

### 3.1 封面

输入：

- 真实双 logo。
- 真实合照 2-4 张。

要求：

- image-2 可以把合照处理成半透明、朦胧、电影感背景。
- 不得生成“校徽放置处”。
- 不得生成假校徽。

### 3.2 调研页

输入：

- 真实问卷截图。
- 真实统计结果，最好先整理成数字表。

要求：

- 如果没有真实数字，就不要画百分比图。
- 可以做“五大维度洞察”结构图，不生成假饼图。

### 3.3 政策页

输入：

- 真实可引用政策名称或来源截图。

要求：

- 不生成具体领导人面部。
- 不生成仿真红头文件正文。
- 用“政策关键词 + 项目响应路径”表达。

### 3.4 人员/文宣页

输入：

- 真实 logo。
- 真实海报。
- 真实瑶光助手形象。

要求：

- 不生成 LOGO 占位。
- 不重新发明海报和 mascot。

### 3.5 活动页

输入：

- 真实现场照片。
- 真实宣传物料。

要求：

- 只把真实照片排成高级照片墙。
- AI 不生成新的现场照片。
- 每页最多一张主图 + 3-5 张辅图。

### 3.6 网站页

输入：

- 当前网站真实截图，或项目原型图。

要求：

- 必须显著写“建设中”或“功能原型”。
- 不要让评委误解为已经正式上线。

## 4. 每页重生目标

### PPT1 封面

目标：正式、有记忆点、真实合照半透明背景。

标题：

```text
金光青黛同济兴，百草杏林华夏清
```

保留文字：

```text
光药医路
药学（中外）2503、光电2506、基础医学（强基）2501班团支部
答辩时间：2026.5.24
```

### PPT2 调研

目标：真实问卷证据 + 三条结论。

建议标题：

```text
趣味调研显示：青年愿意了解中药，但更需要轻量化、体验式入口
```

### PPT3 政策

目标：政策背景可信、不冒用仿真红头。

建议标题：

```text
政策引领：青年实践回应中医药传承创新命题
```

### PPT4 三支部组成

目标：75人、名称由来、真实文宣一页讲清。

建议标题：

```text
三支部同行：75名青年共建“光药医路”
```

### PPT5 嘉年华路演

目标：真实现场主图 + 三个游戏。

建议标题：

```text
嘉年华路演：把中药文化变成可参与的青春体验
```

### PPT6 叶开泰博物馆

目标：真实照片流 + 实地探访路径。

建议标题：

```text
走进叶开泰博物馆：在实地探访中理解本草传承
```

### PPT7 青暖冬日

目标：真实地图/路线 + 母校宣讲/实地考察证据。

建议标题：

```text
青暖冬日：从母校宣讲到实地考察的实践路线
```

### PPT8 科普网站

目标：建设中产品页，不夸大成熟度。

建议标题：

```text
科普网站：把“光药医路”延展为可持续数字入口
```

### PPT9 社区服务

目标：真实社区服务照片墙 + 团学践行。

建议标题：

```text
社区志愿服务：用实际行动回应基层需求
```

### PPT10 结尾

目标：真实照片电影幕布流 + 情绪收束。

建议标题：

```text
光药医路，青春同行
```

保留口号：

```text
以光启智，以药济人，以医护心
谢谢聆听
```

## 5. 单页验收口令

每页生成后都按这 8 个问题判断：

1. 是否像真实答辩 PPT，而不是宣传海报？
2. 是否有明确的一句话结论？
3. 是否使用真实素材证明事实？
4. 是否出现了假照片、假数据、假文件、假 logo？
5. 中文是否全部正确？
6. 后排能否 5 秒读懂标题和关键证据？
7. 古风元素是否服务中药主题，而不是喧宾夺主？
8. 主讲人能否 30-45 秒讲完这一页？
