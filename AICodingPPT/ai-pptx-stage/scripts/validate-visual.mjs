import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const argv = process.argv.slice(2);
const deckId = readValue(argv, "--deck") ?? "wave-utopia-demo";
const pages = parsePages(readValue(argv, "--pages"));
const url = process.env.AI_PPTX_STAGE_URL ?? "http://127.0.0.1:5173";
const outDir = path.resolve("dist/visual", deckId);
const mojibake = /\uFFFD|\u00C3|\u00C2|\u951F/;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
const report = {
  deckId,
  url,
  pages,
  screenshots: [],
  findings: []
};

try {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".slide-frame");
  await page.locator('select[aria-label="选择 PPT deck"]').selectOption(deckId);
  await page.locator("#stage-preview").focus();
  await page.waitForTimeout(500);

  let currentPage = 1;
  const targetPages = pages.length > 0 ? pages : [1];
  for (const targetPage of targetPages) {
    while (currentPage < targetPage) {
      await page.keyboard.press("ArrowRight");
      currentPage += 1;
      await page.waitForTimeout(950);
    }
    while (currentPage > targetPage) {
      await page.keyboard.press("ArrowLeft");
      currentPage -= 1;
      await page.waitForTimeout(950);
    }

    const bodyText = await page.locator("body").innerText();
    if (mojibake.test(bodyText)) {
      report.findings.push({ level: "error", page: targetPage, message: "Visible mojibake marker detected." });
    }

    const screenshotPath = path.join(outDir, `page-${String(targetPage).padStart(2, "0")}.png`);
    await page.locator(".slide-frame").screenshot({ path: screenshotPath });
    const info = await stat(screenshotPath);
    if (info.size === 0) {
      report.findings.push({ level: "error", page: targetPage, message: "Screenshot file is empty." });
    }
    report.screenshots.push({ page: targetPage, path: screenshotPath, bytes: info.size });
  }
} finally {
  await browser.close();
}

const reportPath = path.join(outDir, "report.json");
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const errors = report.findings.filter((finding) => finding.level === "error");
if (errors.length > 0) {
  console.error(`Visual validation failed with ${errors.length} error(s). Report: ${reportPath}`);
  process.exit(1);
}

console.log(`Visual validation passed for ${deckId}. Screenshots: ${report.screenshots.length}. Report: ${reportPath}`);

function readValue(values, name) {
  const index = values.indexOf(name);
  return index === -1 ? undefined : values[index + 1];
}

function parsePages(value) {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((pageNumber) => Number.isInteger(pageNumber) && pageNumber > 0)
    .sort((a, b) => a - b);
}
