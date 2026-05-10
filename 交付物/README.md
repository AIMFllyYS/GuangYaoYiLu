# 交付物

[**English**](README.en.md)

本目录集中存放 **可对外或对内提交** 的成品与准成品：答辩演示、快闪版答辩工程、宣传物料、团支部周边等。**权利归属与使用范围以仓库根目录 [README.md](../README.md) 为准**（团支部相关内容未默认开源）。

## 子目录导引

| 路径 | 内容 |
|------|------|
| [`答辩PPT/`](答辩PPT/) | 各迭代答辩幻灯片（如 `答辩PPT`、`答辩PPT_v2` … `答辩PPT_v6`）、讲稿、`layers`/`preview_png`/`full_ai_slides` 等与 python-pptx 或质检相关的产物 |
| [`快速答辩/`](快速答辩/) | **常用**：整页预览图 (`full-all-slides`)、按页分层目录 (`layers`)、以及与组稿校验相关的脚本输入；根目录 [`detect_frames.py`](../detect_frames.py) 主要针对此结构 |
| [`答辩PPT_legacy/`](答辩PPT_legacy/) | 早期单页试验、prompt 与 [`MASTER_WORKFLOW`](答辩PPT_legacy/prompt/MASTER_WORKFLOW.md) 等，详见该目录 README |
| [`宣传/`](宣传/) | [`宣传海报/`](宣传/宣传海报/) 等宣传向工程与 [`QA_CHECKS.md`](宣传/宣传海报/QA_CHECKS.md) |
| [`周边/`](周边/) | 如 [`瑶光文创/`](周边/瑶光文创/) 说明与资源 |

## 版本阅读建议

- 需要 **Stable / 校验说明**时，可看 **`答辩PPT_v5`**、**`答辩PPT_v6_image2_first`** 内 README（v6 image2-first 见 [`答辩PPT/答辩PPT_v6_image2_first/README.md`](答辩PPT/答辩PPT_v6_image2_first/README.md)）。
- 需要 **演进历史或实验记录**时，对比 `答辩PPT_legacy/` 与各 `v*` 目录。

## 与 Git / 体积

答辩 `.pptx` 等常被根目录 `.gitignore` 忽略：**GitHub 上可见的文件集合可能小于本地磁盘**。请以各版本目录内的讲稿、`QA_CHECKS`、README 为准理解流程。

## 相关链接

- [仓库首页](../README.md) · [技能说明](../skills/README.md)
- [工具脚本说明](../工具/README.md)
- [PPT 制作调研文集](../调研报告/README.md)
