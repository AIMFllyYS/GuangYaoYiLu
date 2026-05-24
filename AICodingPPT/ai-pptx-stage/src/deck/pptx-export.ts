import pptxgen from "pptxgenjs";
import {
  DECK_HEIGHT,
  DECK_WIDTH,
  PPTX_WIDE_HEIGHT_IN,
  PPTX_WIDE_WIDTH_IN,
  type AssetElement,
  type DeckSpec,
  type ElementStyle,
  type GroupElement,
  type ShapeElement,
  type SlideElement,
  type SlideSpec,
  type TextElement
} from "./types";

export type PptxAssetSource = {
  path?: string;
  data?: string;
};

export type PptxExportOptions = {
  deckId?: string;
  out?: string;
  mode?: "editable";
  includeNotes?: boolean;
  strict?: boolean;
  outputType?: "arraybuffer" | "blob" | "nodebuffer" | "uint8array";
  resolveAsset?: (asset: string, element: AssetElement, slide: SlideSpec) => Promise<PptxAssetSource>;
};

export type ElementExportWarning = {
  slideId: string;
  elementId: string;
  reason: string;
  fallback: string;
};

export type PptxExportReport = {
  deckId: string;
  slideCount: number;
  warnings: string[];
  unsupportedEffects: ElementExportWarning[];
  outputPath: string;
};

export type PptxExportResult<TData = string | ArrayBuffer | Blob | Uint8Array> = {
  data: TData;
  report: PptxExportReport;
};

type MutableElement = SlideElement & {
  x: number;
  y: number;
  z: number;
};

type PptxInstance = InstanceType<typeof pptxgen>;
type PptxConstructor = new () => PptxInstance;
type PptxSlide = ReturnType<PptxInstance["addSlide"]>;
type PptxShapeName = Parameters<PptxSlide["addShape"]>[0];

type ColorValue = {
  color: string;
  transparency: number;
  unsupported?: string;
};

const STAGE_LAYOUT = "AI_PPTX_STAGE_WIDE";

export async function exportDeckToPptx<TData = string | ArrayBuffer | Blob | Uint8Array>(
  deck: DeckSpec,
  options: PptxExportOptions = {}
): Promise<PptxExportResult<TData>> {
  const unsupportedEffects: ElementExportWarning[] = [];
  const warnings: string[] = [];
  const pptx = createPresentation();

  pptx.author = "AI PPTX Stage";
  pptx.company = deck.theme.name;
  pptx.subject = deck.id;
  pptx.title = deck.title;
  pptx.defineLayout({ name: STAGE_LAYOUT, width: PPTX_WIDE_WIDTH_IN, height: PPTX_WIDE_HEIGHT_IN });
  pptx.layout = STAGE_LAYOUT;

  for (const slideSpec of deck.slides) {
    const slide = pptx.addSlide();
    const background = parseColor(slideSpec.background, "#FFFFFF");
    slide.background = { color: background.color, transparency: background.transparency };

    if (background.unsupported) {
      warnUnsupported(unsupportedEffects, slideSpec.id, slideSpec.id, background.unsupported, "使用纯色背景近似。");
    }

    if (options.includeNotes) {
      slide.addNotes([
        `${deck.title}`,
        `${slideSpec.id} / ${slideSpec.title}`,
        `source: ${slideSpec.sourcePath ?? "-"}`
      ].join("\n"));
    }

    const elements = [...slideSpec.elements].filter((element) => element.visible !== false).sort((a, b) => a.z - b.z);
    for (const element of elements) {
      await addElementToSlide(slide, slideSpec, element, options, unsupportedEffects, warnings);
    }
  }

  if (options.strict && unsupportedEffects.length > 0) {
    throw new Error(`PPTX export found ${unsupportedEffects.length} unsupported effect(s).`);
  }

  const outputType = options.outputType ?? "blob";
  const data = await pptx.write({ outputType, compression: true });

  return {
    data: data as TData,
    report: {
      deckId: options.deckId ?? deck.id,
      slideCount: deck.slides.length,
      warnings,
      unsupportedEffects,
      outputPath: options.out ?? ""
    }
  };
}

