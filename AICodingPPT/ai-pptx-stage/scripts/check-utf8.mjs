import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("src");
const suspicious = /�|Ã|Â|锟/g;
const checkedExtensions = new Set([".ts", ".tsx", ".css", ".html", ".md", ".json"]);
const findings = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }
    if (!checkedExtensions.has(path.extname(entry.name))) {
      continue;
    }
    const text = await readFile(fullPath, "utf8");
    const matches = text.match(suspicious);
    if (matches) {
      findings.push(`${fullPath}: ${matches.join(",")}`);
    }
  }
}

await walk(root);

if (findings.length > 0) {
  console.error("Suspicious mojibake markers found:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log("UTF-8 scan passed.");
