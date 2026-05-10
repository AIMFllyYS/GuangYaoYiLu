# Summary-book pipelines (`总结书流水线/`)

[**中文**](README.md)

This folder stores **multi-channel, full-book** drafts (~CH01 cover through CH15 back cover) for the portrait summary book, later merged (ideally) into [`输出终稿/`](../输出终稿/) when that directory exists. Visual rules, page size, and content policy are in root [**Plan.md**](../Plan.md).

## Layout

| Path | Role |
|------|------|
| [`Antigravity/`](Antigravity/) | Primary channel folders `CH01_封面` … `CH15_封底`; each chapter typically includes `brief.md`, `config.json`, art/layout assets; `_preview/` hosts page thumbnails; `_shared/` hosts cross-chapter assets; tooling such as `compositor.py`, `export_pdf.py`, `renumber.py` |
| [`NotebookLM/`](NotebookLM/) | NotebookLM-facing prompts / exports ([`PPT提示词合集.md`](NotebookLM/PPT提示词合集.md)) |

Additional channels (e.g. Google Flow) may exist only on some clones—**treat them as alternate full-book streams**, not mandatory paths.

## Data flow

```text
Assets ──► Pipelines (each produces a full book) ──► 输出终稿 (cherry-picked merge)
```

## See also

- [Root README](../README.en.md) · [Plan.md](../Plan.md) · [Assets README](../素材库/README.md)
- [Deliverables README](../交付物/README.en.md) for slide/poster tracks
