import { defineSlide, ellipse, image, rect, text } from "../../../../deck/authoring";

const asset = (name: string) => new URL(`../../assets/${name}`, import.meta.url).href;

export const slide = defineSlide({
  id: "006-museum",
  title: "叶开泰博物馆",
  background: "#08110d",
  transition: {
    type: "morph",
    durationMs: 960,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "museum-bg",
      morphKey: "!!cover-veil",
      name: "博物馆深底",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 0,
      style: { fill: "linear-gradient(110deg, #050807, #122018 52%, #07110d)" }
    }),
    ellipse({
      id: "herbal-ring",
      morphKey: "!!herbal-ring",
      name: "博物馆光环",
      x: -280,
      y: 230,
      w: 980,
      h: 980,
      opacity: 0.34,
      z: 1,
      style: {
        fill: "radial-gradient(circle, transparent 42%, rgba(216,180,90,.18) 43%, rgba(84,185,106,.09) 55%, transparent 65%)",
        stroke: "rgba(216,180,90,.28)",
        strokeWidth: 5
      }
    }),
    image({
      id: "brand-logo-primary",
      morphKey: "!!brand-logo-primary",
      name: "主 Logo",
      asset: asset("logo-dark.jpg"),
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
      asset: asset("logo-secondary.png"),
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
      content: "06 / 叶开泰博物馆",
      x: 1410,
      y: 72,
      w: 360,
      h: 38,
      z: 22,
      style: { fontSize: 24, color: "#d8b45a", textAlign: "right", fontWeight: 800 }
    }),
    text({
      id: "deck-title",
      morphKey: "!!deck-title",
      name: "博物馆标题",
      content: "走进叶开泰：让传统从展柜里活起来",
      x: 126,
      y: 166,
      w: 1150,
      h: 74,
      z: 22,
      style: { fontSize: 49, fontWeight: 850, color: "#f7fbff" }
    }),
    text({
      id: "museum-subtitle",
      morphKey: "!!museum-subtitle",
      name: "博物馆副标题",
      content: "参观、记录、讲述：以博物馆研学补足课堂之外的中医药文化现场。",
      x: 130,
      y: 250,
      w: 1180,
      h: 42,
      z: 22,
      style: { fontSize: 27, color: "rgba(223,246,229,.78)", fontWeight: 500 }
    }),
    image({
      id: "museum-photo-main",
      morphKey: "!!museum-photo-main",
      name: "博物馆主图",
      asset: asset("museum-photo-a.jpg"),
      alt: "叶开泰博物馆活动",
      x: 120,
      y: 350,
      w: 520,
      h: 560,
      z: 8,
      style: { objectFit: "cover", borderRadius: 34, shadow: "0 26px 56px rgba(0,0,0,.36)" }
    }),
    image({
      id: "museum-photo-b",
      morphKey: "!!museum-photo-b",
      name: "博物馆图片流 B",
      asset: asset("museum-photo-b.jpg"),
      alt: "叶开泰博物馆活动",
      x: 690,
      y: 340,
      w: 420,
      h: 260,
      z: 8,
      style: { objectFit: "cover", borderRadius: 28, shadow: "0 22px 48px rgba(0,0,0,.30)" }
    }),
    image({
      id: "museum-photo-c",
      morphKey: "!!museum-photo-c",
      name: "博物馆图片流 C",
      asset: asset("museum-photo-c.jpg"),
      alt: "叶开泰博物馆活动",
      x: 1138,
      y: 340,
      w: 650,
      h: 360,
      z: 8,
      style: { objectFit: "cover", borderRadius: 32, shadow: "0 22px 48px rgba(0,0,0,.30)" }
    }),
    rect({
      id: "museum-story-panel",
      morphKey: "!!museum-story-panel",
      name: "博物馆叙事面板",
      x: 690,
      y: 642,
      w: 420,
      h: 268,
      z: 7,
      style: {
        fill: "rgba(244,239,226,.09)",
        stroke: "rgba(216,180,90,.46)",
        strokeWidth: 2,
        borderRadius: 30
      }
    }),
    text({
      id: "museum-story-text",
      morphKey: "!!museum-story-text",
      name: "博物馆叙事文本",
      content: "活动介绍\n\n1. 在老字号脉络中理解中药文化\n2. 用图片流记录展陈、讲解与互动\n3. 把“知识点”转化为后续科普素材",
      x: 730,
      y: 678,
      w: 340,
      h: 196,
      z: 20,
      style: { fontSize: 26, color: "#f7fbff", lineHeight: 1.42, fontWeight: 660 }
    }),
    rect({
      id: "museum-keyword-a",
      morphKey: "!!museum-keyword-a",
      name: "关键词 A",
      x: 1165,
      y: 748,
      w: 178,
      h: 58,
      z: 9,
      style: { fill: "rgba(216,180,90,.18)", stroke: "rgba(216,180,90,.58)", strokeWidth: 2, borderRadius: 29 }
    }),
    rect({
      id: "museum-keyword-b",
      morphKey: "!!museum-keyword-b",
      name: "关键词 B",
      x: 1370,
      y: 748,
      w: 178,
      h: 58,
      z: 9,
      style: { fill: "rgba(84,185,106,.18)", stroke: "rgba(84,185,106,.58)", strokeWidth: 2, borderRadius: 29 }
    }),
    rect({
      id: "museum-keyword-c",
      morphKey: "!!museum-keyword-c",
      name: "关键词 C",
      x: 1575,
      y: 748,
      w: 178,
      h: 58,
      z: 9,
      style: { fill: "rgba(70,201,255,.14)", stroke: "rgba(70,201,255,.46)", strokeWidth: 2, borderRadius: 29 }
    }),
    text({
      id: "museum-keywords",
      morphKey: "!!museum-keywords",
      name: "博物馆关键词",
      content: "看见传统          记录现场          转化科普",
      x: 1185,
      y: 762,
      w: 560,
      h: 34,
      z: 20,
      style: { fontSize: 24, color: "#f7fbff", fontWeight: 760 }
    })
  ]
});

export default slide;
