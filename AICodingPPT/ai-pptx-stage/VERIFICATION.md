# Verification

本项目当前验证命令：

```bash
npm run typecheck
npm run build
npm run validate:utf8
npm run smoke:browser
```

`npm run smoke:browser` 需要先启动本地服务：

```bash
npm run dev -- --port 5173
```

验证覆盖：

- 页面能打开，固定幻灯片框保持 16:9。
- 页面外 Morph 元素存在。
- 元素可点击和拖动，Inspector 会展示 TS 数据与 PPTX 手工复刻参数。
- 放映裁切模式可开启。
- 方向键可触发 Morph 翻页，并到达第 2 页。
- 可见页面文本没有常见中文乱码标记。
