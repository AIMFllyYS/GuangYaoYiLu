# 光药医路决赛答辩图片型最终版 QA

- 生成方式：Pillow 组装 10 张 16:9 完整页面图，python-pptx 逐页铺满生成 PPTX。
- 真实素材：使用 `决赛PPT/PPT要求` 与 `new_web/public` 中的 logo、合照、问卷/结果截图、路演照片、叶开泰照片、青暖冬日素材、志愿服务照片、网站/瑶光素材。
- 风格：绿色古风中药 + 现代答辩 PPT 信息结构。
- 风险控制：不生成假活动照片、假问卷数据、假政策红头文件、假 logo、假二维码。
- 包结构验证：PPTX ZIP CRC 通过；10 个 slide XML；10 个媒体图片；python-pptx 可读取 10 页。
- 页面尺寸：全部页面图为 1920x1080。
- PPTX：`光药医路_决赛答辩_图片型最终版.pptx`

## 页面图
- `slide_01.png`
- `slide_02.png`
- `slide_03.png`
- `slide_04.png`
- `slide_05.png`
- `slide_06.png`
- `slide_07.png`
- `slide_08.png`
- `slide_09.png`
- `slide_10.png`

## 已知限制

- 该版本为图片型 PPTX，普通文字不可在 PowerPoint 内逐字编辑；如需逐字编辑，需要后续转为原生文本层。
- 本环境未执行 PowerPoint 桌面打开/另存验证。