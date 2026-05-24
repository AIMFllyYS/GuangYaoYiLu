import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer, type ViteDevServer } from "vite";
import { exportDeckToPptx, type PptxAssetSource } from "../src/deck/pptx-export";
import { applyMorphTransitions, inspectPptxPackage } from "../src/deck/pptx-package";
import type { AssetElement, DeckSpec, SlideSpec } from "../src/deck/types";

export type ExportCliOptions = {
  deckId: string;
  out: string;
  includeNotes: boolean;
  strict: boolean;
};

type DeckModule = {
  default?: DeckSpec;
  deck?: DeckSpec;
};

export async function loadDeck(deckId: string): Promise<{ deck: DeckSpec; close: () => Promise<void> }> {
  const server = await createServer({
    appType: "custom",
    logLevel: "error",
    server: { middlewareMode: true }
  });

  try {
    const module = await server.ssrLoadModule(`/src/decks/${deckId}/deck.ts?t=${Date.now()}`) as DeckModule;
    const deck = module.default ?? module.deck;
    if (!deck) {
      throw new Error(`Deck module "${deckId}" did not export a DeckSpec.`);
    }
    return { deck, close: () => closeServer(server) };
  } catch (error) {
    await closeServer(server);
    throw error;
  }
}

export async function nodeResolveAsset(asset: string): Promise<PptxAssetSource> {
  if (asset.startsWith("data:")) {
    return { data: asset };
  }

  if (/^https?:\/\//.test(asset)) {
    return { path: asset };
  }

  try {
    const url = new URL(asset);
    if (url.protocol === "file:") {
      return { path: fileURLToPath(url) };
    }
  } catch {
    // Plain local path; resolved below.
  }

  return { path: path.isAbsolute(asset) ? asset : path.resolve(process.cwd(), asset) };
}

export async function runExport(options: ExportCliOptions) {
  const { deck, close } = await loadDeck(options.deckId);

  try {
    const outputPath = path.resolve(options.out);
    const result = await exportDeckToPptx<Uint8Array>(deck, {
      deckId: options.deckId,
      out: outputPath,
      includeNotes: options.includeNotes,
      strict: options.strict,
      outputType: "uint8array",
      resolveAsset: (asset: string, element: AssetElement, slide: SlideSpec) => nodeResolveAsset(asset)
    });
    const data = Buffer.from(await applyMorphTransitions(result.data, deck));
    const inspection = await inspectPptxPackage(data);

    if (inspection.slideCount !== deck.slides.length) {
      throw new Error(`Expected ${deck.slides.length} slide(s), got ${inspection.slideCount}.`);
    }
    if (inspection.hasMojibake) {
      throw new Error(`PPTX XML mojibake detected in ${inspection.mojibakeFiles.join(", ")}.`);
    }
    if (inspection.missingEntries.length > 0) {
      throw new Error(`PPTX package missing entries: ${inspection.missingEntries.join(", ")}.`);
    }

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, data);

    const reportPath = `${outputPath}.report.json`;
    await writeFile(
      reportPath,
      `${JSON.stringify({ ...result.report, package: inspection }, null, 2)}\n`,
      "utf8"
    );

    return {
      outputPath,
      reportPath,
      report: result.report,
      package: inspection
    };
  } finally {
    await close();
  }
}

function parseCliArgs(argv: string[]): ExportCliOptions {
  const deckId = readValue(argv, "--deck");
  const out = readValue(argv, "--out") ?? (deckId ? `dist/exports/${deckId}.editable.pptx` : undefined);

  if (!deckId) {
    throw new Error("Missing required --deck <deck-id>.");
  }
  if (!out) {
    throw new Error("Missing required --out <file.pptx>.");
  }

  return {
    deckId,
    out,
    includeNotes: argv.includes("--include-notes"),
    strict: argv.includes("--strict")
  };
}

function readValue(argv: string[], name: string) {
  const index = argv.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return argv[index + 1];
}

async function closeServer(server: ViteDevServer) {
  await server.close();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runExport(parseCliArgs(process.argv.slice(2)))
    .then((result) => {
      console.log(JSON.stringify({
        outputPath: result.outputPath,
        slideCount: result.package.slideCount,
        mediaCount: result.package.mediaCount,
        warnings: result.report.warnings.length,
        unsupportedEffects: result.report.unsupportedEffects.length,
        reportPath: result.reportPath
      }, null, 2));
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
