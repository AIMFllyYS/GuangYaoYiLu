# slide_04 分层 PPTX 验证记录

## 产物

- 单页 PPTX：`slide_04_layered.pptx`
- 背景母图：`slide_04_background_base.png`
- PowerPoint 导出预览：`slide_04_layered_powerpoint_export.png`
- 分层 manifest：`slide_04_layer_manifest.json`
- 拆分策略：`slide_04_split_strategy.md`

## 技术验证

- PPTX ZIP CRC：通过。
- 幻灯片数量：1。
- 媒体数量：5。
- PowerPoint 原生 shape：36 个。
- PowerPoint 图片对象：5 个。
- 中文文本检查：通过。
- PowerPoint 应用级验证：Microsoft PowerPoint 可打开并导出 PNG，导出尺寸为 1920×1080。
- UTF-8/mojibake 扫描：脚本、说明、manifest 未发现常见替换符或乱码片段。
- `git diff --check`：通过。

## 视觉复核

- 复杂照片、网页、图表、地图或氛围装饰按语义保留为独立图片层或背景母图。
- 主要叙事标题、标签、底部结论和卡片说明使用原生 PPT 文本与 shape。
- 未生成假数据、假 logo、假二维码或假政策正文。
