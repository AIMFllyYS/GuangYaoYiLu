import { chromium } from "playwright";
import os from "node:os";
import path from "node:path";

const url = process.env.AI_PPTX_STAGE_URL ?? "http://127.0.0.1:5173";
const screenshotPath = path.join(os.tmpdir(), "ai-pptx-stage-smoke.png");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });

try {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".slide-frame");

  const frameBox = await page.locator(".slide-frame").boundingBox();
  assert(frameBox, "slide frame missing");
  const ratio = Math.round((frameBox.width / frameBox.height) * 1000) / 1000;
  assert(Math.abs(ratio - 1.778) <= 0.02, `slide frame ratio invalid: ${ratio}`);

  const outside = await page.locator('[data-element-id="outside-cyan-glow"]').boundingBox();
  assert(outside && outside.width > 0, "off-canvas Morph element missing");

  await page.locator(".top-toolbar button").nth(6).click();
  const zoomedInFrame = await page.locator(".slide-frame").boundingBox();
  assert(zoomedInFrame && zoomedInFrame.width > frameBox.width, "zoom in did not enlarge slide frame");

  await page.locator(".top-toolbar button").nth(5).click();
  const zoomedOutFrame = await page.locator(".slide-frame").boundingBox();
  assert(zoomedOutFrame && Math.abs(zoomedOutFrame.width - frameBox.width) < 2, "zoom out did not return to previous scale");

  await page.locator(".top-toolbar button").nth(4).click();
  const fitFrame = await page.locator(".slide-frame").boundingBox();
  assert(fitFrame && Math.abs(fitFrame.width - frameBox.width) < 2, "fit zoom did not restore default scale");

  const target = page.locator('[data-element-id="human-line-01"]').first();
  const before = await target.boundingBox();
  assert(before, "draggable element missing");

  await target.click();
  await page.mouse.move(before.x + 20, before.y + 20);
  await page.mouse.down();
  await page.mouse.move(before.x + 56, before.y + 42, { steps: 6 });
  await page.mouse.up();

  const inspectorText = await page.locator(".inspector-panel").innerText();
  assert(inspectorText.includes("morphKey"), "inspector missing TS data");
  assert(inspectorText.includes("PPTX Manual Sync"), "inspector missing PPTX sync data");

  await page.locator(".top-toolbar button").nth(3).click();
  await page.waitForFunction(() => document.fullscreenElement?.classList.contains("stage-shell"));
  const fullscreenFrame = await page.locator(".slide-frame").boundingBox();
  assert(fullscreenFrame && fullscreenFrame.width > frameBox.width, "fullscreen preview did not enlarge slide frame");

  await page.keyboard.press("ArrowRight");
  await page.waitForSelector(".morph-overlay", { state: "attached", timeout: 1000 });

  const showModeCount = await page.locator(".editor-grid.is-show-mode").count();
  assert(showModeCount === 1, "show mode crop class missing");

  await page.waitForTimeout(1200);
  const toolbarText = await page.locator(".top-toolbar").innerText();
  assert(toolbarText.includes("2 / 3"), `keyboard Morph navigation did not reach slide 2: ${toolbarText}`);

  const bodyText = await page.locator("body").innerText();
  const suspicious = [0xfffd, 0x00c3, 0x00c2, 0x951f].map((code) => String.fromCharCode(code));
  assert(!suspicious.some((marker) => bodyText.includes(marker)), "visible mojibake marker detected");

  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Browser smoke passed. Screenshot: ${screenshotPath}`);
} finally {
  await browser.close();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
