# 光药医路 v4 QA 记录

生成日期：2026-05-09

## 输出

- PPTX：`答辩PPT_v4/光药医路_5分钟纯图分层答辩PPT_v4.pptx`
- 静态预览 PDF：`答辩PPT_v4/光药医路_5分钟纯图分层答辩PPT_v4_静态预览.pdf`
- 预览图：`答辩PPT_v4/preview_png/slide_01.png` 至 `slide_22.png`
- 总览图：`答辩PPT_v4/preview_contact_sheet.png`

## 已执行检查

- 生成脚本：`python 工具/create_defense_ppt_v4_image_layers.py`
- PPTX 包结构：`python 工具/validate_pptx_package.py 答辩PPT_v4/光药医路_5分钟纯图分层答辩PPT_v4.pptx --expected-slides 22`
- 图片可读性：PIL 打开并校验 `full_ai_slides`、`preview_png`、`layers` 下共 224 张图片，以及 PPTX 内 180 张媒体图片。
- UTF-8 安全：读取 `text_manifest.json`、`光药医路_5分钟答辩讲稿_v4.md`、`补充性PPT/要求.txt`，未发现 `�`、`Ã`、`Â`、`Ð`、`Ñ`、`锟斤拷`。
- Git 空白检查：`git diff --check` 通过。

## 视觉检查

- 已查看 `preview_contact_sheet.png` 全局节奏。
- 已单独查看 `slide_01.png`、`slide_16.png`、`slide_17.png`、`slide_18.png`、`slide_20.png` 原始尺寸预览。
- 旧 15 页页码已覆盖为 `/22`，新增 7 页与 v3 的本草、水墨、红绿金视觉保持一致。
- 第 20-22 页保留大面积视频插入区域，文字量低，适合作为视频背景。

## 说明

- 本次未启动 PowerPoint/LibreOffice 做桌面级打开测试；当前验证为 Zip/OpenXML 包结构、关系目标、媒体图片和静态 PNG 预览检查。
- PPTX 为纯图分层结构，优先保证文件完整性、视觉一致性和中文不损坏。
