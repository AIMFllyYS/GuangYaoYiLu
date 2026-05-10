# pptx-layer-merge · Technical Experience & Retrospective

[**中文**](experience.md)

> This document records the full journey of the `pptx-layer-merge` skill from project practice: problem origins, route evolution, design trade-offs, current validation coverage, and an explicit list of unresolved gaps. Intended for future collaborators, agents, or similar projects.

---

## Part I — Technical Post-Mortem

### 1.1 Problem Origin: Why PowerPoint Kept Saying "Needs Repair"

During the v1–v4 phase of this project (GuangYaoYiLu joint branch defense PPT), every PPTX was assembled by Python scripts that **hand-wrote ZIP packages + PresentationML XML**. These files passed shallow package checks (ZIP CRC OK, relationship targets exist, media images decodable), but Microsoft PowerPoint **always prompted a repair dialog** on open.

The root cause was neither Chinese encoding nor image corruption — it was **incomplete OOXML package semantics**:

- Missing `ppt/slideMasters/`, `ppt/slideLayouts/`, `ppt/theme/theme1.xml`, `ppt/presProps.xml`.
- Microsoft's spec requires a minimum legal PPTX to contain presentation part + presProps + slide master + slide layout + theme; slide XML and images alone do not constitute a healthy package.
- From v2 onward, hand-written `<p:transition>` and `<p:timing>` animation XML further increased the probability of triggering PowerPoint's repair logic.

See: [`调研报告/PPT生成与元素级分层/01_PPTX损坏根因.md`](../调研报告/PPT生成与元素级分层/01_PPTX损坏根因.md)

### 1.2 Route Evolution: v1 → v6 → Skill

| Version | Commit | Date | Key Change | Outcome |
|---------|--------|------|------------|---------|
| v1 | `ed52a16` | 2026-05-07 | Hand-written OOXML, 15 slides full-image + textbox | PowerPoint repair prompt |
| v2 | `d78d980` | 2026-05-07 | Added hand-written animation timing + off-canvas script text | Repair prompt + unstable animation |
| v3 | `4a8c80c` | 2026-05-08 | Image-layer deck (header/left_field/center_field region slicing) | Repair prompt; layers not element-level |
| v4 | `dcb5178` | 2026-05-09 | Safety tooling + QA checks + 22-slide supplement | Repair prompt; validator only covers shallow checks |
| v5 | `78518d6` | 2026-05-09 | **python-pptx rebuild**, full master/layout/theme | ✅ First time no repair prompt |
| v6 | `6c65ac9` | 2026-05-09 | Semantic layering + image2-first strategy | ✅ Stable; layering approaches element-level |
| Skill v1 | `d3332ae` | 2026-05-10 | Scaffolded `premium-pptx-producer` | Spec docs + script skeleton |
| Skill rename | `e1529d4` | 2026-05-10 | → `pptx-layer-merge` | Unified naming |
| Skill docs | `e22a406` | 2026-05-10 | Apache-2.0 + bilingual README | Publishable state |

**The turning point was v5**: abandoning hand-written OOXML in favor of `python-pptx` (which auto-generates master/layout/theme/presProps). PowerPoint opened without repair for the first time. This validated the research report's core conclusion — **do not use "hand-write a full PPTX package" as the primary path**.

### 1.3 Skill Design Trade-offs

**Why manifest-driven + python-pptx:**

1. **Manifest as contract layer**: decouples visual design (generated layers) from PPTX assembly (scripts); the Agent only needs to output JSON manifests, scripts handle coordinate conversion and package structure.
2. **python-pptx as safety net**: it automatically handles master/layout/theme/presProps/relationships — the package structure PowerPoint requires — avoiding the systemic risk of hand-written OOXML.
3. **Preview as pre-validation**: `build_pptx_from_manifest.py` outputs both PPTX and PNG previews, enabling visual QA even without PowerPoint installed.

**Alternatives not chosen:**

| Option | Reason Not Chosen |
|--------|-------------------|
| PptxGenJS | Project scripts are Python; migration cost high; CJK font support untested |
| Open XML SDK (.NET) | Machine lacks dotnet; SDK is low-level, high complexity |
| Codex Presentations runtime | Tied to Codex environment, not portable to Cursor/generic CLI |
| Hand-written OOXML + animation | Disproven by v1–v4, high risk |

### 1.4 Current Validation Coverage

```
✅ Covered                           ❌ Not Covered
──────────────────────────────────   ──────────────────────────────────
ZIP CRC + file integrity             OpenXML schema validation (.NET)
Required part existence              LibreOffice headless render
Relationship target resolution       PowerPoint desktop open/save
Media image PIL verify               saved-PPTX parity check
Slide count matching                 Animation timing legality
Forbidden text scanning              Shape ID uniqueness deep check
UTF-8 / mojibake scanning            Cross-platform font availability
Native text existence (strict)
Single-image slide detection (strict)
```

