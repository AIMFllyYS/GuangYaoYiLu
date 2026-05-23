import type {
  AssetElement,
  BuilderInput,
  DeckSpec,
  ElementStyle,
  GroupElement,
  PptxSync,
  ShapeElement,
  SlideElement,
  SlideSpec,
  TextElement
} from "./types";
import { DECK_HEIGHT, DECK_WIDTH } from "./types";

const defaultStyle: ElementStyle = {
  fill: "transparent",
  color: "#f7fbff",
  fontFamily: "Microsoft YaHei UI, Microsoft YaHei, Noto Sans SC, sans-serif",
  fontSize: 28,
  fontWeight: 600,
  lineHeight: 1.35,
  textAlign: "left"
};

function pptxDefaults(input: BuilderInput, shapeType: PptxSync["shapeType"]): PptxSync {
  const objectName = input.morphKey ?? `!!${input.id}`;
  return {
    objectName,
    shapeType,
    copyHint: `PowerPoint 选择窗格命名为 ${objectName}`,
    morphRole: input.morphKey ? "matched" : "static",
    ...input.pptx
  };
}

function base(input: BuilderInput, shapeType: PptxSync["shapeType"]) {
  return {
    id: input.id,
    morphKey: input.morphKey,
    name: input.name ?? input.id,
    x: input.x,
    y: input.y,
    w: input.w,
    h: input.h,
    rotate: input.rotate ?? 0,
    opacity: input.opacity ?? 1,
    z: input.z ?? 1,
    locked: input.locked ?? false,
    visible: input.visible ?? true,
    style: {
      ...defaultStyle,
      ...input.style
    },
    pptx: pptxDefaults(input, shapeType)
  };
}

export function defineDeck(deck: DeckSpec): DeckSpec {
  return deck;
}

export function defineSlide(slide: SlideSpec): SlideSpec {
  return slide;
}

export function text(input: BuilderInput & { content: string }): TextElement {
  return {
    ...base(input, "TextBox"),
    type: "text",
    content: input.content
  };
}

export function rect(input: BuilderInput): ShapeElement {
  return {
    ...base(input, "Rectangle"),
    type: "rect"
  };
}

export function ellipse(input: BuilderInput): ShapeElement {
  return {
    ...base(input, "Ellipse"),
    type: "ellipse"
  };
}

export function line(input: BuilderInput): ShapeElement {
  return {
    ...base(input, "Line"),
    type: "line"
  };
}

export function image(input: BuilderInput & { asset: string; alt?: string }): AssetElement {
  return {
    ...base(input, "Picture"),
    type: "image",
    asset: input.asset,
    alt: input.alt
  };
}

export function icon(input: BuilderInput & { asset: string; alt?: string }): AssetElement {
  return {
    ...base(input, "Icon"),
    type: "icon",
    asset: input.asset,
    alt: input.alt
  };
}

export function group(input: BuilderInput & { children: SlideElement[] }): GroupElement {
  return {
    ...base(input, "Group"),
    type: "group",
    children: input.children
  };
}

export const wide16x9 = {
  width: DECK_WIDTH,
  height: DECK_HEIGHT
} as const;

