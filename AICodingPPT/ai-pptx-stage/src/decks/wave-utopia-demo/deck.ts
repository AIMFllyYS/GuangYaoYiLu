import { defineDeck, wide16x9 } from "../../deck/authoring";
import { getSlidesForDeck } from "../pages";
import { theme } from "./theme";

export const deck = defineDeck({
  id: "wave-utopia-demo",
  title: "Wave Utopia AI Coding 决赛演示",
  sourcePath: "src/decks/wave-utopia-demo/deck.ts",
  size: wide16x9,
  theme,
  slides: getSlidesForDeck("wave-utopia-demo")
});

export default deck;
