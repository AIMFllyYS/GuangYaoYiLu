# 工具

[**English**](README.en.md)

仓库根下 `工具/` 内多为 **答辩 PPT / 海报 / 素材处理** 的 Python 或 PowerShell 小工具；使用前请阅读脚本内注释与各 [`交付物`](../交付物/) 目录中的 README。**运行环境（Python 版本、依赖）以脚本头部为准**，此处仅作索引。

## 脚本索引（按文件名）

| 文件 | 用途（摘要） |
|------|----------------|
| `validate_pptx_package.py` | PPTX ZIP / 关系 / 媒体 / 页数等浅层校验（≠「PowerPoint 必然无报错」的充分条件） |
| `convert_docs_to_md.py` | 文档转 Markdown（与素材库批处理历史相关） |
| `create_defense_ppt.py` | 答辩 PPT 初代生成脚本 |
| `create_defense_ppt_v2.py` … `create_defense_ppt_v6_image2_first.py` | 各迭代答辩稿生成演进 |
| `create_defense_ppt_v5_stable.py` | v5 稳定向组稿脚本 |
| `create_promo_posters.py` | 宣传海报相关生成 |
| `tree.py` | 目录树导出等辅助 |
| `restructure.py` · `restructure.ps1` | 目录重整与批处理 |

数据类文件：`rename_mapping.csv`、`folder_refactor_log.csv`（与历史结构调整有关）。

## 根目录脚本

答辩分层辅助算法见仓库根 **[`detect_frames.py`](../detect_frames.py)**（依赖 Pillow、NumPy，针对 [`交付物/快速答辩`](../交付物/快速答辩)）。

## 相关文档

- [交付物 README](../交付物/README.md) · [调研报告](../调研报告/README.md) · [Skills](../skills/README.md)
