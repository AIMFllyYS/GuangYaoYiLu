# PPTX 损坏根因调研

## 1. PPTX 不是“图片压进 ZIP”这么简单

PPTX 是 Office Open XML 包。Microsoft 的 PresentationML 文档说明，一个演示文稿不是单个 XML，而是一组通过 relationship 连接的 package parts。典型结构包括：

- `ppt/presentation.xml`
- `ppt/presProps.xml`
- `ppt/slideMasters/slideMaster*.xml`
- `ppt/slideLayouts/slideLayout*.xml`
- `ppt/theme/theme*.xml`
- `ppt/slides/slide*.xml`
- 关系文件 `_rels/*.rels`
- 媒体、图表、notes、handouts 等可选部分

Microsoft 文档还说明，最小 presentation file 也包含 presentation part、presentation properties part、slide master part、slide layout part、theme part；slide parts 反而可以是可选的一到多个内容部分。也就是说，只有 slide XML 和图片并不是一个健康 PPTX 的充分条件。

## 2. 本项目当前 PPTX 的共同结构问题

对当前四个生成结果做 ZIP/package 级检查，结论一致：

- ZIP CRC 正常。
- `ppt/presentation.xml` 存在。
- `ppt/slides/slide*.xml` 存在。
- `ppt/media/*` 图片存在。
- `ppt/_rels/presentation.xml.rels` 存在。
- 但是没有 `ppt/slideMasters/`。
- 没有 `ppt/slideLayouts/`。
- 没有 `ppt/theme/theme1.xml`。
- 没有 `ppt/presProps.xml`。
- 没有 `ppt/viewProps.xml`。
- `presentation.xml` 主要只写 `p:sldIdLst`、`p:sldSz`、`p:notesSz`。

这解释了为什么“包结构检查通过”仍可能打开报修复：PowerPoint 打开时会做更高层的 schema、兼容性、默认样式、母版、布局和对象语义修复。当前 validator 没覆盖这些。

## 3. 当前 validator 的边界

`工具/validate_pptx_package.py` 做了有价值但有限的检查：

- `zipfile.testzip()` 查 CRC。
- 查 `[Content_Types].xml`、`_rels/.rels`、`ppt/presentation.xml` 等少量必要文件。
- 查 presentation relationship 中 slide 数量。
- 查所有 relationship target 是否存在。
- 查 `docProps/app.xml` 的 Slides 数量。
- 用 PIL verify 媒体图片。

这些检查能发现“文件缺失、图片坏、关系断链”。但它不做：

- OpenXML schema validation。
- PowerPoint 对 `p:presentation` 子元素顺序和完整性的检查。
- slide master/layout/theme/presProps 的完整性检查。
- 动画 timing tree 合法性检查。
- PowerPoint 实际打开后的修复日志比对。
- saved-PPTX 重新导入或渲染 parity 检查。

所以它的定位应该是“第一道包完整性 smoke test”，不能写成“PPTX 已经 PowerPoint 安全”。

## 4. 手写动画是额外高风险区

v2、v3、v4 都开始手写 `<p:transition>` 和 `<p:timing>`。动画 XML 涉及：

- shape id 目标引用。
- timing tree 层级。
- effect node 顺序。
- PowerPoint 对主序列和点击序列的兼容。
- 与 slide shape tree 的对应关系。

这类结构比静态图片、文本框、形状更容易出现“XML 可解析但 PowerPoint 要修复”的问题。当前脚本没有用 OpenXML SDK 或 PowerPoint 生成动画，也没有 OpenXmlValidator 或实际 PowerPoint 打开验证，因此风险应视为高。

## 5. 中文编码不是首要根因，但仍要严格防护

本项目已有 UTF-8 敏感要求。当前脚本多数 `write_text(..., encoding="utf-8")` 是正确方向；v4 QA 也扫描了 replacement character、Latin-1 mojibake 前缀、Cyrillic mojibake 前缀、中文常见 mojibake 词等标记。

但这只能说明文本文件和 manifest 没明显乱码。PowerPoint 修复弹窗通常更可能来自 OOXML 结构、关系、schema、媒体或动画语义问题。后续仍应继续保持 UTF-8 scan，但不要把“无乱码”误认为“PPTX 无损坏”。

## 6. 避免损坏的路线

推荐优先级：

1. 使用 PowerPoint 保存出的空白模板作为母体，后续只插入/替换 slide、shape、image、text，不从零手写包。
2. 使用成熟库生成：Codex Presentations runtime、python-pptx、PptxGenJS、Open XML SDK。
3. 如果必须手写 OOXML，先生成一个由 PowerPoint/SDK 创建的最小合法 PPTX，再复制其 master/layout/theme/presProps/tableStyles/viewProps 结构。
4. 动画先不做，或只做成熟库/PowerPoint 支持的最小动画。
5. 验证升级为：package check -> OpenXmlValidator -> saved-PPTX 导入/渲染 -> PowerPoint 人工打开。

## 7. 资料依据

- Microsoft PresentationML 文档说明 minimum presentation file 包含 `presentation.xml`、`presProps.xml`、slide master、slide layout、theme：<https://learn.microsoft.com/en-us/office/open-xml/presentation/structure-of-a-presentationml-document>
- Microsoft OpenXmlValidator 可验证 OpenXmlPackage、OpenXmlPart、OpenXmlElement：<https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.validation.openxmlvalidator>
- Microsoft damaged presentation 文档说明单个 damaged slide 可能影响整体，并建议 Reuse Slides、Open and Repair、重新创建 master：<https://learn.microsoft.com/en-us/office/troubleshoot/powerpoint/damaged-presentation>