async function addElementToSlide(
  slide: PptxSlide,
  slideSpec: SlideSpec,
  element: SlideElement,
  options: PptxExportOptions,
  unsupportedEffects: ElementExportWarning[],
  warnings: string[]
) {
  if (element.type === "text") {
    addText(slide, slideSpec, element, unsupportedEffects);
    return;
  }

  if (element.type === "image" || element.type === "icon") {
    if (element.type === "icon") {
      addIconAsText(slide, slideSpec, element, unsupportedEffects);
      return;
    }
    await addImage(slide, slideSpec, element, options, unsupportedEffects, warnings);
    return;
  }

  if (element.type === "group") {
    await addGroup(slide, slideSpec, element, options, unsupportedEffects, warnings);
    return;
  }

  if (element.type === "rect" || element.type === "ellipse" || element.type === "line") {
    addShape(slide, slideSpec, element, unsupportedEffects);
  }
}

function addText(slide: PptxSlide, slideSpec: SlideSpec, element: TextElement, unsupportedEffects: ElementExportWarning[]) {
  const textColor = parseColor(element.style.color, "#111111");
  const fill = parseColor(element.style.fill, "transparent");

  if (fill.unsupported) {
    warnUnsupported(unsupportedEffects, slideSpec.id, element.id, fill.unsupported, "文本框底色使用纯色或透明近似。");
  }
  if (textColor.unsupported) {
    warnUnsupported(unsupportedEffects, slideSpec.id, element.id, textColor.unsupported, "文字颜色使用纯色近似。");
  }
  warnStyleLimits(slideSpec, element, unsupportedEffects);

  slide.addText(element.content, {
    ...position(element),
    objectName: objectNameFor(element),
    margin: 0,
    rotate: normalizeRotate(element.rotate),
    fit: "shrink",
    breakLine: false,
    fontFace: firstFont(element.style.fontFamily),
    fontSize: pxToPt(element.style.fontSize ?? 28),
    bold: (element.style.fontWeight ?? 400) >= 700,
    color: textColor.color,
    transparency: combineTransparency(textColor.transparency, opacityTransparency(element.opacity)),
    align: textAlign(element.style.textAlign),
    valign: "top",
    lineSpacingMultiple: element.style.lineHeight,
    fill: fill.transparency < 100 ? { color: fill.color, transparency: fill.transparency } : { color: "FFFFFF", transparency: 100 }
  });
}

function addShape(slide: PptxSlide, slideSpec: SlideSpec, element: ShapeElement, unsupportedEffects: ElementExportWarning[]) {
  const fill = parseColor(element.style.fill, "transparent");
  const stroke = parseColor(element.style.stroke, "transparent");

  if (fill.unsupported) {
    warnUnsupported(unsupportedEffects, slideSpec.id, element.id, fill.unsupported, "形状填充使用纯色或透明近似。");
  }
  if (stroke.unsupported) {
    warnUnsupported(unsupportedEffects, slideSpec.id, element.id, stroke.unsupported, "描边使用纯色或透明近似。");
  }
  warnStyleLimits(slideSpec, element, unsupportedEffects);

  const shapeType =
    element.type === "ellipse"
      ? "ellipse"
      : element.type === "line"
        ? "line"
        : (element.style.borderRadius ?? 0) > 0
          ? "roundRect"
          : "rect";

  slide.addShape(shapeType as PptxShapeName, {
    ...position(element),
    objectName: objectNameFor(element),
    rotate: normalizeRotate(element.rotate),
    fill: element.type === "line" ? { color: "FFFFFF", transparency: 100 } : { color: fill.color, transparency: combineTransparency(fill.transparency, opacityTransparency(element.opacity)) },
    line: {
      color: stroke.color,
      width: element.style.strokeWidth ?? (element.type === "line" ? 1 : 0),
      transparency: combineTransparency(stroke.transparency, opacityTransparency(element.opacity))
    }
  });
}

