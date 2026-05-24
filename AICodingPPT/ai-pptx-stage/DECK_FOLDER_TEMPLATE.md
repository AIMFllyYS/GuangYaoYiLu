# Deck Folder Template

新建一套 TS 版 PPT 优先使用脚手架：

```bash
npm run deck:new -- --id <deck-id> --title "<PPT 标题>" --slides <n>
npm run ai:brief -- --deck <deck-id>
```

生成结构：

```text
src/decks/<deck-id>/
  deck.ts
  theme.ts
  README.md
  assets/
    README.md
  pages/
    001-page-01/
      page.ts
      notes.md
```

`deck.ts` 必须使用自动页面发现：

```ts
import { defineDeck, wide16x9 } from "../../deck/authoring";
import { getSlidesForDeck } from "../pages";
import { theme } from "./theme";

export const deck = defineDeck({
  id: "<deck-id>",
  title: "<PPT 标题>",
  sourcePath: "src/decks/<deck-id>/deck.ts",
  size: wide16x9,
  theme,
  slides: getSlidesForDeck("<deck-id>")
});

export default deck;
```

要求：

- `<deck-id>` 必须小写 kebab-case。
- `deck.id` 必须等于 deck 文件夹名。
- `pages/*` 使用 `001-name` 顺序。
- 普通创作不要修改系统层文件。
- 导出用 `npm run export:pptx -- --deck <deck-id>`。
- 完成后至少运行 `validate:decks`、`validate:assets`、`validate:layout`、`validate:export`。
