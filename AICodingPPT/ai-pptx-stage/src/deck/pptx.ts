import {
  DECK_HEIGHT,
  DECK_WIDTH,
  PPTX_WIDE_HEIGHT_IN,
  PPTX_WIDE_WIDTH_IN,
  type SlideElement
} from "./types";

export function toPptxInches(element: SlideElement) {
  return {
    left: round(element.x / DECK_WIDTH * PPTX_WIDE_WIDTH_IN),
    top: round(element.y / DECK_HEIGHT * PPTX_WIDE_HEIGHT_IN),
    width: round(element.w / DECK_WIDTH * PPTX_WIDE_WIDTH_IN),
    height: round(element.h / DECK_HEIGHT * PPTX_WIDE_HEIGHT_IN)
  };
}

export function pptxParameterLines(element: SlideElement): string[] {
  const inches = toPptxInches(element);
  const style = element.style;
  return [
    `objectName: ${element.pptx.objectName}`,
    `shapeType: ${element.pptx.shapeType}`,
    `left: ${inches.left}in`,
    `top: ${inches.top}in`,
    `width: ${inches.width}in`,
    `height: ${inches.height}in`,
    `rotate: ${element.rotate}deg`,
    `opacity: ${element.opacity}`,
    `font: ${style.fontFamily ?? "-"} / ${style.fontSize ?? "-"} / ${style.fontWeight ?? "-"}`
  ];
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

