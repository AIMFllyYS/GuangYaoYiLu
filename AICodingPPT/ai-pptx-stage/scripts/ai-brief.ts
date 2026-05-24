import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDeck } from "./export-pptx";
import type { AssetElement, DeckSpec, GroupElement, SlideElement } from "../src/deck/types";

async function main() {
  const deckId = readValue(process.argv.slice(2), "--deck");
  if (!deckId) {
    throw new Error("Missing required --deck <deck-id>.");
  }

  const { deck, close } = await loadDeck(deckId);
  try {
    const brief = await buildBrief(deck);
    const out = readValue(process.argv.slice(2), "--out") ?? path.resolve("dist/ai-briefs", `${deckId}.md`);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, brief, "utf8");
    console.log(`AI brief written: ${out}`);
  } finally {
    await close();
  }
}

async function buildBrief(deck: DeckSpec) {
  const assets = collectAssets(deck);
  const gaps = collectGaps(deck, assets);
  const lines = [
    `# AI Brief: ${deck.title}`,
    "",
    "## Deck",
    `- id: ${deck.id}`,
    `- slides: ${deck.slides.length}`,
    `- source: ${deck.sourcePath ?? "-"}`,
    `- theme: ${deck.theme.name}`,
    "",
    "## Slide Outline"
  ];

  for (const slide of deck.slides) {
    const elements = flattenElements(slide.elements);
    const imageCount = elements.filter((element) => element.type === "image").length;
    const morphCount = elements.filter((element) => Boolean(element.morphKey)).length;
    const notes = await readSlideNotes(slide.sourcePath);
    lines.push(`- ${slide.id}: ${slide.title}`);
    lines.push(`  - elements: ${elements.length}, images: ${imageCount}, morphKeys: ${morphCount}`);
    lines.push(`  - transition: ${slide.transition?.type ?? "none"} ${slide.transition?.durationMs ?? ""}`.trimEnd());
    if (notes) {
      lines.push(`  - notes: ${firstNonEmptyLine(notes)}`);
    }
  }

  lines.push("", "## Asset Index");
  if (assets.length === 0) {
    lines.push("- No image assets detected.");
  } else {
    for (const asset of assets) {
      lines.push(`- ${asset.slideId}/${asset.elementId}: ${asset.kind} ${asset.label}`);
    }
  }

  lines.push("", "## Gap List");
  if (gaps.length === 0) {
    lines.push("- No obvious local authoring gaps detected.");
  } else {
    for (const gap of gaps) {
      lines.push(`- ${gap}`);
    }
  }

  lines.push(
    "",
    "## Prompt Seed",
    "请基于以上 deck 结构逐页更新 TS 页面。保持 UTF-8 中文安全；普通新作只改 src/decks/<deck-id>/**；复杂视觉先用原生 text/rect/image/line/ellipse 近似；所有 Morph 对象使用 !!objectName。"
  );

  return `${lines.join("\n")}\n`;
}

function collectAssets(deck: DeckSpec) {
  return deck.slides.flatMap((slide) =>
    flattenElements(slide.elements)
      .filter((element): element is AssetElement => element.type === "image" || element.type === "icon")
      .map((element) => ({
        slideId: slide.id,
        elementId: element.id,
        kind: element.type,
        label: describeAsset(element.asset)
      }))
  );
}

function collectGaps(deck: DeckSpec, assets: ReturnType<typeof collectAssets>) {
  const gaps: string[] = [];
  const assetSlides = new Set(assets.filter((asset) => asset.kind === "image").map((asset) => asset.slideId));

  for (const slide of deck.slides) {
    if (!assetSlides.has(slide.id)) {
      gaps.push(`${slide.id}: no image asset; confirm whether page should remain fully native/editable.`);
    }
    if (!slide.transition) {
      gaps.push(`${slide.id}: transition is missing.`);
    }
    const morphKeys = flattenElements(slide.elements).filter((element) => Boolean(element.morphKey)).length;
    if (morphKeys === 0) {
      gaps.push(`${slide.id}: no Morph keys found.`);
    }
  }

  return gaps;
}

function flattenElements(elements: SlideElement[]): SlideElement[] {
  const flat: SlideElement[] = [];
  for (const element of elements) {
    flat.push(element);
    if (element.type === "group") {
      flat.push(...flattenElements((element as GroupElement).children));
    }
  }
  return flat;
}

async function readSlideNotes(sourcePath: string | undefined) {
  if (!sourcePath) {
    return "";
  }

  try {
    return await readFile(path.join(path.dirname(sourcePath), "notes.md"), "utf8");
  } catch {
    return "";
  }
}

function firstNonEmptyLine(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? "";
}

function describeAsset(asset: string) {
  if (asset.startsWith("data:")) {
    return asset.slice(0, asset.indexOf(",") === -1 ? 48 : asset.indexOf(","));
  }
  if (/^https?:\/\//i.test(asset)) {
    return asset;
  }
  try {
    const url = new URL(asset);
    if (url.protocol === "file:") {
      return path.relative(process.cwd(), fileURLToPath(url)).replaceAll(path.sep, "/");
    }
  } catch {
    // Plain path.
  }
  return asset;
}

function readValue(values: string[], name: string) {
  const index = values.indexOf(name);
  return index === -1 ? undefined : values[index + 1];
}

await main();