function createPresentation() {
  const moduleShape = pptxgen as unknown as PptxConstructor | { default?: PptxConstructor };
  const ctor = typeof moduleShape === "function" ? moduleShape : moduleShape.default;
  if (!ctor) {
    throw new Error("Unable to initialize pptxgenjs.");
  }
  return new ctor();
}

async function addImage(
  slide: PptxSlide,
  slideSpec: SlideSpec,
  element: AssetElement,
  options: PptxExportOptions,
  unsupportedEffects: ElementExportWarning[],
  warnings: string[]
) {
  const source = await resolveAssetSource(element, slideSpec, options, warnings);

  if (!source.path && !source.data) {
    warnUnsupported(unsupportedEffects, slideSpec.id, element.id, "图片素材无法解析。", "跳过该图片对象。");
    return;
  }

  if (element.style.objectFit && element.style.objectFit !== "fill") {
    warnUnsupported(unsupportedEffects, slideSpec.id, element.id, `objectFit:${element.style.objectFit}`, "PPTX 使用同尺寸图片框近似，必要时手工裁剪。");
  }
  warnStyleLimits(slideSpec, element, unsupportedEffects);

  slide.addImage({
    ...normalizeImageSource(source),
    ...position(element),
    objectName: objectNameFor(element),
    altText: element.alt ?? element.name,
    rotate: normalizeRotate(element.rotate),
    transparency: opacityTransparency(element.opacity)
  });
}

function addIconAsText(slide: PptxSlide, slideSpec: SlideSpec, element: AssetElement, unsupportedEffects: ElementExportWarning[]) {
  warnUnsupported(unsupportedEffects, slideSpec.id, element.id, "icon() 当前以文本对象导出。", "使用同位置文本框保留可编辑标识。");
  const color = parseColor(element.style.color, "#111111");
  slide.addText(element.asset, {
    ...position(element),
    objectName: objectNameFor(element),
    margin: 0,
    fontFace: firstFont(element.style.fontFamily),
    fontSize: pxToPt(element.style.fontSize ?? 24),
    bold: (element.style.fontWeight ?? 400) >= 700,
    color: color.color,
    transparency: combineTransparency(color.transparency, opacityTransparency(element.opacity)),
    align: "center",
    valign: "middle"
  });
}

async function addGroup(
  slide: PptxSlide,
  slideSpec: SlideSpec,
  element: GroupElement,
  options: PptxExportOptions,
  unsupportedEffects: ElementExportWarning[],
  warnings: string[]
) {
  warnUnsupported(unsupportedEffects, slideSpec.id, element.id, "group() 当前导出为扁平子元素。", "保留子元素位置与可编辑性，PowerPoint 中可手工组合。");
  for (const child of element.children) {
    const flattened = {
      ...child,
      x: child.x + element.x,
      y: child.y + element.y,
      z: child.z + element.z
    } as MutableElement;
    await addElementToSlide(slide, slideSpec, flattened, options, unsupportedEffects, warnings);
  }
}

async function resolveAssetSource(
  element: AssetElement,
  slideSpec: SlideSpec,
  options: PptxExportOptions,
  warnings: string[]
): Promise<PptxAssetSource> {
  if (options.resolveAsset) {
    return options.resolveAsset(element.asset, element, slideSpec);
  }

  if (element.asset.startsWith("data:")) {
    return { data: element.asset };
  }

  if (/^https?:\/\//.test(element.asset)) {
    return { path: element.asset };
  }

  warnings.push(`${slideSpec.id}/${element.id}: no asset resolver was provided; using raw asset path.`);
  return { path: element.asset };
}

function normalizeImageSource(source: PptxAssetSource): PptxAssetSource {
  if (!source.data) {
    return source;
  }
  return { ...source, data: normalizeDataUri(source.data) };
}

