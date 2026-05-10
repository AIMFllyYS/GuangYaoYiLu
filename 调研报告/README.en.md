# Research notes (`调研报告/`)

[**中文**](README.md)

Technical write-ups gathered while building **defense decks, raster layering flows, and PPTX QA**. They explain engineering trade-offs; **they are not official narrative statements** about the league-branch activities.

## Series: PPT generation & layer-level assembly

Path: [`PPT生成与元素级分层/`](PPT生成与元素级分层/)

| Doc | Topic |
|-----|-------|
| [00_总览与结论.md](PPT生成与元素级分层/00_总览与结论.md) | Summary & risks |
| [01_PPTX损坏根因.md](PPT生成与元素级分层/01_PPTX损坏根因.md) | Hand-built OOXML / ZIP fragility |
| [02_元素级抠图与分层方案.md](PPT生成与元素级分层/02_元素级抠图与分层方案.md) | Matting & compositing |
| [03_工具与Skills调研.md](PPT生成与元素级分层/03_工具与Skills调研.md) | Tooling, external skills, **and in-repo [`pptx-layer-merge`](../skills/pptx-layer-merge/)** |
| [04_验证与交付清单.md](PPT生成与元素级分层/04_验证与交付清单.md) | Validation & release checklist |
| [05_本项目证据附录.md](PPT生成与元素级分层/05_本项目证据附录.md) | Evidence appendix |

Suggested order: **00 → 01 → 04**, then **03** when comparing generators.

## See also

- [Root README](../README.en.md) · [Deliverables](../交付物/README.en.md) · [Tools](../工具/README.en.md) · [Skills](../skills/README.en.md)
