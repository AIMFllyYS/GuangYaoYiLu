import { mkdir, readdir, access, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadDeck } from "./export-pptx";
import { DECK_HEIGHT, DECK_WIDTH, type DeckSpec, type GroupElement, type SlideElement, type TextElement } from "../src/deck/types";

type FlatElement = SlideElement & {
  absoluteX: number;
  absoluteY: number;
};

type LayoutFinding = {
  level: "error" | "warning";
  deckId: string;
  slideId: string;
  elementId: string;
  message: string;
};

async function main() {
  const deckIds = await requestedDeckIds(process.argv.slice(2));
  const findings: LayoutFinding[] = [];
  let checked = 0;

  for (const deckId of deckIds) {
    const { deck, close } = await loadDeck(deckId);
    try {
      const result = validateDeckLayout(deck);
      findings.push(...result.findings);
      checked += result.checked;
    } finally {
      await close();
    }
  }

  const reportPath = path.resolve("dist/reports/validate-layout.json");
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify({ checked, findings }, null, 2)}\n`, "utf8");

  const errors = findings.filter((finding) => finding.level === "error");
  if (errors.length > 0) {
    console.error(`Layout validation failed with ${errors.length} error(s). Report: ${reportPath}`);
    for (const error of errors.slice(0, 10)) {
      console.error(`- ${error.deckId}/${error.slideId}/${error.elementId}: ${error.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Layout validation passed. Checked ${checked} element(s). Report: ${reportPath}`);
}

function validateDeckLayout(deck: DeckSpec) {
  const findings: LayoutFinding[] = [];
  let checked = 0;

  for (const slide of deck.slides) {
    const elements = flattenElements(slide.elements).filter((element) => element.visible !== false);
    checked += elements.length;

    for (const element of elements) {
      findings.push(...validateElementBounds(deck.id, slide.id, element));
      if (element.type === "text") {
        findings.push(...validateTextFit(deck.id, slide.id, element));
      }
    }

    findings.push(...validateTextOverlaps(deck.id, slide.id, elements));
  }

  return { checked, findings };
}

function validateElementBounds(deckId: string, slideId: string, element: FlatElement) {
  const findings: LayoutFinding[] = [];
  const values = [element.absoluteX, element.absoluteY, element.w, element.h, element.z];
  if (!values.every(Number.isFinite)) {
    return [layoutFinding("error", deckId, slideId, element.id, "Element has non-finite geometry.")];
  }
  if (element.type === "line" && (element.w > 0 || element.h > 0)) {
    return findings;
  }
  if (element.w <= 0 || element.h <= 0) {
    return [layoutFinding("error", deckId, slideId, element.id, "Element width/height must be positive.")];
  }

  const right = element.absoluteX + element.w;
  const bottom = element.absoluteY + element.h;
  const fullyOutside = right < 0 || bottom < 0 || element.absoluteX > DECK_WIDTH || element.absoluteY > DECK_HEIGHT;
  const partlyOutside = element.absoluteX < 0 || element.absoluteY < 0 || right > DECK_WIDTH || bottom > DECK_HEIGHT;

  if (fullyOutside && !element.morphKey) {
    findings.push(layoutFinding("warning", deckId, slideId, element.id, "Element is fully outside the slide and has no Morph key."));
  } else if (partlyOutside && !element.morphKey) {
    findings.push(layoutFinding("warning", deckId, slideId, element.id, "Element partly exceeds the slide bounds without a Morph key."));
  }

  return findings;
}

function validateTextFit(deckId: string, slideId: string, element: FlatElement & TextElement) {
  const fontSize = element.style.fontSize ?? 28;
  const lineHeight = element.style.lineHeight ?? 1.2;
  const charsPerLine = Math.max(1, Math.floor(element.w / Math.max(1, fontSize * 0.56)));
  const estimatedLines = element.content.split("\n").reduce((sum, line) => sum + Math.max(1, Math.ceil([...line].length / charsPerLine)), 0);
  const requiredHeight = estimatedLines * fontSize * lineHeight;

  if (requiredHeight > element.h * 1.35) {
    return [layoutFinding("warning", deckId, slideId, element.id, `Text may overflow: estimated ${Math.round(requiredHeight)}px needed for ${element.h}px box.`)];
  }

  return [];
}

function validateTextOverlaps(deckId: string, slideId: string, elements: FlatElement[]) {
  const findings: LayoutFinding[] = [];
  const texts = elements.filter((element): element is FlatElement & TextElement => element.type === "text");

  for (let leftIndex = 0; leftIndex < texts.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < texts.length; rightIndex += 1) {
      const left = texts[leftIndex];
      const right = texts[rightIndex];
      if (!left || !right || Math.abs(left.z - right.z) > 4) {
        continue;
      }

      const overlap = intersectionArea(left, right);
      const smaller = Math.min(left.w * left.h, right.w * right.h);
      if (smaller > 0 && overlap / smaller > 0.72) {
        findings.push(layoutFinding("warning", deckId, slideId, left.id, `Text strongly overlaps ${right.id}.`));
      }
    }
  }

  return findings;
}

function flattenElements(elements: SlideElement[], offsetX = 0, offsetY = 0): FlatElement[] {
  const flat: FlatElement[] = [];
  for (const element of elements) {
    const absoluteX = offsetX + element.x;
    const absoluteY = offsetY + element.y;
    flat.push({ ...element, absoluteX, absoluteY });
    if (element.type === "group") {
      flat.push(...flattenElements((element as GroupElement).children, absoluteX, absoluteY));
    }
  }
  return flat;
}

function intersectionArea(left: FlatElement, right: FlatElement) {
  const x = Math.max(0, Math.min(left.absoluteX + left.w, right.absoluteX + right.w) - Math.max(left.absoluteX, right.absoluteX));
  const y = Math.max(0, Math.min(left.absoluteY + left.h, right.absoluteY + right.h) - Math.max(left.absoluteY, right.absoluteY));
  return x * y;
}

function layoutFinding(level: "error" | "warning", deckId: string, slideId: string, elementId: string, message: string): LayoutFinding {
  return { level, deckId, slideId, elementId, message };
}

async function requestedDeckIds(argv: string[]) {
  const deck = readValue(argv, "--deck");
  if (deck) {
    return [deck];
  }

  const entries = await readdir("src/decks", { withFileTypes: true });
  const ids: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    try {
      await access(path.join("src/decks", entry.name, "deck.ts"));
      ids.push(entry.name);
    } catch {
      // Not a deck folder.
    }
  }
  return ids.sort();
}

function readValue(argv: string[], name: string) {
  const index = argv.indexOf(name);
  return index === -1 ? undefined : argv[index + 1];
}

await main();
