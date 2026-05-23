import type { SlideSpec } from "../deck/authoring";

type PageModule = {
  default?: SlideSpec;
  slide?: SlideSpec;
};

const pageModules = import.meta.glob<PageModule>("./*/pages/*/page.ts", { eager: true });

const slidesByDeck = new Map<string, SlideSpec[]>();

for (const [path, module] of Object.entries(pageModules)) {
  const match = path.match(/^\.\/([^/]+)\/pages\/([^/]+)\/page\.ts$/);
  const slide = module.default ?? module.slide;
  if (!match || !slide) {
    continue;
  }

  const [, deckId, pageId] = match;
  const slides = slidesByDeck.get(deckId) ?? [];
  slides.push({
    ...slide,
    id: slide.id || pageId,
    sourcePath: slide.sourcePath ?? `src/decks/${deckId}/pages/${pageId}/page.ts`
  });
  slidesByDeck.set(deckId, slides);
}

for (const slides of slidesByDeck.values()) {
  slides.sort((a, b) => a.id.localeCompare(b.id));
}

export function getSlidesForDeck(deckId: string): SlideSpec[] {
  return slidesByDeck.get(deckId) ?? [];
}
