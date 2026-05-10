# Deliverables (`交付物/`)

[**中文**](README.md)

This folder holds **submission-ready or near-ready outputs**: defense decks, the “fast defense” layered workspace, publicity assets, and merch materials. **Rights and permitted use follow the notice in the root [README.en.md](../README.en.md)** (branch-authored content is not open-sourced by default).

## Layout

| Path | Contents |
|------|----------|
| [`答辩PPT/`](答辩PPT/) | Iterations such as baseline `答辩PPT`, `答辩PPT_v2` … `答辩PPT_v6`, scripts, layered PNG folders, previews, QA notes |
| [`快速答辩/`](快速答辩/) | **Often canonical** for composites: `full-all-slides`, per-slide `layers/`, inputs to packaging scripts; [`detect_frames.py`](../detect_frames.py) targets this tree |
| [`答辩PPT_legacy/`](答辩PPT_legacy/) | Older experiments—see [`README.md`](答辩PPT_legacy/README.md) and [`MASTER_WORKFLOW`](答辩PPT_legacy/prompt/MASTER_WORKFLOW.md) |
| [`宣传/`](宣传/) | Posters ([`QA_CHECKS`](宣传/宣传海报/QA_CHECKS.md)), variants, etc. |
| [`周边/`](周边/) | Merch such as [`瑶光文创/`](周边/瑶光文创/) |

## Which version to read

- For **stability / QA notes**, start with **`答辩PPT_v5`** and **`答辩PPT_v6_image2_first`** ([`README`](答辩PPT/答辩PPT_v6_image2_first/README.md)).
- For **history**, compare `答辩PPT_legacy/` with each `v*` tree.

## Git & size

Defense `.pptx` files may be gitignored:**remotes can be thinner than local checkouts.**

## Links

- [Repository root](../README.en.md) · [Agent skill](../skills/README.en.md)
- [Scripts](../工具/README.en.md)
- [PPT research index](../调研报告/README.en.md)
