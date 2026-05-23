import { sampleDeck } from "../deck/sampleDeck";
import type { DeckSpec } from "../deck/types";

type DeckModule = {
  default?: DeckSpec;
  deck?: DeckSpec;
};

export type DeckEntry = {
  id: string;
  title: string;
  path: string;
  deck: DeckSpec;
};

const deckModules = import.meta.glob<DeckModule>("./*/deck.ts", { eager: true });

const discoveredDecks = Object.entries(deckModules)
  .map(([path, module]) => {
    const deck = module.default ?? module.deck;
    if (!deck) {
      return undefined;
    }
    return {
      id: deck.id,
      title: deck.title,
      path: `src/decks/${path.replace("./", "")}`,
      deck
    };
  })
  .filter((entry): entry is DeckEntry => Boolean(entry))
  .sort((a, b) => a.id.localeCompare(b.id));

const fallbackDeck: DeckEntry = {
  id: sampleDeck.id,
  title: sampleDeck.title,
  path: "src/deck/sampleDeck.ts",
  deck: sampleDeck
};

export const deckEntries = discoveredDecks.length > 0 ? discoveredDecks : [fallbackDeck];

export const defaultDeckId = deckEntries[0]?.id ?? fallbackDeck.id;

export function getDeckEntry(deckId: string): DeckEntry {
  return deckEntries.find((entry) => entry.id === deckId) ?? deckEntries[0] ?? fallbackDeck;
}
