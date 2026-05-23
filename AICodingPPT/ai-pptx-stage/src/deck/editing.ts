import type { DeckSpec, SlideElement, SlideSpec } from "./types";

export type ElementPatch = Partial<
  Pick<SlideElement, "x" | "y" | "w" | "h" | "rotate" | "opacity" | "z" | "locked" | "visible" | "name" | "morphKey">
>;

export function findElement(slide: SlideSpec, id?: string): SlideElement | undefined {
  if (!id) {
    return undefined;
  }
  return slide.elements.find((element) => element.id === id);
}

export function updateElement(deck: DeckSpec, slideId: string, elementId: string, patch: ElementPatch): DeckSpec {
  return {
    ...deck,
    slides: deck.slides.map((slide) =>
      slide.id === slideId
        ? {
            ...slide,
            elements: slide.elements.map((element) =>
              element.id === elementId
                ? {
                    ...element,
                    ...patch
                  }
                : element
            )
          }
        : slide
    )
  };
}

export function nudgeElement(deck: DeckSpec, slideId: string, elementId: string, dx: number, dy: number): DeckSpec {
  const slide = deck.slides.find((candidate) => candidate.id === slideId);
  const element = slide?.elements.find((candidate) => candidate.id === elementId);

  if (!element || element.locked) {
    return deck;
  }

  return updateElement(deck, slideId, elementId, {
    x: Math.round(element.x + dx),
    y: Math.round(element.y + dy)
  });
}

export function setLayerDirection(
  deck: DeckSpec,
  slideId: string,
  elementId: string,
  direction: "up" | "down" | "top" | "bottom"
): DeckSpec {
  const slide = deck.slides.find((candidate) => candidate.id === slideId);
  if (!slide) {
    return deck;
  }

  const sorted = [...slide.elements].sort((a, b) => a.z - b.z);
  const index = sorted.findIndex((element) => element.id === elementId);

  if (index === -1) {
    return deck;
  }

  const [target] = sorted.splice(index, 1);

  if (!target) {
    return deck;
  }

  if (direction === "top") {
    sorted.push(target);
  } else if (direction === "bottom") {
    sorted.unshift(target);
  } else {
    const nextIndex = direction === "up" ? Math.min(sorted.length, index + 1) : Math.max(0, index - 1);
    sorted.splice(nextIndex, 0, target);
  }

  const patches = new Map(sorted.map((element, order) => [element.id, order + 1]));

  return {
    ...deck,
    slides: deck.slides.map((candidate) =>
      candidate.id === slideId
        ? {
            ...candidate,
            elements: candidate.elements.map((element) => ({
              ...element,
              z: patches.get(element.id) ?? element.z
            }))
          }
        : candidate
    )
  };
}

