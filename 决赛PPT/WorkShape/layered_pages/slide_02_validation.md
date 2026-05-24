# slide_02 分层 PPTX 验证记录

## 产物

- 单页 PPTX：`slide_02_layered.pptx`
- 背景母图：`slide_02_background_base.png`
- 问卷截图层：`slide_02_survey_screenshots_layer.png`
- 调研结果图表层：`slide_02_results_charts_layer.png`
- 脚本预览：`slide_02_layered_preview.png`
- PowerPoint 导出预览：`slide_02_layered_powerpoint_export.png`
- 分层 manifest：`slide_02_layer_manifest.json`
- 拆分策略：`slide_02_split_strategy.md`

## 技术验证

- PPTX ZIP CRC：通过。
- 幻灯片数量：1。
- 媒体数量：6。
- PowerPoint 原生 shape：30 个。
- PowerPoint 图片对象：6 个。
- 中文文本检查：通过。
- PowerPoint 应用级验证：Microsoft PowerPoint 可打开并导出 PNG，导出尺寸为 1920×1080。
- UTF-8/mojibake 扫描：脚本、说明、manifest 未发现常见替换符或乱码片段。
- `git diff --check`：通过。

## 视觉复核

- 问卷截图和调研图表作为独立图片层保留，未重造数据。
- 标题、副标题、三张底部结论卡和底部结论条为原生 PPT 文本。
- 右上真实/生成 logo 区域不重绘，不生成假 logo。

## 已知取舍

- 问卷题目、图表分类和图形比例保留为图片层，不逐项转成原生图表，避免误造或误读数据。
- 复杂枝叶、山水、药材器具和纸纹氛围统一保留在背景母图。
