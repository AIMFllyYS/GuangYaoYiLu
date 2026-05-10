# GuangYaoYiLu-Derived PPTX Lessons

These rules are distilled from this project only, especially `交付物/答辩PPT_legacy`（历史 prompt）、`交付物/快速答辩`（当前快速构建）, and the local PPT generation reports.

## Production Shape

The strongest workflow was not a single all-in-one generator. It was a foldered production line:

```text
full-all-slides/       reference or generated full-slide images
new_full_slides/       cleaned visual masters
layers/slide_XX/       full-canvas transparent or opaque element PNGs
single_slides/         one-slide PPTX files for review
preview/               rendered or simulated previews
prompt/                master workflow and slide catalog
scripts/               repeatable build scripts
final/                 merged final PPTX/PDF
```

For a new project, keep the same logic but use neutral stage names from `workspace-contract.md`.

## What Worked

- Generate the beautiful full-page visual direction first, then split it into layers that can be composed.
- Make the image prompt explicitly friendly to later splitting: simple logo area, no page numbers, no placeholder labels, no long body text, and clear object boundaries.
- Keep official logos and real photos outside image generation. Place them directly in PPTX with controlled size and crop.
- Use manifest-driven assembly. The manifest is the contract between visual design, image layers, native text, and PPTX placement.
- Generate previews next to PPTX output. A deck is not done just because the package saves.
- Use python-pptx or another mature generator for the actual PPTX. It creates the master/layout/theme structure that hand-written packages often miss.

## What Failed Or Was Risky

- A ZIP package that passes shallow checks can still be PowerPoint-damaged if master, layout, theme, presentation properties, or timing XML are wrong.
- Handwriting complete OOXML and animation timing is high risk. Do not make it the default path.
- Cropping an AI image into `header`, `left_field`, `center_field`, and similar regions is visual slicing, not element-level PPT editing.
- A full-slide PNG as the only object is acceptable only for emergency static delivery. It is not a real editable deck.
- UTF-8 scans are necessary for Chinese projects, but clean encoding does not prove the PPTX package is healthy.

## Stable Deck Bias

For urgent or high-stakes delivery, bias toward:

1. static deck first,
2. clean template or mature library,
3. native text and picture objects,
4. preview and package validation,
5. PowerPoint open/save confirmation before final handoff.
