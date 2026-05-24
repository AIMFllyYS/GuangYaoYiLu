import { access, mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDeck } from "./export-pptx";
import type { AssetElement, DeckSpec, GroupElement, SlideElement } from "../src/deck/types";

type AssetFinding = {
  level: "error" | "warning";
  deckId: string;
  slideId: string;
  elementId: string;
  message: string;
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

async function main() {
  const deckIds = await requestedDeckIds(process.argv.slice(2));
  const findings: AssetFinding[] = [];
  let checked = 0;

  for (const deckId of deckIds) {
    const { deck, close } = await loadDeck(deckId);
    try {
      const result = await validateDeckAssets(deck);
      findings.push(...result.findings);
      checked += result.checked;
    } finally {
      await close();
    }
  }

  const reportPath = path.resolve("dist/reports/validate-assets.json");
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify({ checked, findings }, null, 2)}\n`, "utf8");

  const errors = findings.filter((finding) => finding.level === "error");
  if (errors.length > 0) {
    console.error(`Asset validation failed with ${errors.length} error(s). Report: ${reportPath}`);
    for (const error of errors.slice(0, 10)) {
      console.error(`- ${error.deckId}/${error.slideId}/${error.elementId}: ${error.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Asset validation passed. Checked ${checked} asset reference(s). Report: ${reportPath}`);
}

async function validateDeckAssets(deck: DeckSpec) {
  const findings: AssetFinding[] = [];
  let checked = 0;

  for (const slide of deck.slides) {
    for (const element of flattenElements(slide.elements)) {
      if (element.type !== "image" && element.type !== "icon") {
        continue;
      }

      checked += 1;
      if (element.type === "icon") {
        if (!element.asset.trim()) {
          findings.push(assetFinding("error", deck.id, slide.id, element, "Icon asset text is empty."));
        }
        continue;
      }

      findings.push(...await validateImageAsset(deck.id, slide.id, element));
    }
  }

  return { checked, findings };
}

async function validateImageAsset(deckId: string, slideId: string, element: AssetElement) {
  const findings: AssetFinding[] = [];
  const asset = element.asset.trim();

  if (!asset) {
    return [assetFinding("error", deckId, slideId, element, "Image asset path is empty.")];
  }

  if (asset.startsWith("data:")) {
    if (!/^data:image\/[^,]+,/i.test(asset)) {
      findings.push(assetFinding("error", deckId, slideId, element, "Data URI is not an image."));
    }
    return findings;
  }

  if (/^https?:\/\//i.test(asset)) {
    findings.push(assetFinding("warning", deckId, slideId, element, "Remote image is not embedded until export time."));
    return findings;
  }

  const filePath = toFilePath(asset);
  try {
    await access(filePath);
    const info = await stat(filePath);
    if (!info.isFile()) {
      findings.push(assetFinding("error", deckId, slideId, element, "Asset path is not a file."));
    }
    if (info.size === 0) {
      findings.push(assetFinding("error", deckId, slideId, element, "Asset file is empty."));
    }
    if (info.size > MAX_IMAGE_BYTES) {
      findings.push(assetFinding("warning", deckId, slideId, element, `Large image file: ${Math.round(info.size / 1024 / 1024)}MB.`));
    }
  } catch {
    findings.push(assetFinding("error", deckId, slideId, element, `Asset file is missing or unreadable: ${filePath}`));
  }

  return findings;
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

function assetFinding(level: "error" | "warning", deckId: string, slideId: string, element: AssetElement, message: string): AssetFinding {
  return { level, deckId, slideId, elementId: element.id, message };
}

function toFilePath(asset: string) {
  try {
    const url = new URL(asset);
    if (url.protocol === "file:") {
      return fileURLToPath(url);
    }
  } catch {
    // Treat as a local filesystem path below.
  }
  return path.isAbsolute(asset) ? asset : path.resolve(asset);
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
