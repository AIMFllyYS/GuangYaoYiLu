# slide_01 分层 PPTX 验证记录

## 产物

- 单页 PPTX：`slide_01_layered.pptx`
- 背景母图：`slide_01_background_base.png`
- 脚本预览：`slide_01_layered_preview.png`
- PowerPoint 导出预览：`slide_01_layered_powerpoint_export.png`
- 分层 manifest：`slide_01_layer_manifest.json`
- 拆分策略：`slide_01_split_strategy.md`

## 技术验证

- PPTX ZIP CRC：通过。
- 幻灯片数量：1。
- 媒体数量：1 张背景母图。
- PowerPoint 原生 shape：24 个。
- PowerPoint 图片对象：1 个。
- 中文文本检查：`光药医路`、`金光青黛同济兴`、`药学（中外）2503`、`答辩时间：2026.5.24` 均存在于 slide XML。
- PowerPoint 应用级验证：Microsoft PowerPoint 可打开并导出 PNG，导出尺寸为 1920×1080。
- UTF-8/mojibake 扫描：脚本、说明、manifest 未发现 `�`、`Ã`、`Â`、`â€`、`锟斤拷`。
- `git diff --check`：通过。

## 视觉复核

- 已根据 PowerPoint 真实导出图修正字号，避免顶部标语、主标题、团队信息条和日期条溢出。
- 双校徽区域为占位圆章，没有生成假校徽。
- 左下药柜/研钵/药材、右下卷轴/笔记本和活动照片拼贴保留为背景氛围层。

## 已知取舍

- 顶部书法标语和主标题使用原生 PPT 文本复建，无法完全等同 image-2 原图的金粉笔触，但可编辑。
- 复杂光效、山水、照片拼贴和中药器具未进行 PSD 级抠图，统一保留在背景母图中。
