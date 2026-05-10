# Quality Gates

Run these gates before calling a PPTX finished.

## Package Gate

- ZIP CRC passes.
- Required PPTX parts exist: `[Content_Types].xml`, `_rels/.rels`, `ppt/presentation.xml`, presentation rels.
- Prefer packages that include slide masters, slide layouts, theme, and presentation properties.
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
Package validation:
Visual validation:
PowerPoint/open-save validation:
UTF-8 scan:
Known gaps:
```
