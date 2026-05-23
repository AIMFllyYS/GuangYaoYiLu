# Deck Folder Template

新建一套 TS 版 PPT 时，使用以下结构：

```text
src/decks/<deck-id>/
  deck.ts
  theme.ts
  README.md
  assets/
  pages/
    001-opening/
      page.ts
      notes.md
      assets/
```

`deck.ts` 示例：

```ts
import { defineDeck, wide16x9 } from "../../deck/authoring";
import { theme } from "./theme";
import openingSlide from "./pages/001-opening/page";

export const deck = defineDeck({
  id: "<deck-id>",
  title: "<PPT 标题>",
  size: wide16x9,
  theme,
  slides: [openingSlide]
});

export default deck;
```

`theme.ts` 示例：

```ts
import type { DeckSpec } from "../../deck/authoring";

export const theme: DeckSpec["theme"] = {
  name: "<theme-name>",
  fontSans: "Microsoft YaHei UI",
  fontSerif: "Noto Serif SC",
  colors: {
    cyan: "#46c9ff",
    rose: "#f06adf",
    black: "#050607",
    white: "#f7fbff"
  }
};
```

要求：

- `<deck-id>` 必须小写 kebab-case。
- `deck.id` 必须等于 deck 文件夹名。
- `slides` 顺序必须与 `pages/` 文件夹编号一致。
- 普通创作不要修改系统层文件。
