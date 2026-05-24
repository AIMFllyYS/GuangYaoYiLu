# Verification

本项目的完整验证总闸：

```bash
npm run verify
```

`verify` 会按顺序执行：

```bash
npm run typecheck
npm run build
npm run validate:utf8
npm run validate:decks
npm run validate:assets
npm run validate:layout
npm run validate:export -- --deck wave-utopia-demo
npm run validate:export -- --deck guang-yao-yi-lu-final-defense
npm run smoke:browser
npm run validate:visual -- --deck guang-yao-yi-lu-final-defense --pages 1,4,8,11,14,18,21,24,27,30
```

`verify` 会自己启动临时 Vite dev server 并在结束后关闭。单独运行浏览器类脚本时，需要先启动服务：

```bash
npm run dev -- --port 5173
```

再运行：

```bash
npm run smoke:browser
npm run validate:visual -- --deck <deck-id> --pages 1,4,8
```

## 覆盖范围

- TypeScript 类型、生产构建和 UTF-8 中文坏码扫描。
- Deck 目录结构、page id、禁止 import、Morph key `!!` 规则。
- 资产引用、图片可读性、空文件、大文件提醒。
- 文本框明显溢出、无效几何、非 Morph 画布外元素、关键文本重叠提醒。
- PPTX zip 结构、slide 数、图片嵌入、中文 XML、`!!objectName`、Morph transition。
- 浏览器打开、deck selector、拖拽、Inspector、放映裁切、方向键 Morph、导出按钮下载。
- 指定页面视觉抽帧与可见中文坏码扫描。

导出文件、报告、截图和 AI brief 均写入 ignored `dist/`，不得提交。
