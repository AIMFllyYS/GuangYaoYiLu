---
name: pptx-layer-merge
description: Create high-end, real, editable PowerPoint/PPTX decks from uploaded materials and requirements. Use when Codex needs to build or substantially refine a professional or premium deck, organize source files, generate image-first visual masters, split generated visuals into reusable layers, handle real photos or logos, assemble slides with native PPTX text/pictures/shapes, or validate a PPTX deliverable for package health, visual QA, and UTF-8 safety.
---

# PPTX-Layer-merge

## Operating Rules

- Preserve UTF-8. Read and write Chinese text with explicit UTF-8 encoding.
- Treat user materials as evidence. Do not invent names, logos, dates, awards, or quoted facts unless the user explicitly asks for creative filler.
- Start by organizing the working folder before making slides. Use `scripts/scaffold_pptx_project.py` when no clean structure exists.
- Prefer a mature PPTX generator: python-pptx, PptxGenJS, PowerPoint/Codex presentation runtime, or a clean template parent. Do not handwrite a full OOXML ZIP package.
- Keep the first stable version static and robust. Add animation only after the static PPTX opens cleanly and visual QA passes.
- Do not flatten the whole deck into one image per slide when editability matters. Backgrounds can be raster images; titles, body copy, logos, real photos, charts, and labels should be native PPTX objects whenever practical.

## Mode Selection

- **Premium / high-end / professional deck is image-first by default.** If the user asks for a polished, premium, high-end, professional, visually designed, impressive, presentation-ready, or substantially refined deck, use the full layer-merge workflow unless the user explicitly forbids AI-generated visuals or asks for a simple static editable deck.
- **Simple editable deck is a downgrade path, not the default premium path.** Existing photos + native PPT shapes + text can be appropriate for speed, compliance, or strict editability, but label that output as an `editable clean deck`, not a `premium layer-merged deck`.
- **Ask or state the mode before building when ambiguous.** If time permits, confirm `premium image-first` versus `clean editable`; otherwise choose `premium image-first` for premium wording and record the assumption in the brief.
- **Do not skip visual masters for premium work.** A premium deck needs visual master images, layer extraction/preparation, manifests, editable native text, previews, and strict QA. Skipping visual-master and layer phases is allowed only when the user explicitly selects the clean/static path or when policy, rights, medical/legal accuracy, or deadline constraints make image generation inappropriate.

## Workflow

1. **Ingest and sort materials**
   - Create a project workspace with `00_input`, `01_brief`, `02_generation`, `03_assembly`, `04_final`, and `05_qa`.
   - Separate requirements, source documents, source images, logos, generated full-slide images, generated layers, manifests, assembly scripts, previews, and final deliverables.
   - Build an asset inventory before design decisions: file type, source, likely role, and whether the asset must remain real/unmodified.

2. **Write the deck brief**
   - Summarize audience, purpose, output format, slide ratio, language, brand constraints, must-use assets, and non-negotiable facts.
   - Convert user requirements into a slide plan with one row per slide: goal, narrative role, core message, evidence files, visual type, generated-image need, real-photo need, and QA notes.
   - Record the selected build mode: `premium image-first layer-merge`, `clean editable static`, or `hybrid`. Include the reason and any explicit user constraints.
   - Read `references/guangyaoyilu-lessons.md` for the project-derived production pattern.

3. **Design visual masters**
   - For premium mode, generate or design full-slide visual masters before assembly. Use image-to-image, style-transfer, or visual-composition generation when source materials exist and the task benefits from a distinctive visual direction.
   - Prompt masters to be layer-friendly: clean logo zone, no page numbers, no placeholder text, clear object boundaries, high contrast between subjects and background, and no long paragraphs burned into the image.
   - Keep artistic title lettering as generated image art only when it is a visual anchor; keep ordinary titles, captions, labels, body text, and quotes as editable PPTX text.
   - Keep medical, legal, financial, or evidence-sensitive facts out of generated images. Put those facts in native PPT text, tables, charts, or source notes.

4. **Split into composition layers**
   - Generate, cut out, or otherwise prepare full-canvas PNG layers from visual masters. Use transparent alpha where possible; acceptable layer ids include `background`, `deco_border`, `deco_props`, `art_title`, `figure`, `infograph`, `mask`, `logo`, and `photo_*`.
   - For image-first work, do not merely crop rectangular regions from a finished image and call them layers. Separate semantic objects whenever practical: background texture, decorative props, figure/scene, photo masks, chart frame, and accent art.
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
   - For premium mode, verify that each designed slide has a real composition structure: visual master or generated layer evidence, at least one non-text visual layer or real photo, native text for ordinary copy, and no slide flattened to a single full-slide picture.
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
