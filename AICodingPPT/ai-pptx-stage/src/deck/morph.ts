import type { SlideElement, SlideSpec } from "./types";

export type MorphStep = {
  key: string;
  mode: "match" | "enter" | "exit";
  from?: SlideElement;
  to?: SlideElement;
};

export function computeMorphSteps(from: SlideSpec, to: SlideSpec): MorphStep[] {
  const fromMap = keyedElements(from);
  const toMap = keyedElements(to);
  const keys = new Set([...fromMap.keys(), ...toMap.keys()]);

  return [...keys].map((key) => {
    const fromElement = fromMap.get(key);
    const toElement = toMap.get(key);

    if (fromElement && toElement) {
      return {
        key,
        mode: "match",
        from: fromElement,
        to: toElement
      };
    }

    if (toElement) {
      return {
        key,
        mode: "enter",
        to: toElement
      };
    }

    return {
      key,
      mode: "exit",
      from: fromElement
    };
  });
}

function keyedElements(slide: SlideSpec) {
  const map = new Map<string, SlideElement>();
  for (const element of slide.elements) {
    if (element.visible === false) {
      continue;
    }
    map.set(element.morphKey ?? element.id, element);
  }
  return map;
}

