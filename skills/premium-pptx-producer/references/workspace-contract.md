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
