import { defineDeck, wide16x9 } from "../../deck/authoring";
import { getSlidesForDeck } from "../pages";
import { theme } from "./theme";

export const deck = defineDeck({
  id: "guang-yao-yi-lu-final-defense",
  title: "光药医路决赛答辩",
  sourcePath: "src/decks/guang-yao-yi-lu-final-defense/deck.ts",
  size: wide16x9,
  theme,
  slides: getSlidesForDeck("guang-yao-yi-lu-final-defense")
});

export default deck;