function normalizeDataUri(data: string) {
  const match = data.match(/^data:([^,;]+)([^,]*),(.*)$/i);
  if (!match) {
    return data;
  }

  const [, mime, meta = "", payload = ""] = match;
  if (meta.toLowerCase().includes(";base64")) {
    return data;
  }

  const decoded = decodeURIComponent(payload);
  return `data:${mime};base64,${encodeBase64(decoded)}`;
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(index, index + chunkSize));
  }
  return btoa(binary);
}

function position(element: SlideElement) {
  return {
    x: pxToIn(element.x),
    y: pxToInY(element.y),
    w: Math.max(0.001, pxToIn(element.w)),
    h: Math.max(0.001, pxToInY(element.h))
  };
}

function pxToIn(value: number) {
  return round(value / DECK_WIDTH * PPTX_WIDE_WIDTH_IN);
}

function pxToInY(value: number) {
  return round(value / DECK_HEIGHT * PPTX_WIDE_HEIGHT_IN);
}

function pxToPt(value: number) {
  return round(value / 2);
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

function firstFont(fontFamily?: string) {
  return (fontFamily ?? "Microsoft YaHei UI").split(",")[0]?.replaceAll("\"", "").trim() || "Microsoft YaHei UI";
}

function textAlign(value: ElementStyle["textAlign"]) {
  if (value === "center" || value === "right") {
    return value;
  }
  return "left";
}

function objectNameFor(element: SlideElement) {
  return element.pptx.objectName || element.morphKey || `!!${element.id}`;
}

function normalizeRotate(value: number) {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function opacityTransparency(opacity: number) {
  return clampTransparency(100 - opacity * 100);
}

function combineTransparency(...values: number[]) {
  return clampTransparency(Math.max(...values));
}

function clampTransparency(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function parseColor(value: string | undefined, fallback: string): ColorValue {
  const source = (value ?? fallback).trim();
  if (!source || source === "transparent") {
    return { color: "FFFFFF", transparency: 100 };
  }

  const hex = source.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex?.[1]) {
    return { color: expandHex(hex[1]), transparency: 0 };
  }

  const rgb = source.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb?.[1]) {
    const parts = rgb[1].split(",").map((part) => part.trim());
    const red = Number(parts[0]);
    const green = Number(parts[1]);
    const blue = Number(parts[2]);
    const alpha = parts[3] === undefined ? 1 : Number(parts[3]);
    if ([red, green, blue, alpha].every((part) => Number.isFinite(part))) {
      return {
        color: [red, green, blue].map((part) => Math.max(0, Math.min(255, Math.round(part))).toString(16).padStart(2, "0")).join("").toUpperCase(),
        transparency: clampTransparency(100 - alpha * 100)
      };
    }
  }

  if (source.includes("gradient(")) {
    return { color: parseColor(fallback, "#FFFFFF").color, transparency: parseColor(fallback, "#FFFFFF").transparency, unsupported: source };
  }

  return { color: parseColor(fallback, "#FFFFFF").color, transparency: parseColor(fallback, "#FFFFFF").transparency, unsupported: source };
}

function expandHex(value: string) {
  if (value.length === 3) {
    return value.split("").map((part) => `${part}${part}`).join("").toUpperCase();
  }
  return value.toUpperCase();
}

function warnStyleLimits(slide: SlideSpec, element: SlideElement, unsupportedEffects: ElementExportWarning[]) {
  if (element.style.shadow) {
    warnUnsupported(unsupportedEffects, slide.id, element.id, `shadow:${element.style.shadow}`, "PPTX 导出保留对象，不自动复刻复杂阴影。");
  }
}

function warnUnsupported(
  unsupportedEffects: ElementExportWarning[],
  slideId: string,
  elementId: string,
  reason: string,
  fallback: string
) {
  unsupportedEffects.push({ slideId, elementId, reason, fallback });
}
