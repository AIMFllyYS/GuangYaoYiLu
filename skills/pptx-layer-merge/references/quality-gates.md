# Quality Gates

Run these gates before calling a PPTX finished. Treat `baseline smoke` as the first technical check and `final strict` as the delivery gate.

## Baseline Smoke

- The file is a readable PPTX zip.
- Core package relationships resolve.
- Slides and media can be counted.
- Media images can be decoded.
- Forbidden placeholder text is absent from slide XML.

Passing baseline smoke means "the artifact is inspectable"; it does not prove the deck is final-delivery safe.

## Package Gate

- ZIP CRC passes.
- Required PPTX parts exist: `[Content_Types].xml`, `_rels/.rels`, `ppt/presentation.xml`, presentation rels.
- Final strict packages include slide masters, slide layouts, theme, and presentation properties.
- Relationship targets resolve and do not point to unexpected external files.
- Slide count matches expectation.
- Media files are readable by Pillow or an equivalent image decoder.

## Shape Gate

- Each slide has more than one object unless the user explicitly requested image-only emergency delivery.
- Editable decks contain native text boxes for normal text.
- Logos and real photos are separate picture shapes.
- Important shapes have stable names when the generator supports naming.
- No forbidden placeholder/page-number text appears in slide XML.

## Visual Gate

- Preview all slides as images or PDF.
- Check top-left or brand zones are clean and logos are not stretched.
- Check text does not overflow, overlap, or become unreadable.
- Check generated layers align with real photos and native text.
- Check no accidental old page numbers, placeholder boxes, or model artifacts remain.

## Chinese/UTF-8 Gate

- Use explicit UTF-8 for `.md`, `.json`, `.csv`, `.xml`, and scripts.
- Scan text files for replacement character, common mojibake fragments, and accidental non-UTF8 decoding.
- Do not use shell defaults that may rewrite Chinese content in legacy encodings.

## Application Gate

At least one of these should pass for final delivery:

- Microsoft PowerPoint opens the PPTX without repair prompts.
- PowerPoint opens and saves a clean copy.
- LibreOffice headless converts to PDF successfully.
- A trusted presentation runtime loads, inspects, and exports the deck.

If none is available, report the missing application-level verification as a known gap.

## Final Strict

Use strict validation for deliverables intended to leave the workspace:

- No missing master/layout/theme/presentation properties.
- No external relationships.
- No slide is a single flattened picture unless explicitly allowed as emergency static delivery.
- At least one native text shape exists when the deck claims editable text.
- Shape statistics are reported for every slide.
- Application-level validation status is stated clearly, even when unavailable.

## Skill Self-Validation

Before changing this skill, validate the package itself and a temporary Chinese-titled smoke workspace:

```powershell
py -3.12 "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" .\skills\pptx-layer-merge
python .\skills\pptx-layer-merge\scripts\scaffold_pptx_project.py $env:TEMP\pptx-layer-merge-scaffold-smoke --title "广曜一路答辩测试" --slides 2 --force
python .\skills\pptx-layer-merge\scripts\build_pptx_from_manifest.py <temp-workspace> --manifest-dir 03_assembly\manifests --out 04_final\pptx\smoke.pptx --preview-dir 03_assembly\previews --expected-slides 2
python .\skills\pptx-layer-merge\scripts\validate_pptx_artifact.py <temp-workspace>\04_final\pptx\smoke.pptx --expected-slides 2 --scan-text-root .\skills\pptx-layer-merge
git diff --check -- skills\pptx-layer-merge
```

Delete temporary smoke workspaces after the checks.

## Delivery Report

Include:

```text
PPTX:
Preview/PDF:
Generator:
Template parent:
Native text:
Native pictures:
Native shapes/tables/charts:
Handwritten OOXML:
Single-image slide count:
Package validation:
Visual validation:
PowerPoint/open-save validation:
UTF-8 scan:
Known gaps:
```
