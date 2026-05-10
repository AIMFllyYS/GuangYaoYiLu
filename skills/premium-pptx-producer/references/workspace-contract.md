# Workspace Contract

Use this structure unless the user already has a stronger project convention.

```text
project/
  00_input/
    requirements/
    source-docs/
    source-images/
    logos/
    brand/
  01_brief/
    deck_brief.md
    slide_plan.csv
  02_generation/
    image_prompts/
    generated_full_slides/
    generated_layers/
  03_assembly/
    manifests/
    scripts/
    single_slides/
    previews/
  04_final/
    pptx/
    pdf/
    rendered/
  05_qa/
    asset_inventory.json
    qa_report.md
```

## Slide Manifest

Each slide manifest should be UTF-8 JSON and use pixel coordinates against a declared canvas.
Manifests live under `03_assembly/manifests/` and are resolved relative to the workspace root unless a file path is absolute.

Required top-level fields:

- `slide`: 1-based slide number.
- `canvas`: pixel canvas object with `w` and `h`.
- `elements`: array of slide objects.

Required element fields:

- `id`: stable semantic id.
- `type`: `image`, `text`, or `shape`.
- `source`: provenance such as `native`, `official_asset`, `real_photo`, `generated_background`, `generated_layer`, or `visual_guess`.
- `bbox`: pixel rectangle with `x`, `y`, `w`, `h`.
- `z`: stacking order, lower first.
- `editable`: true only for native PPTX objects.

Image elements also require `file`. Text elements also require `text`, `font`, `font_size`, `color`, and `align`.

```json
{
  "slide": 1,
  "canvas": {"w": 1920, "h": 1080},
  "elements": [
    {
      "id": "background",
      "type": "image",
      "source": "generated_background",
      "file": "../generated_layers/slide_01/background.png",
      "bbox": {"x": 0, "y": 0, "w": 1920, "h": 1080},
      "z": 0,
      "editable": false,
      "animation_group": "background"
    },
    {
      "id": "subtitle",
      "type": "text",
      "source": "native",
      "text": "Editable subtitle",
      "bbox": {"x": 220, "y": 420, "w": 900, "h": 70},
      "z": 80,
      "font": "Microsoft YaHei",
      "font_size": 28,
      "color": "RGB(45,106,69)",
      "align": "center",
      "editable": true,
      "animation_group": "text"
    }
  ]
}
```

## Element Rules

- Use semantic ids, not layout-grid names. Prefer `photo-01`, `chart-main`, `timeline-line`, `logo-primary`, `art-title`.
- Use `source` honestly: `native`, `official_asset`, `real_photo`, `generated_background`, `generated_layer`, or `visual_guess`.
- Use `editable: true` only for native PPTX text, shapes, tables, or charts.
- Keep generated layer PNGs at full canvas size when transparency matters. This avoids coordinate drift and brittle cropping.
- Record z-order as the actual intended stacking order.

## Text Rules

- Body text, labels, captions, and quotes should be native PPTX text.
- Artistic calligraphy or decorative title art may be PNG if the visual style is more important than editability.
- Do not burn page numbers, placeholder text, dense body paragraphs, or long quotes into generated images.

## Asset Rules

- Official logos: preserve aspect ratio; use direct placement; do not stylize without permission.
- Real photos: keep original copies in `00_input/source-images`; place processed/cropped copies in `02_generation/generated_layers` only when needed.
- Generated visuals: keep prompts with their output paths so a slide can be regenerated.

## Visual Master Prompt Template

Use this when generating a full-slide visual master for later splitting:

```text
Create a high-end 16:9 slide visual master at 1920x1080.
Style and mood: <deck style>.
Slide purpose: <one sentence>.
Composition: <major regions and visual hierarchy>.

Hard constraints:
- Keep the top-left logo area clean and empty.
- Do not include page numbers, placeholder labels, watermarks, or UI control text.
- Do not burn long paragraphs, quotes, captions, or dense body copy into the image.
- Leave clear contrast between foreground elements and background so layers can be separated later.
- Keep real-photo slots clean, rectangular, and uncluttered if photos will be inserted later.
- Preserve object boundaries for decorative props, figures, title art, and infographics.
```

## Transparent Layer Prompt Template

Use this when generating a separate PNG layer for composition:

```text
Create only the <element name> layer for slide <number>.
Canvas must remain 1920x1080.
The element must appear at approximately x=<x>, y=<y>, w=<w>, h=<h>.
Everything outside the element must be transparent alpha.
No background texture, no page number, no placeholder text, no watermark.
Do not include body paragraphs or captions.
Make edges clean enough for PPTX overlay composition.
```
