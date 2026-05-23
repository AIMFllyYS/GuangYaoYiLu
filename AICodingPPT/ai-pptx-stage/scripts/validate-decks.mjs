import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const decksDir = path.join(root, "src", "decks");
const errors = [];
const warnings = [];

const deckIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const pageIdPattern = /^\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const badTextPattern = /�|Ã|Â|锟/;
const forbiddenImportPattern = /import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;

function rel(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function fail(filePath, message) {
  errors.push(`${rel(filePath)}: ${message}`);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function listDirs(dirPath) {
  if (!exists(dirPath)) {
    return [];
  }
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function validateDeck(deckId) {
  const deckDir = path.join(decksDir, deckId);
  const deckFile = path.join(deckDir, "deck.ts");
  const themeFile = path.join(deckDir, "theme.ts");
  const readmeFile = path.join(deckDir, "README.md");
  const pagesDir = path.join(deckDir, "pages");

  if (!deckIdPattern.test(deckId)) {
    fail(deckDir, `deck folder must be kebab-case, got "${deckId}"`);
  }
  for (const required of [deckFile, themeFile, readmeFile, pagesDir]) {
    if (!exists(required)) {
      fail(required, "required deck file or folder is missing");
    }
  }
  if (!exists(deckFile)) {
    return;
  }

  const deckSource = readText(deckFile);
  if (badTextPattern.test(deckSource)) {
    fail(deckFile, "possible mojibake detected");
  }
  if (!new RegExp(`id\\s*:\\s*["']${escapeRegExp(deckId)}["']`).test(deckSource)) {
    fail(deckFile, `deck id must match folder name "${deckId}"`);
  }
  if (!deckSource.includes("defineDeck")) {
    fail(deckFile, "deck.ts must use defineDeck from src/deck/authoring");
  }
  if (!deckSource.includes("getSlidesForDeck")) {
    warnings.push(`${rel(deckFile)}: deck.ts should use getSlidesForDeck(deckId) so new page folders auto-load`);
  }

  const pageDirs = listDirs(pagesDir);
  if (pageDirs.length === 0) {
    fail(pagesDir, "deck must contain at least one pages/<page-id>/ folder");
  }

  for (const pageId of pageDirs) {
    validatePage(deckId, pageId);
  }
}

function validatePage(deckId, pageId) {
  const pageDir = path.join(decksDir, deckId, "pages", pageId);
  const pageFile = path.join(pageDir, "page.ts");
  const notesFile = path.join(pageDir, "notes.md");

  if (!pageIdPattern.test(pageId)) {
    fail(pageDir, `page folder must be 001-name style, got "${pageId}"`);
  }
  if (!exists(pageFile)) {
    fail(pageFile, "page.ts is required");
    return;
  }
  if (!exists(notesFile)) {
    fail(notesFile, "notes.md is required");
  }

  const source = readText(pageFile);
  if (badTextPattern.test(source)) {
    fail(pageFile, "possible mojibake detected");
  }
  if (!source.includes("defineSlide")) {
    fail(pageFile, "page.ts must create the slide through defineSlide");
  }
  if (!/(export\s+default|export\s+const\s+slide|export\s+\{\s*slide\s*\})/.test(source)) {
    fail(pageFile, "page.ts must export a SlideSpec as default or named slide");
  }
  if (!new RegExp(`id\\s*:\\s*["']${escapeRegExp(pageId)}["']`).test(source)) {
    fail(pageFile, `slide id must match page folder "${pageId}"`);
  }
  if (!source.includes("deck/authoring")) {
    fail(pageFile, "page.ts must import builders only through src/deck/authoring");
  }

  forbiddenImportPattern.lastIndex = 0;
  for (const match of source.matchAll(forbiddenImportPattern)) {
    const importPath = match[1];
    if (
      importPath === "react" ||
      importPath.startsWith("react/") ||
      importPath.includes("/components") ||
      importPath.includes("components/") ||
      importPath.includes("App") ||
      importPath.endsWith(".css") ||
      importPath.includes("styles.css")
    ) {
      fail(pageFile, `forbidden page import "${importPath}"`);
    }
  }

  const morphKeys = new Map();
  for (const match of source.matchAll(/morphKey\s*:\s*["']([^"']+)["']/g)) {
    const morphKey = match[1];
    morphKeys.set(morphKey, (morphKeys.get(morphKey) ?? 0) + 1);
    if (!morphKey.startsWith("!!")) {
      fail(pageFile, `morphKey "${morphKey}" must start with !! for PowerPoint Morph naming`);
    }
  }
  for (const [morphKey, count] of morphKeys.entries()) {
    if (count > 1) {
      fail(pageFile, `duplicate morphKey "${morphKey}" appears ${count} times in one slide`);
    }
  }
}

if (!exists(decksDir)) {
  errors.push("src/decks is missing");
} else {
  const deckDirs = listDirs(decksDir);
  if (deckDirs.length === 0) {
    errors.push("src/decks must contain at least one deck folder");
  }
  for (const deckId of deckDirs) {
    validateDeck(deckId);
  }
}

for (const warning of warnings) {
  console.warn(`WARN ${warning}`);
}

if (errors.length > 0) {
  console.error("Deck validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Deck validation passed.");
