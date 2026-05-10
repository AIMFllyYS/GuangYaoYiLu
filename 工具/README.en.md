# Tooling (`工具/`)

[**中文**](README.md)

Small **Python / PowerShell** utilities for decks, posters, and asset hygiene. Prefer each script’s docstring/comments plus the matching folder under [`交付物/`](../交付物/). Python version/deps vary per file—**this README is only an index**.

## Script inventory

| File | Role (short) |
|------|----------------|
| `validate_pptx_package.py` | First-pass ZIP/relationship/media/slide-count checks—not a proof of flawless PowerPoint open |
| `convert_docs_to_md.py` | Batch doc → Markdown conversions |
| `create_defense_ppt.py` | Early defense-deck generator |
| `create_defense_ppt_v2.py` … `create_defense_ppt_v6_image2_first.py` | Evolution of scripted deck builds |
| `create_defense_ppt_v5_stable.py` | v5 “stable lane” assembler |
| `create_promo_posters.py` | Poster generation helpers |
| `tree.py` | Directory dump helper |
| `restructure.py` · `restructure.ps1` | Structural refactors |

CSV logs: `rename_mapping.csv`, `folder_refactor_log.csv`.

## Repo-root helpers

[`detect_frames.py`](../detect_frames.py) detects photo-slot rectangles on full-slide PNGs for [`交付物/快速答辩`](../交付物/快速答辩) (Pillow / NumPy).

## See also

- [Deliverables README](../交付物/README.en.md)
- [Research index](../调研报告/README.en.md)
- [Agent skill](../skills/README.en.md)