Validation script: [`scripts/validate_pptx_artifact.py`](pptx-layer-merge/scripts/validate_pptx_artifact.py)

---

## Part II — First-Person Retrospective

### 2.1 The Rename Story

Originally named `premium-pptx-producer`, intended as "premium PPTX producer." In practice, two problems emerged:

1. **Semantically vague**: "premium" conveys no technical characteristic; external users cannot infer what the skill does from the name.
2. **Misaligned with core capability**: the skill's real differentiator is not "premium" but "layer-manifest-driven assembly + package-level validation."

After renaming to `pptx-layer-merge`, the name directly communicates two core actions: **layer** (split into composition layers) and **merge** (assemble into PPTX). This also aligns with SKILL.md Workflow steps 4–5 (Split into composition layers → Assemble PPTX).

Commit: `e1529d4` (2026-05-10)

### 2.2 Known Gaps (Unresolved Issues)

| # | Gap | Evidence | Root Cause | Candidate Fix |
|---|-----|----------|------------|---------------|
| 1 | **No .NET / OpenXmlValidator** | `调研报告/.../04_验证与交付清单.md` §3; `dotnet` not found on machine | Dev environment lacks .NET SDK | Install .NET SDK; or add to CI (GitHub Actions) |
| 2 | **No LibreOffice headless** | `调研报告/.../04_验证与交付清单.md` §4; `soffice` not found | Dev environment lacks LibreOffice | Install LibreOffice; or Dockerize validation |
| 3 | **No template injection** | `scripts/build_pptx_from_manifest.py` line 1: `Presentation()` creates from blank | Script prioritized minimal runnable state | Add `--template` param to inherit master/layout/theme from `.potx` |
| 4 | **No legacy→skill migration** | v1–v4 artifacts (`交付物/答辩PPT/答辩PPT_v1~v4`) cannot be consumed by skill pipeline | Old hand-written OOXML incompatible with manifest schema | Write `legacy_to_manifest.py` converter |
| 5 | **Hard-coded Windows fonts** | `scripts/build_pptx_from_manifest.py`: `FONT_DIR = Path("C:/Windows/Fonts")` | Developed on Windows, macOS/Linux not considered | Font fallback chain + `PPTX_FONT_DIR` env var |
| 6 | **No end-to-end demo** | No CI script or Makefile for one-command scaffold→manifest→build→validate | Skill freshly extracted from project, not independently validated | Add `smoke_test.py` or GitHub Actions workflow |
| 7 | **Animation timing not included** | `SKILL.md` Operating Rules: "Keep the first stable version static" | Design decision: static first; v2 hand-written animation disproven | Future scope; introduce after python-pptx or mature lib supports it |

### 2.3 Reminders for Future Collaborators / Agents

Before using this skill, confirm three things:

1. **Do not hand-write OOXML.** If you find yourself assembling `<p:presentation>`, `<p:sldIdLst>`, `<p:timing>`, or similar XML — stop. Use `python-pptx` or an equivalent mature library. The lessons from v1–v4 are sufficient.

2. **Validation passing ≠ PowerPoint won't complain.** `validate_pptx_artifact.py` is only a package smoke test. Real delivery requires PowerPoint desktop open confirmation, or at minimum a successful LibreOffice headless PDF conversion. If neither is available, explicitly mark it as a Known Gap in the delivery report.

3. **Region slicing ≠ element-level layering.** PNGs named `header`, `left_field`, `center_field` cut by grid are not PowerPoint elements. Real elements are objects in the shape tree (`<p:sp>`, `<p:pic>`, `<p:graphicFrame>`). If your manifest contains region names instead of semantic IDs (like `slide-title`, `photo-01`, `logo-primary`), the layering granularity is insufficient.

---

## Reference File Index

| File | Role |
|------|------|
| [`pptx-layer-merge/SKILL.md`](pptx-layer-merge/SKILL.md) | Primary skill document |
| [`pptx-layer-merge/references/guangyaoyilu-lessons.md`](pptx-layer-merge/references/guangyaoyilu-lessons.md) | Project lessons distilled |
| [`pptx-layer-merge/references/workspace-contract.md`](pptx-layer-merge/references/workspace-contract.md) | Workspace contract & manifest schema |
| [`pptx-layer-merge/references/quality-gates.md`](pptx-layer-merge/references/quality-gates.md) | Quality gates |
| [`../调研报告/PPT生成与元素级分层/`](../调研报告/PPT生成与元素级分层/) | 5 research reports (corruption root cause / layering / tools / validation / evidence) |
| [`../交付物/快速答辩/build_pptx.py`](../交付物/快速答辩/build_pptx.py) | Current quick-build script (python-pptx) |

---

*Copyright © 2026 AIMFllyYS（羽升）. Licensed under Apache-2.0.*
