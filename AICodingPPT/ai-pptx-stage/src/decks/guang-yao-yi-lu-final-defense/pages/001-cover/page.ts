import { defineSlide, ellipse, image, line, rect, text } from "../../../../deck/authoring";

const A = "/src/decks/guang-yao-yi-lu-final-defense/assets/";

export const slide = defineSlide({
  id: "001-cover",
  title: "封面",
  background: "#07110d",
  transition: {
    type: "morph",
    durationMs: 950,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    image({
      id: "cover-photo-a",
      morphKey: "!!cover-photo-a",
      name: "封面合照左",
      asset: `${A}cover-photo-a.jpg`,
      alt: "活动合照",
      x: -60,
      y: 80,
      w: 690,
      h: 470,
      opacity: 0.54,
      z: 1,
      style: { objectFit: "cover", borderRadius: 30 }
    }),
    image({
      id: "cover-photo-b",
      morphKey: "!!cover-photo-b",
      name: "封面合照右",
      asset: `${A}cover-photo-b.jpg`,
      alt: "活动合照",
      x: 1230,
      y: 110,
      w: 640,
      h: 420,
      opacity: 0.48,
      z: 1,
      style: { objectFit: "cover", borderRadius: 30 }
    }),
    image({
      id: "cover-photo-c",
      morphKey: "!!cover-photo-c",
      name: "封面合照底部",
      asset: `${A}cover-photo-c.jpg`,
      alt: "活动现场",
      x: 1030,
      y: 650,
      w: 720,
      h: 360,
      opacity: 0.32,
      z: 1,
      style: { objectFit: "cover", borderRadius: 30 }
    }),
    rect({
      id: "cover-veil",
      morphKey: "!!cover-veil",
      name: "封面朦胧青黛遮罩",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 3,
      style: {
        fill: "linear-gradient(110deg, rgba(5,16,12,.92), rgba(8,60,45,.74) 48%, rgba(3,8,7,.92))"
      }
    }),
    ellipse({
      id: "herbal-ring",
      morphKey: "!!herbal-ring",
      name: "跨页草本光环",
      x: 1170,
      y: -240,
      w: 940,
      h: 940,
      opacity: 0.44,
      z: 4,
      style: {
        fill: "radial-gradient(circle, transparent 43%, rgba(84,185,106,.24) 44%, rgba(216,180,90,.08) 52%, transparent 58%)",
        stroke: "rgba(216,180,90,.36)",
        strokeWidth: 4
      }
    }),
    ellipse({
      id: "outside-jade-glow",
      morphKey: "!!outside-jade-glow",
      name: "画布外青绿色光源",
      x: -330,
      y: 540,
      w: 820,
      h: 820,
      opacity: 0.55,
      z: 2,
      style: {
        fill: "radial-gradient(circle, rgba(84,185,106,.45), rgba(84,185,106,.06) 58%, transparent 74%)"
      }
    }),
    line({
      id: "gold-thread-cover-a",
      morphKey: "!!gold-thread-a",
      name: "药金经络线 A",
      x: 180,
      y: 856,
      w: 1560,
      h: 0,
      z: 5,
      style: { stroke: "rgba(216,180,90,.65)", strokeWidth: 2 }
    }),
    image({
      id: "brand-logo-primary",
      morphKey: "!!brand-logo-primary",
      name: "主 Logo",
      asset: `${A}logo-dark.jpg`,
      alt: "光药医路 Logo",
      x: 82,
      y: 68,
      w: 104,
      h: 104,
      z: 20,
      style: { objectFit: "contain", borderRadius: 18 }
    }),
    image({
      id: "brand-logo-secondary",
      morphKey: "!!brand-logo-secondary",
      name: "副 Logo",
      asset: `${A}logo-secondary.png`,
      alt: "联合团支部 Logo",
      x: 210,
      y: 72,
      w: 112,
      h: 96,
      z: 20,
      style: { objectFit: "contain" }
    }),
    text({
      id: "cover-eyebrow",
      morphKey: "!!cover-eyebrow",
      name: "封面说明",
      content: "药学（中外）2503 · 光电 2506 · 基础医学（强基）2501 班团支部",
      x: 418,
      y: 210,
      w: 1080,
      h: 46,
      z: 21,
      style: { fontSize: 28, color: "rgba(223,246,229,.86)", fontWeight: 500, textAlign: "center" }
    }),
    text({
      id: "deck-title",
      morphKey: "!!deck-title",
      name: "主标题",
      content: "金光青黛同济兴\n百草杏林华夏清",
      x: 310,
      y: 318,
      w: 1300,
      h: 220,
      z: 22,
      style: {
        fontFamily: "Noto Serif SC, SimSun, serif",
        fontSize: 78,
        fontWeight: 800,
        color: "#f7fbff",
        lineHeight: 1.2,
        textAlign: "center",
        shadow: "0 0 36px rgba(216,180,90,.42)"
      }
    }),
    text({
      id: "project-name",
      morphKey: "!!project-name",
      name: "项目名称",
      content: "光药医路",
      x: 682,
      y: 602,
      w: 560,
      h: 88,
      z: 23,
      style: {
        fontSize: 54,
        fontWeight: 800,
        color: "#d8b45a",
        textAlign: "center",
        shadow: "0 0 28px rgba(216,180,90,.32)"
      }
    }),
    rect({
      id: "cover-date-pill",
      morphKey: "!!cover-date-pill",
      name: "答辩时间胶囊",
      x: 744,
      y: 725,
      w: 432,
      h: 64,
      z: 21,
      style: {
        fill: "rgba(244,239,226,.08)",
        stroke: "rgba(216,180,90,.46)",
        strokeWidth: 2,
        borderRadius: 32
      }
    }),
    text({
      id: "defense-date",
      morphKey: "!!defense-date",
      name: "答辩时间",
      content: "决赛答辩 · 2026.5.24",
      x: 765,
      y: 738,
      w: 390,
      h: 38,
      z: 22,
      style: { fontSize: 26, color: "#f4efe2", textAlign: "center", fontWeight: 700 }
    })
  ]
});

export default slide;
