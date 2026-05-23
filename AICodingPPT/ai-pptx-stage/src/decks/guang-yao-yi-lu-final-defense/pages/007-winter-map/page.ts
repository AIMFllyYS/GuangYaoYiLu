import { defineSlide, ellipse, image, line, rect, text } from "../../../../deck/authoring";

const A = "/src/decks/guang-yao-yi-lu-final-defense/assets/";

export const slide = defineSlide({
  id: "007-winter-map",
  title: "青暖冬日活动",
  background: "#f4efe2",
  transition: {
    type: "morph",
    durationMs: 920,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "winter-bg",
      morphKey: "!!cover-veil",
      name: "青暖冬日底色",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 0,
      style: { fill: "linear-gradient(128deg, #f4efe2, #dff6e5 54%, #f7fbff)" }
    }),
    ellipse({
      id: "herbal-ring",
      morphKey: "!!herbal-ring",
      name: "地图页光环",
      x: 1220,
      y: 560,
      w: 760,
      h: 760,
      opacity: 0.24,
      z: 1,
      style: {
        fill: "radial-gradient(circle, transparent 42%, rgba(70,201,255,.20) 43%, rgba(84,185,106,.08) 55%, transparent 65%)",
        stroke: "rgba(15,107,95,.20)",
        strokeWidth: 4
      }
    }),
    image({
      id: "brand-logo-primary",
      morphKey: "!!brand-logo-primary",
      name: "主 Logo",
      asset: `${A}logo-light.jpg`,
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
      content: "07 / 青暖冬日",
      x: 1450,
      y: 72,
      w: 320,
      h: 38,
      z: 22,
      style: { fontSize: 24, color: "#0f6b5f", textAlign: "right", fontWeight: 800 }
    }),
    text({
      id: "deck-title",
      morphKey: "!!deck-title",
      name: "地图页标题",
      content: "青暖冬日：把母校宣讲与实地考察连成路线",
      x: 126,
      y: 166,
      w: 1260,
      h: 74,
      z: 22,
      style: { fontSize: 48, fontWeight: 850, color: "#08110d" }
    }),
    text({
      id: "winter-subtitle",
      morphKey: "!!winter-subtitle",
      name: "地图页副标题",
      content: "从“回到母校讲给学弟学妹听”，到“走进现场看见真实场景”，让中药文化在路径中被理解。",
      x: 130,
      y: 250,
      w: 1260,
      h: 42,
      z: 22,
      style: { fontSize: 27, color: "rgba(8,17,13,.70)", fontWeight: 500 }
    }),
    image({
      id: "winter-map",
      morphKey: "!!winter-map",
      name: "地图展示",
      asset: `${A}winter-map.jpg`,
      alt: "路线地图示意",
      x: 112,
      y: 350,
      w: 720,
      h: 500,
      z: 7,
      style: { objectFit: "cover", borderRadius: 34, shadow: "0 24px 54px rgba(8,17,13,.18)" }
    }),
    line({
      id: "route-line",
      morphKey: "!!route-line",
      name: "路线连接线",
      x: 720,
      y: 600,
      w: 760,
      h: 0,
      rotate: -10,
      z: 10,
      style: { stroke: "rgba(216,180,90,.82)", strokeWidth: 6 }
    }),
    ellipse({
      id: "route-dot-a",
      morphKey: "!!route-dot-a",
      name: "路线点 母校宣讲",
      x: 822,
      y: 540,
      w: 34,
      h: 34,
      z: 11,
      style: { fill: "#d8b45a", stroke: "#f7fbff", strokeWidth: 4 }
    }),
    ellipse({
      id: "route-dot-b",
      morphKey: "!!route-dot-b",
      name: "路线点 实地考察",
      x: 1435,
      y: 430,
      w: 34,
      h: 34,
      z: 11,
      style: { fill: "#0f6b5f", stroke: "#f7fbff", strokeWidth: 4 }
    }),
    image({
      id: "winter-talk-a",
      morphKey: "!!winter-talk-a",
      name: "母校宣讲图 A",
      asset: `${A}winter-talk-a.png`,
      alt: "母校宣讲",
      x: 910,
      y: 355,
      w: 360,
      h: 250,
      z: 8,
      style: { objectFit: "cover", borderRadius: 28, shadow: "0 22px 46px rgba(8,17,13,.16)" }
    }),
    image({
      id: "winter-talk-b",
      morphKey: "!!winter-talk-b",
      name: "母校宣讲图 B",
      asset: `${A}winter-talk-b.jpg`,
      alt: "母校宣讲",
      x: 910,
      y: 638,
      w: 360,
      h: 250,
      z: 8,
      style: { objectFit: "cover", borderRadius: 28, shadow: "0 22px 46px rgba(8,17,13,.16)" }
    }),
    image({
      id: "winter-museum",
      morphKey: "!!winter-museum",
      name: "实地考察图",
      asset: `${A}winter-museum.jpg`,
      alt: "实地考察",
      x: 1350,
      y: 500,
      w: 390,
      h: 276,
      z: 8,
      style: { objectFit: "cover", borderRadius: 30, shadow: "0 22px 46px rgba(8,17,13,.16)" }
    }),
    rect({
      id: "winter-caption",
      morphKey: "!!winter-caption",
      name: "青暖冬日结论",
      x: 250,
      y: 902,
      w: 1420,
      h: 76,
      z: 7,
      style: { fill: "rgba(8,17,13,.88)", stroke: "rgba(216,180,90,.45)", strokeWidth: 2, borderRadius: 38 }
    }),
    text({
      id: "winter-caption-text",
      morphKey: "!!winter-caption-text",
      name: "青暖冬日结论文本",
      content: "一条路线连接宣讲、考察与反馈：中药文化从校园出发，也重新回到青少年身边。",
      x: 310,
      y: 922,
      w: 1300,
      h: 38,
      z: 22,
      style: { fontSize: 28, color: "#f7fbff", textAlign: "center", fontWeight: 740 }
    })
  ]
});

export default slide;
