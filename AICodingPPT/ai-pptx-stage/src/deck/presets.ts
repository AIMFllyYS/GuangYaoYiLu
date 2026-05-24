import { icon, image, rect, text } from "./builders";
import type { ElementStyle, SlideElement } from "./types";

type PresetStyle = {
  fill?: string;
  color?: string;
  accent?: string;
  muted?: string;
  fontSans?: string;
};

export function morphKey(value: string, prefix?: string) {
  const key = [prefix, value]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `!!${key || "object"}`;
}

export function sectionTitle(input: {
  id: string;
  title: string;
  kicker?: string;
  x?: number;
  y?: number;
  w?: number;
  z?: number;
  style?: PresetStyle;
}): SlideElement[] {
  const x = input.x ?? 120;
  const y = input.y ?? 110;
  const w = input.w ?? 980;
  const style = input.style ?? {};
  const elements: SlideElement[] = [];

  if (input.kicker) {
    elements.push(text({
      id: `${input.id}-kicker`,
      morphKey: morphKey(`${input.id}-kicker`),
      content: input.kicker,
      x,
      y,
      w,
      h: 34,
      z: input.z ?? 20,
      style: {
        color: style.accent ?? "#0F7A68",
        fontFamily: style.fontSans,
        fontSize: 22,
        fontWeight: 900,
        lineHeight: 1.1
      }
    }));
  }

  elements.push(text({
    id: `${input.id}-title`,
    morphKey: morphKey(`${input.id}-title`),
    content: input.title,
    x,
    y: input.kicker ? y + 46 : y,
    w,
    h: 96,
    z: (input.z ?? 20) + 1,
    style: {
      color: style.color ?? "#16231E",
      fontFamily: style.fontSans,
      fontSize: 54,
      fontWeight: 900,
      lineHeight: 1.12
    }
  }));

  return elements;
}

export function infoCard(input: {
  id: string;
  title: string;
  body: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z?: number;
  style?: PresetStyle;
}): SlideElement[] {
  const style = input.style ?? {};
  return [
    rect({
      id: `${input.id}-card`,
      morphKey: morphKey(`${input.id}-card`),
      x: input.x,
      y: input.y,
      w: input.w,
      h: input.h,
      z: input.z ?? 10,
      style: {
        fill: style.fill ?? "rgba(255,255,255,0.74)",
        stroke: style.accent ?? "rgba(15,122,104,0.22)",
        strokeWidth: 2,
        borderRadius: 16
      }
    }),
    text({
      id: `${input.id}-title`,
      morphKey: morphKey(`${input.id}-title`),
      content: input.title,
      x: input.x + 34,
      y: input.y + 30,
      w: input.w - 68,
      h: 44,
      z: (input.z ?? 10) + 1,
      style: {
        color: style.color ?? "#16231E",
        fontSize: 28,
        fontWeight: 900,
        lineHeight: 1.18
      }
    }),
    text({
      id: `${input.id}-body`,
      morphKey: morphKey(`${input.id}-body`),
      content: input.body,
      x: input.x + 34,
      y: input.y + 88,
      w: input.w - 68,
      h: input.h - 118,
      z: (input.z ?? 10) + 1,
      style: {
        color: style.muted ?? "rgba(22,35,30,0.72)",
        fontSize: 22,
        fontWeight: 600,
        lineHeight: 1.42
      }
    })
  ];
}

export function photoStrip(input: {
  id: string;
  assets: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  gap?: number;
  z?: number;
  style?: Partial<ElementStyle>;
}): SlideElement[] {
  const gap = input.gap ?? 18;
  const count = Math.max(1, input.assets.length);
  const itemWidth = (input.w - gap * (count - 1)) / count;

  return input.assets.map((asset, index) => image({
    id: `${input.id}-${String(index + 1).padStart(2, "0")}`,
    morphKey: morphKey(`${input.id}-${String(index + 1).padStart(2, "0")}`),
    asset,
    alt: `${input.id} ${index + 1}`,
    x: input.x + index * (itemWidth + gap),
    y: input.y,
    w: itemWidth,
    h: input.h,
    z: input.z ?? 15,
    style: {
      objectFit: "cover",
      borderRadius: 18,
      ...input.style
    }
  }));
}

export function pageNumber(input: {
  id?: string;
  index: number;
  total: number;
  x?: number;
  y?: number;
  z?: number;
  color?: string;
}): SlideElement[] {
  return [text({
    id: input.id ?? "page-number",
    morphKey: morphKey(input.id ?? "page-number"),
    content: `${String(input.index).padStart(2, "0")} / ${String(input.total).padStart(2, "0")}`,
    x: input.x ?? 1660,
    y: input.y ?? 1000,
    w: 150,
    h: 32,
    z: input.z ?? 900,
    style: {
      color: input.color ?? "rgba(22,35,30,0.56)",
      fontSize: 18,
      fontWeight: 800,
      textAlign: "right"
    }
  })];
}

export function logoLockup(input: {
  id: string;
  logo?: string;
  label: string;
  x?: number;
  y?: number;
  z?: number;
  color?: string;
}): SlideElement[] {
  const x = input.x ?? 120;
  const y = input.y ?? 56;
  const z = input.z ?? 50;
  const elements: SlideElement[] = [];

  if (input.logo) {
    elements.push(image({
      id: `${input.id}-logo`,
      morphKey: morphKey(`${input.id}-logo`),
      asset: input.logo,
      alt: input.label,
      x,
      y,
      w: 52,
      h: 52,
      z,
      style: { objectFit: "contain" }
    }));
  }

  elements.push(icon({
    id: `${input.id}-label`,
    morphKey: morphKey(`${input.id}-label`),
    asset: input.label,
    x: input.logo ? x + 68 : x,
    y: y + 6,
    w: 280,
    h: 40,
    z: z + 1,
    style: {
      color: input.color ?? "#0F7A68",
      fontSize: 20,
      fontWeight: 900
    }
  }));

  return elements;
}

export function watermark(input: {
  id: string;
  label: string;
  x?: number;
  y?: number;
  z?: number;
  color?: string;
}): SlideElement[] {
  return [text({
    id: input.id,
    morphKey: morphKey(input.id),
    content: input.label,
    x: input.x ?? 1160,
    y: input.y ?? 845,
    w: 700,
    h: 92,
    rotate: -8,
    opacity: 0.16,
    z: input.z ?? 3,
    style: {
      color: input.color ?? "#0F7A68",
      fontSize: 64,
      fontWeight: 900,
      textAlign: "right"
    }
  })];
}
