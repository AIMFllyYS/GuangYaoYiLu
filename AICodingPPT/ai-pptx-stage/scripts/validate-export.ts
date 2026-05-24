import { access, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { runExport } from "./export-pptx";
import type { DeckSpec, GroupElement, SlideElement } from "../src/deck/types";

type ExportFinding = {
  level: "error" | "warning";
  deckId: string;
  message: string;
};

async function main() {
  const deckIds = await requestedDeckIds(process.argv.slice(2));
  const findings: ExportFinding[] = [];
  const reports = [];

  for (const deckId of deckIds) {
    const out = path.resolve("dist/exports/validation", `${deckId}.editable.pptx`);
    const result = await runExport({ deckId, out, includeNotes: false, strict: false });
    const deckFindings = validateExportedDeck(result.deck, result.package);
    findings.push(...deckFindings);
    reports.push({
      deckId,
      out,
      reportPath: result.reportPath,
      package: result.package,
      unsupportedEffects: result.report.unsupportedEffects.length,
      findings: deckFindings
    });
  }

  const reportPath = path.resolve("dist/reports/validate-export.json");
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify({ reports, findings }, null, 2)}\n`, "utf8");

  const errors = findings.filter((finding) => finding.level === "error");
  if (errors.length > 0) {
    console.error(`Export validation failed with ${errors.length} error(s). Report: ${reportPath}`);
    for (const error of errors.slice(0, 10)) {
      console.error(`- ${error.deckId}: ${error.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Export validation passed for ${deckIds.length} deck(s). Report: ${reportPath}`);
}

function validateExportedDeck(deck: DeckSpec, inspection: Awaited<ReturnType<typeof runExport>>["package"]) {
  const findings: ExportFinding[] = [];
  const expectedObjectNames = collectExpectedObjectNames(deck);
  const actualObjectNames = new Set(inspection.objectNames);
  const missingObjectNames = expectedObjectNames.filter((name) => !actualObjectNames.has(name));
  const expectedMorph = deck.slides.slice(1).some((slide) => slide.transition?.type === "morph");
  const expectedImages = collectElements(deck).filter((element) => element.type === "image").length;

  if (inspection.slideCount !== deck.slides.length) {
    findings.push(exportFinding("error", deck.id, `Slide count mismatch: expected ${deck.slides.length}, got ${inspection.slideCount}.`));
  }
  if (inspection.hasMojibake) {
    findings.push(exportFinding("error", deck.id, `Mojibake marker found in ${inspection.mojibakeFiles.join(", ")}.`));
  }
  if (inspection.missingEntries.length > 0) {
    findings.push(exportFinding("error", deck.id, `Missing package entries: ${inspection.missingEntries.join(", ")}.`));
  }
  if (expectedImages > 0 && inspection.mediaCount === 0) {
    findings.push(exportFinding("error", deck.id, "Deck has image elements but exported PPTX has no media files."));
  }
  if (expectedMorph && !inspection.hasMorphTransitions) {
    findings.push(exportFinding("error", deck.id, "Deck uses Morph transitions but exported PPTX has no Morph transition XML."));
  }
  if (missingObjectNames.length > 0) {
    findings.push(exportFinding("error", deck.id, `Missing objectName entries: ${missingObjectNames.slice(0, 12).join(", ")}.`));
  }

  return findings;
}

function collectExpectedObjectNames(deck: DeckSpec) {
  return collectElements(deck)
    .filter((element) => element.type !== "group")
    .map((element) => element.pptx.objectName || element.morphKey)
    .filter((name): name is string => Boolean(name?.startsWith("!!")))
    .filter((name, index, names) => names.indexOf(name) === index)
    .sort();
}

function collectElements(deck: DeckSpec) {
  return deck.slides.flatMap((slide) => flattenElements(slide.elements));
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

function exportFinding(level: "error" | "warning", deckId: string, message: string): ExportFinding {
  return { level, deckId, message };
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
