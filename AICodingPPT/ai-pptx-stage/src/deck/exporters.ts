import { pptxParameterLines } from "./pptx";
import type { DeckSpec, SlideElement, SlideSpec } from "./types";

export function elementPatchSnippet(slide: SlideSpec, element: SlideElement): string {
  const sourceHeader = slide.sourcePath ? `// ${slide.sourcePath}\n` : "";
  return `${sourceHeader}overrideElement("${slide.id}", "${element.morphKey ?? element.id}", {
  x: ${element.x},
  y: ${element.y},
  w: ${element.w},
  h: ${element.h},
  rotate: ${element.rotate},
  opacity: ${element.opacity},
  z: ${element.z}
});`;
}

export function slidePptxChecklist(deck: DeckSpec, slide: SlideSpec): string {
  const lines = [
    `Deck: ${deck.title}`,
    `Deck source: ${deck.sourcePath ?? "-"}`,
    `Slide: ${slide.id} / ${slide.title}`,
    `Slide source: ${slide.sourcePath ?? "-"}`,
    `Canvas: ${deck.size.width} x ${deck.size.height}`,
    "",
    "PPTX Manual Sync Checklist"
  ];

  for (const element of [...slide.elements].sort((a, b) => a.z - b.z)) {
    lines.push("");
    lines.push(`- ${element.name}`);
    lines.push(`  id: ${element.id}`);
    lines.push(`  morphKey: ${element.morphKey ?? "-"}`);
    lines.push(`  type: ${element.type}`);
    for (const parameter of pptxParameterLines(element)) {
      lines.push(`  ${parameter}`);
    }
    lines.push(`  hint: ${element.pptx.copyHint}`);
  }

  return lines.join("\n");
}
