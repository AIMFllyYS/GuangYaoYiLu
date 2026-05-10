# 光药医路 v5 QA 记录

生成日期：2026-05-09

## 输出

- PPTX：`交付物/答辩PPT/答辩PPT_v5/光药医路_5分钟稳定答辩PPT_v5.pptx`
- 静态预览 PDF：`交付物/答辩PPT/答辩PPT_v5/光药医路_5分钟稳定答辩PPT_v5_静态预览.pdf`
- 预览图：`交付物/答辩PPT/答辩PPT_v5/preview_png/slide_01.png` 至 `slide_22.png`
- 总览图：`交付物/答辩PPT/答辩PPT_v5/preview_contact_sheet.png`
- 元素清单：`交付物/答辩PPT/答辩PPT_v5/element_manifest.json`
- 文本清单：`交付物/答辩PPT/答辩PPT_v5/text_manifest.json`
- 讲稿：`交付物/答辩PPT/答辩PPT_v5/光药医路_5分钟答辩讲稿_v5.md`

## 已执行检查

- 生成脚本：`python 工具/create_defense_ppt_v5_stable.py`
- PPTX 包结构：`python 工具/validate_pptx_package.py 交付物/答辩PPT/答辩PPT_v5/光药医路_5分钟稳定答辩PPT_v5.pptx --expected-slides 22`
- 图片可读性：PIL 校验 22 张预览图和 PPTX 内 24 张媒体图片。
- UTF-8 安全：脚本写入 `.json`、`.md` 均显式使用 UTF-8。
- Git 空白检查：`git diff --check` 通过。

## 视觉检查重点

- v5 修复 v4 后段左上角拥挤：16-22 页标题、页码与 HUST logo 分离。
- v5 取消 v4 第 18 页多余项目符号，正文改为短段落与关键词。
- v5 重做 20-22 页视频背景，保留大视频区域，同时增加瑶光角标和主题栏。
- 17 页文创底图由生图模型生成空白产品形态，PPT 中再叠加瑶光与主题元素；不直接照抄参考图品牌图案。

## 验证缺口

- 当前机器未检测到 LibreOffice、dotnet 或 PowerPoint 自动化能力，因此未做 OpenXmlValidator 或 saved-PPTX headless render parity。
- PPTX 使用 python-pptx 生成，包结构包含成熟库输出的 master/layout/theme 基础结构，风险低于 v4 手写 OOXML，但最终上交前仍建议用 Microsoft PowerPoint 人工打开确认无修复弹窗。
