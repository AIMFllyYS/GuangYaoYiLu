import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const id = readValue(argv, "--id");
const title = readValue(argv, "--title") ?? "新作 PPT";
const slides = Number(readValue(argv, "--slides") ?? 5);
const force = argv.includes("--force");

if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
  throw new Error("Missing or invalid --id <deck-id>. Use kebab-case, for example my-new-deck.");
}
if (!Number.isInteger(slides) || slides < 1 || slides > 80) {
  throw new Error("--slides must be an integer between 1 and 80.");
}

const deckDir = path.resolve("src/decks", id);
if (!force && await exists(deckDir)) {
  throw new Error(`Deck already exists: ${deckDir}. Pass --force to overwrite generated files.`);
}

await mkdir(path.join(deckDir, "pages"), { recursive: true });
await mkdir(path.join(deckDir, "assets"), { recursive: true });
await writeFile(path.join(deckDir, "deck.ts"), deckSource(id, title), "utf8");
await writeFile(path.join(deckDir, "theme.ts"), themeSource(title), "utf8");
await writeFile(path.join(deckDir, "README.md"), readmeSource(id, title, slides), "utf8");
await writeFile(path.join(deckDir, "assets", "README.md"), assetsReadmeSource(id), "utf8");

for (let index = 1; index <= slides; index += 1) {
  const pageId = `${String(index).padStart(3, "0")}-page-${String(index).padStart(2, "0")}`;
  const pageDir = path.join(deckDir, "pages", pageId);
  await mkdir(pageDir, { recursive: true });
  await writeFile(path.join(pageDir, "page.ts"), pageSource(pageId, index, slides, title), "utf8");
  await writeFile(path.join(pageDir, "notes.md"), notesSource(pageId, index), "utf8");
}

console.log(`Created deck ${id} with ${slides} slide(s): ${deckDir}`);

function deckSource(deckId, deckTitle) {
  return `import { defineDeck, wide16x9 } from "../../deck/authoring";
import { getSlidesForDeck } from "../pages";
import { theme } from "./theme";

export const deck = defineDeck({
  id: ${JSON.stringify(deckId)},
  title: ${JSON.stringify(deckTitle)},
  sourcePath: ${JSON.stringify(`src/decks/${deckId}/deck.ts`)},
  size: wide16x9,
  theme,
  slides: getSlidesForDeck(${JSON.stringify(deckId)})
});

export default deck;
`;
}

function themeSource(deckTitle) {
  return `export const theme = {
  name: ${JSON.stringify(deckTitle)},
  fontSans: "Microsoft YaHei UI, Microsoft YaHei, Noto Sans SC, sans-serif",
  fontSerif: "Noto Serif SC, SimSun, serif",
  colors: {
    paper: "#F7FAF8",
    ink: "#16231E",
    muted: "rgba(22,35,30,0.68)",
    accent: "#0F7A68",
    gold: "#C8A24A",
    white: "#FFFFFF"
  }
};
`;
}

function pageSource(pageId, index, total, deckTitle) {
  const pageTitle = index === 1 ? "封面草稿" : `第 ${index} 页草稿`;
  return `import { defineSlide, infoCard, pageNumber, sectionTitle, watermark } from "../../../../deck/authoring";

export const slide = defineSlide({
  id: ${JSON.stringify(pageId)},
  title: ${JSON.stringify(pageTitle)},
  background: "#F7FAF8",
  transition: {
    type: "morph",
    durationMs: 820,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    ...sectionTitle({
      id: "section-${String(index).padStart(2, "0")}",
      kicker: ${JSON.stringify(deckTitle)},
      title: ${JSON.stringify(pageTitle)}
    }),
    ...infoCard({
      id: "core-card-${String(index).padStart(2, "0")}",
      title: "核心信息",
      body: "在这里写本页观点、证据与画面意图。替换文字后运行 validate:layout 检查文本框空间。",
      x: 120,
      y: 360,
      w: 720,
      h: 300
    }),
    ...watermark({
      id: "deck-watermark",
      label: ${JSON.stringify(deckTitle)}
    }),
    ...pageNumber({
      id: "page-number-${String(index).padStart(2, "0")}",
      index: ${index},
      total: ${total}
    })
  ]
});

export default slide;
`;
}

function readmeSource(deckId, deckTitle, slideCount) {
  return `# ${deckTitle}

- Deck ID: \`${deckId}\`
- Slides: ${slideCount}
- Authoring boundary: edit only this deck folder for normal new-work creation.
- Export: \`npm run export:pptx -- --deck ${deckId}\`
- Brief: \`npm run ai:brief -- --deck ${deckId}\`

## Workflow
1. Fill each \`pages/*/notes.md\` with intent, evidence, asset needs, and revision notes.
2. Replace scaffold text in \`pages/*/page.ts\`.
3. Add local images to \`assets/\` and reference them with \`new URL("./assets/name.jpg", import.meta.url).href\` from nearby modules.
4. Run \`npm run validate:decks\`, \`npm run validate:assets\`, \`npm run validate:layout\`, then export.
`;
}

function assetsReadmeSource(deckId) {
  return `# ${deckId} assets

Place deck-local images here. Keep names lowercase kebab-case and prefer compressed JPG/PNG/WebP files.
`;
}

function notesSource(pageId, index) {
  return `# ${pageId}

## Intent
- Page ${index} message:
- Audience takeaway:

## Assets
- Required images:
- Source / rights:

## Review
- Visual risks:
- Export risks:
`;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function readValue(values, name) {
  const index = values.indexOf(name);
  return index === -1 ? undefined : values[index + 1];
}
