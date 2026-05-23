# 光药医路决赛答辩 TS Deck

Deck id: `guang-yao-yi-lu-final-defense`

## 创作说明

本 deck 覆盖旧版 10 页结构，扩展为 30 页 TS 版答辩稿。它不是直接生成真实 PPTX，而是严格按 AI PPTX Stage 规范组织为可预览、可迁移、可手工复刻 PowerPoint Morph 的页面文件。

所有正文、标题、页码与卡片说明均使用真实 `text()` 图层；背景与照片只承担氛围、证据与空间层次，不承载不可编辑正文。

## 内容来源

- `决赛PPT/PPT要求/PPT每面要求.docx`
- `决赛PPT/PPT要求/1` 至 `决赛PPT/PPT要求/9` 的活动照片、问卷与文宣素材
- 旧输出 `决赛PPT/输出终稿/image2_premium_ppt_v2/slides` 仅作为高级科技答辩气质参考，不直接作为文字页使用
- Microsoft Morph 官方建议：同名对象跨页一一匹配、用移动/缩放/旋转/颜色变化形成平滑过渡，复杂对象用 `!!` 命名辅助选择窗格匹配

## 30 页叙事结构

1. `001-cinematic-cover`：电影感封面，建立主题、名称、组成与时间。
2. `002-theme-deconstruction`：拆解十四字主题，说明视觉与行动原则。
3. `003-project-overview`：总览从调研到志愿服务的完整闭环。
4. `004-research-method`：调研方法与五大维度。
5. `005-research-profile`：样本画像与青年接触频次。
6. `006-research-painpoints`：认知痛点与进入门槛。
7. `007-research-strategy`：由调研导出的活动策略。
8. `008-policy-health-china`：健康中国背景。
9. `009-policy-tcm-heritage`：中医药传承创新。
10. `010-policy-youth-action`：政策落到青年行动闭环。
11. `011-team-75`：三支部 75 人组织结构。
12. `012-name-origin`：解释“光药医路”名称由来。
13. `013-brand-yaoguang`：Logo、瑶光助手与文宣体系。
14. `014-carnival-overview`：嘉年华路演总览。
15. `015-game-daoyao`：捣药游戏。
16. `016-game-wenyao`：闻药游戏。
17. `017-game-renyao`：认药与互动反馈。
18. `018-museum-route`：叶开泰博物馆路径。
19. `019-museum-gallery`：展陈现场照片流。
20. `020-museum-translation`：博物馆素材转化为科普内容。
21. `021-winter-route`：青暖冬日路线图。
22. `022-winter-school-talk`：母校宣讲。
23. `023-winter-field-study`：实地考察。
24. `024-website-hero`：科普网站首屏。
25. `025-website-modules`：网站功能矩阵。
26. `026-website-yaoguang-flow`：瑶光助手互动流程。
27. `027-volunteer-overview`：社区志愿服务总览。
28. `028-volunteer-cleanup`：红建社区清除牛皮癣。
29. `029-volunteer-outcome`：团学践行成果。
30. `030-film-finale`：电影幕布照片流收束与致谢。

## Morph 设计系统

- 全局稳定对象：`!!brand-logo-primary`、`!!brand-logo-secondary`、`!!deck-title`、`!!deck-title-shadow`、`!!deck-title-gold`、`!!herbal-ring`、`!!gold-path`。
- 照片流：`!!photo-strip-01` 至 `!!photo-strip-06` 跨章节复用，适合在 PowerPoint 中做滑入、换位、缩放与幕布收束。
- 章节模块：`!!survey-node-*`、`!!policy-doc-*`、`!!branch-card-*`、`!!game-card-*`、`!!route-dot-*`、`!!website-module-*`、`!!volunteer-card-*`。
- 每个 `page.ts` 内 morphKey 不重复；跨页同名对象保持同一 builder 类型，避免 Morph 退化为淡入淡出。

## 资产说明

- `assets/generated/`：10 张内置 image_gen 生成的 16:9 无文字背景，已整理为 1920x1080 JPG。
- `assets/photos/`：从源素材压缩整理出的活动照片、海报、瑶光、小程序与路线素材。
- `assets/icons/`：药钵、草叶、问卷、饼图、政策文件、地图点、路线、博物馆、网站搜索、问答、研究、志愿服务、电影胶片等 SVG 图标。

## 验证记录

2026-05-24 最终验证：

- `npm run typecheck`：通过。
- `npm run build`：通过；Vite 输出确认 generated 背景、photos 照片、brand 图片与研究图表均被静态打包。存在默认 chunk size 提示，不影响本 deck 预览。
- `npm run validate:decks`：通过。
- `npm run validate:utf8`：通过。
- `AI_PPTX_STAGE_URL=http://127.0.0.1:5174 npm run smoke:browser`：通过。
- 额外 Playwright 检查：下拉选项包含 `guang-yao-yi-lu-final-defense`，切换后显示 `1 / 30`，并检查第 1、4、8、11、14、18、21、24、27、30 页图片均加载成功，可导航到 `30 / 30`，可见文本未发现 mojibake 标记。

手工迁移到 PowerPoint 时，请继续遵守本目录 `notes.md` 中的每页说明：背景图只作氛围，正文保留真实文本；跨页 Morph 对象使用 `!!` 开头命名，且同名对象保持一一匹配。
