---
name: pptx-layer-merge
description: Create high-end, real, editable PowerPoint/PPTX decks from uploaded materials and requirements. Use when Codex needs to build or substantially refine a professional deck, organize source files, generate image-first visual masters, split generated visuals into reusable layers, handle real photos or logos, assemble slides with native PPTX text/pictures/shapes, or validate a PPTX deliverable for package health, visual QA, and UTF-8 safety.
---

# pptx-layer-merge

## Operating Rules

- Preserve UTF-8. Read and write Chinese text with explicit UTF-8 encoding.
- Treat user materials as evidence. Do not invent names, logos, dates, awards, or quoted facts unless the user explicitly asks for creative filler.
- Start by organizing the working folder before making slides. Use `scripts/scaffold_pptx_project.py` when no clean structure exists.
- Prefer a mature PPTX generator: python-pptx, PptxGenJS, PowerPoint/Codex presentation runtime, or a clean template parent. Do not handwrite a full OOXML ZIP package.
- Keep the first stable version static and robust. Add animation only after the static PPTX opens cleanly and visual QA passes.
- Do not flatten the whole deck into one image per slide when editability matters. Backgrounds can be raster images; titles, body copy, logos, real photos, charts, and labels should be native PPTX objects whenever practical.

## Workflow

1. **Ingest and sort materials**
   - Create a project workspace with `00_input`, `01_brief`, `02_generation`, `03_assembly`, `04_final`, and `05_qa`.
   - Separate requirements, source documents, source images, logos, generated full-slide images, generated layers, manifests, assembly scripts, previews, and final deliverables.
   - Build an asset inventory before design decisions: file type, source, likely role, and whether the asset must remain real/unmodified.

2. **Write the deck brief**
   - Summarize audience, purpose, output format, slide ratio, language, brand constraints, must-use assets, and non-negotiable facts.
   - Convert user requirements into a slide plan with one row per slide: goal, narrative role, core message, evidence files, visual type, generated-image need, real-photo need, and QA notes.
   - Read `references/guangyaoyilu-lessons.md` for the project-derived production pattern.

3. **Design visual masters**
   - Generate or request full-slide visual masters first when a rich style is needed.
   - Prompt masters to be layer-friendly: clean logo zone, no page numbers, no placeholder text, clear object boundaries, high contrast between subjects and background, and no long paragraphs burned into the image.
   - Keep artistic title lettering as generated image art only when it is a visual anchor; keep ordinary titles, captions, labels, body text, and quotes as editable PPTX text.

4. **Split into composition layers**
   - Generate or prepare full-canvas PNG layers, not cropped random tiles: `background`, `deco_border`, `deco_props`, `art_title`, `figure`, `infograph`, `logo`, `photo_*`.
   - Put real photos and official logos into their own files and place them directly in PPTX; do not re-generate or stylize them unless the user asks.
   - For each slide, create a manifest with semantic ids, type, source, bbox, z-order, editability, and animation group. Read `references/workspace-contract.md` before writing manifests.

5. **Assemble PPTX**
   - Use manifest coordinates and a fixed canvas conversion to add layers and native text boxes.
   - Name important shapes consistently: `slide-title`, `subtitle`, `body-01`, `photo-01`, `logo-primary`, `art-title`, `background`.
   - Use `scripts/build_pptx_from_manifest.py` when the deck follows the workspace manifest contract.
   - Generate preview PNGs from the same manifest for fast visual review.
   - Keep scripts deterministic and rerunnable; avoid manual edits that cannot be reproduced unless recording them in QA notes.

6. **Validate and iterate**
   - Run package checks, image checks, shape-count checks, forbidden-text scans, visual preview review, and UTF-8/mojibake scans.
   - Use `scripts/validate_pptx_artifact.py` for baseline validation and `--strict-final` for final-delivery gating.
   - Apply the stronger checklist in `references/quality-gates.md` before calling a PPTX finished.
   - If a slide fails, fix the smallest responsible artifact: brief, prompt, layer, manifest, or assembly code.

7. **Deliver**
   - Final output should include PPTX, rendered preview/PDF when possible, slide previews, manifests, source scripts, QA report, and known gaps.
   - State clearly whether PowerPoint desktop open/save verification was performed. If not, mark it as a remaining gate.

## Resource Use

- `scripts/scaffold_pptx_project.py`: create the recommended workspace and starter brief/plan/QA files.
- `scripts/build_pptx_from_manifest.py`: assemble manifest-defined image/text elements into PPTX and preview PNG files.
- `scripts/validate_pptx_artifact.py`: inspect a PPTX package for common structural, media, shape, forbidden-text, and optional UTF-8 issues.
- `references/guangyaoyilu-lessons.md`: lessons distilled from this project's final stable delivery workflow.
- `references/workspace-contract.md`: folder contract, manifest schema, layer naming, image-generation prompts, and native-object rules.
- `references/quality-gates.md`: baseline smoke, final strict validation, and delivery checklist.
