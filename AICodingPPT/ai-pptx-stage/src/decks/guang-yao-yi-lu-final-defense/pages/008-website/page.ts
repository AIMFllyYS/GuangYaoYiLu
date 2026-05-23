import { defineSlide, ellipse, image, line, rect, text } from "../../../../deck/authoring";

const A = "/src/decks/guang-yao-yi-lu-final-defense/assets/";

const features = [
  ["十四字主题", "固定活动精神锚点"],
  ["Q 版瑶光助手", "形成亲和入口"],
  ["中药功能查询", "搜索药材与功效"],
  ["趣味知识介绍", "把知识拆成轻内容"],
  ["问答互动小游戏", "延续线下参与感"],
  ["最新研究成果", "连接专业前沿"]
];

export const slide = defineSlide({
  id: "008-website",
  title: "科普网站",
  background: "#06100c",
  transition: {
    type: "morph",
    durationMs: 940,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "website-bg",
      morphKey: "!!cover-veil",
      name: "网站页深底",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 0,
      style: { fill: "linear-gradient(118deg, #06100c, #093327 52%, #050807)" }
    }),
    ellipse({
      id: "herbal-ring",
      morphKey: "!!herbal-ring",
      name: "网站页光环",
      x: 1240,
      y: -210,
      w: 920,
      h: 920,
      opacity: 0.42,
      z: 1,
      style: {
        fill: "radial-gradient(circle, transparent 42%, rgba(70,201,255,.18) 43%, rgba(84,185,106,.10) 54%, transparent 64%)",
        stroke: "rgba(70,201,255,.28)",
        strokeWidth: 5
      }
    }),
    image({
      id: "brand-logo-primary",
      morphKey: "!!brand-logo-primary",
      name: "主 Logo",
      asset: `${A}logo-dark.jpg`,
      alt: "光药医路 Logo",
      x: 70,
      y: 58,
      w: 86,
      h: 86,
      z: 20,
      style: { objectFit: "contain", borderRadius: 16 }
    }),
    image({
      id: "brand-logo-secondary",
      morphKey: "!!brand-logo-secondary",
      name: "副 Logo",
      asset: `${A}logo-secondary.png`,
      alt: "联合团支部 Logo",
      x: 176,
      y: 60,
      w: 92,
      h: 78,
      z: 20,
      style: { objectFit: "contain" }
    }),
    text({
      id: "section-index",
      morphKey: "!!section-index",
      name: "页码章节",
      content: "08 / 科普网站",
      x: 1450,
      y: 72,
      w: 320,
      h: 38,
      z: 22,
      style: { fontSize: 24, color: "#46c9ff", textAlign: "right", fontWeight: 800 }
    }),
    text({
      id: "deck-title",
      morphKey: "!!deck-title",
      name: "网站页标题",
      content: "把一次团日活动沉淀成长期科普阵地",
      x: 126,
      y: 166,
      w: 1160,
      h: 74,
      z: 22,
      style: { fontSize: 49, fontWeight: 850, color: "#f7fbff" }
    }),
    text({
      id: "website-subtitle",
      morphKey: "!!website-subtitle",
      name: "网站页副标题",
      content: "网站正在建设中：它将承接主题、支部、Logo、瑶光助手与中药知识互动功能。",
      x: 130,
      y: 250,
      w: 1260,
      h: 42,
      z: 22,
      style: { fontSize: 27, color: "rgba(223,246,229,.78)", fontWeight: 500 }
    }),
    rect({
      id: "browser-frame",
      morphKey: "!!browser-frame",
      name: "网站浏览器框",
      x: 116,
      y: 340,
      w: 910,
      h: 560,
      z: 6,
      style: {
        fill: "rgba(247,251,255,.08)",
        stroke: "rgba(70,201,255,.40)",
        strokeWidth: 2,
        borderRadius: 30,
        shadow: "0 24px 60px rgba(0,0,0,.30)"
      }
    }),
    rect({
      id: "browser-topbar",
      morphKey: "!!browser-topbar",
      name: "网站浏览器顶栏",
      x: 116,
      y: 340,
      w: 910,
      h: 62,
      z: 8,
      style: { fill: "rgba(247,251,255,.12)", borderRadius: 30 }
    }),
    text({
      id: "browser-url",
      morphKey: "!!browser-url",
      name: "网站地址栏",
      content: "guangyaoyilu.site / 正在建设",
      x: 210,
      y: 358,
      w: 430,
      h: 30,
      z: 20,
      style: { fontSize: 21, color: "rgba(247,251,255,.72)", fontWeight: 600 }
    }),
    text({
      id: "site-hero-title",
      morphKey: "!!site-hero-title",
      name: "网站首屏标题",
      content: "光药医路",
      x: 170,
      y: 470,
      w: 360,
      h: 70,
      z: 20,
      style: { fontSize: 52, color: "#d8b45a", fontWeight: 850 }
    }),
    text({
      id: "site-hero-copy",
      morphKey: "!!site-hero-copy",
      name: "网站首屏文案",
      content: "十四字主题 · 三支部联合 · 中药知识查询 · 趣味问答互动",
      x: 172,
      y: 548,
      w: 560,
      h: 72,
      z: 20,
      style: { fontSize: 28, color: "#f7fbff", lineHeight: 1.35, fontWeight: 650 }
    }),
    image({
      id: "yaoguang-helper",
      morphKey: "!!yaoguang-helper",
      name: "瑶光助手",
      asset: `${A}yaoguang-1.jpg`,
      alt: "瑶光助手形象",
      x: 760,
      y: 466,
      w: 170,
      h: 170,
      z: 20,
      style: { objectFit: "cover", borderRadius: 85, shadow: "0 0 46px rgba(84,185,106,.44)" }
    }),
    line({
      id: "browser-divider",
      morphKey: "!!browser-divider",
      name: "网站分隔线",
      x: 170,
      y: 680,
      w: 790,
      h: 0,
      z: 20,
      style: { stroke: "rgba(216,180,90,.46)", strokeWidth: 2 }
    }),
    text({
      id: "site-footer",
      morphKey: "!!site-footer",
      name: "网站页脚",
      content: "联系我们 · 团支部共建 · 中药科普资料库",
      x: 170,
      y: 784,
      w: 620,
      h: 38,
      z: 20,
      style: { fontSize: 24, color: "rgba(223,246,229,.72)", fontWeight: 600 }
    }),
    ...features.map(([title], i) =>
      rect({
        id: `feature-card-${i + 1}`,
        morphKey: `!!feature-card-${i + 1}`,
        name: `网站功能 ${title}`,
        x: 1110 + (i % 2) * 350,
        y: 340 + Math.floor(i / 2) * 176,
        w: 315,
        h: 136,
        z: 7,
        style: {
          fill: "rgba(247,251,255,.08)",
          stroke: "rgba(70,201,255,.30)",
          strokeWidth: 2,
          borderRadius: 26
        }
      })
    ),
    ...features.map(([title, copy], i) =>
      text({
        id: `feature-text-${i + 1}`,
        morphKey: `!!feature-text-${i + 1}`,
        name: `网站功能文本 ${title}`,
        content: `${title}\n${copy}`,
        x: 1138 + (i % 2) * 350,
        y: 370 + Math.floor(i / 2) * 176,
        w: 260,
        h: 82,
        z: 20,
        style: { fontSize: 24, color: "#f7fbff", lineHeight: 1.35, fontWeight: 720 }
      })
    )
  ]
});

export default slide;
