# 光药医路 v5 稳定版 PPT

本目录用于存放 v5 稳定版答辩 PPT 的生成产物。

## 生成原则

- 使用成熟 PPTX 生成器生成完整 PowerPoint 包结构，不继续手写 OOXML ZIP 包。
- PPTX 先做稳定静态版，不手写动画 timing XML。
- 保留中文 UTF-8，生成脚本、manifest、讲稿与 QA 文档均使用 UTF-8。
- v4 前 15 页可作为视觉底图复用；后 16-22 页重做为更清晰的原生图片、文本、形状组合。
- 瑶光作为全 deck 线索：每页加入轻量瑶光元素，后段重点展示瑶光角色、文创、宣传、小游戏与视频背景。

## 运行环境

建议使用 Codex bundled Python：

```powershell
& "C:\Users\AIMFl\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" ".\工具\create_defense_ppt_v5_stable.py"
```

依赖：

- `python-pptx`
- `Pillow`

## 主要输出

- `光药医路_5分钟稳定答辩PPT_v5.pptx`
- `光药医路_5分钟稳定答辩PPT_v5_静态预览.pdf`
- `preview_png/slide_01.png` 至 `slide_22.png`
- `preview_contact_sheet.png`
- `element_manifest.json`
- `text_manifest.json`
- `光药医路_5分钟答辩讲稿_v5.md`
- `QA_CHECKS.md`
