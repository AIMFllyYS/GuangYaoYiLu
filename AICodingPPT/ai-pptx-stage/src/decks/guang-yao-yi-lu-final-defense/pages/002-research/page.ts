import { defineSlide, ellipse, image, rect, text } from "../../../../deck/authoring";

const A = "/src/decks/guang-yao-yi-lu-final-defense/assets/";

const findings = [
  ["认知水平", "常见药食同源药材辨识度较高，冷门草本认知偏弱。"],
  ["接触习惯", "青年主要从短视频、长辈讲述、校园课堂接触中药。"],
  ["现存问题", "煎煮麻烦、口感苦涩、概念模糊，是中药普及阻力。"],
  ["传承意愿", "趣味实操类活动吸引力明显高于纯理论科普。"]
];

export const slide = defineSlide({
  id: "002-research",
  title: "调研",
  background: "#f4efe2",
  transition: {
    type: "morph",
    durationMs: 900,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "paper-bg",
      morphKey: "!!cover-veil",
      name: "宣纸浅底",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 0,
      style: { fill: "linear-gradient(120deg, #f4efe2, #dff6e5 56%, #f6f1df)" }
    }),
    ellipse({
      id: "herbal-ring",
      morphKey: "!!herbal-ring",
      name: "跨页草本光环",
      x: 1320,
      y: -310,
      w: 880,
      h: 880,
      opacity: 0.26,
      z: 1,
      style: {
        fill: "radial-gradient(circle, transparent 44%, rgba(15,107,95,.20) 45%, rgba(84,185,106,.08) 54%, transparent 62%)",
        stroke: "rgba(15,107,95,.24)",
        strokeWidth: 5
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
      content: "02 / 调研",
      x: 1520,
      y: 72,
      w: 250,
      h: 38,
      z: 22,
      style: { fontSize: 24, color: "#0f6b5f", textAlign: "right", fontWeight: 800 }
    }),
    text({
      id: "deck-title",
      morphKey: "!!deck-title",
      name: "缩略主标题",
      content: "从问卷开始：青年如何看见中药？",
      x: 124,
      y: 170,
      w: 980,
      h: 70,
      z: 22,
      style: { fontSize: 48, fontWeight: 850, color: "#08110d" }
    }),
    text({
      id: "research-subtitle",
      morphKey: "!!research-subtitle",
      name: "调研副标题",
      content: "《本草知心意·全民中药认知趣味调研》把活动策划落到真实认知痛点。",
      x: 128,
      y: 252,
      w: 1040,
      h: 44,
      z: 22,
      style: { fontSize: 27, color: "rgba(8,17,13,.72)", fontWeight: 500 }
    }),
    image({
      id: "survey-card-a",
      morphKey: "!!survey-card-a",
      name: "问卷截图 A",
      asset: `${A}research-survey-1.png`,
      alt: "问卷截图",
      x: 128,
      y: 365,
      w: 320,
      h: 450,
      z: 8,
      style: { objectFit: "cover", borderRadius: 22, shadow: "0 20px 46px rgba(8,17,13,.18)" }
    }),
    image({
      id: "survey-card-b",
      morphKey: "!!survey-card-b",
      name: "问卷截图 B",
      asset: `${A}research-survey-2.png`,
      alt: "问卷截图",
      x: 490,
      y: 392,
      w: 300,
      h: 410,
      z: 8,
      style: { objectFit: "cover", borderRadius: 22, shadow: "0 18px 38px rgba(8,17,13,.16)" }
    }),
    ...[0, 1, 2, 3].map((i) =>
      image({
        id: `result-chart-${i + 1}`,
        morphKey: `!!result-chart-${i + 1}`,
        name: `调研结果图 ${i + 1}`,
        asset: `${A}research-result-${i + 1}.jpg`,
        alt: "调研结果饼图",
        x: 890 + (i % 2) * 290,
        y: 335 + Math.floor(i / 2) * 230,
        w: 245,
        h: 185,
        z: 9,
        style: { objectFit: "contain", borderRadius: 18, shadow: "0 16px 32px rgba(8,17,13,.12)" }
      })
    ),
    rect({
      id: "findings-panel",
      morphKey: "!!findings-panel",
      name: "调研结论面板",
      x: 890,
      y: 775,
      w: 830,
      h: 172,
      z: 7,
      style: {
        fill: "rgba(8,17,13,.88)",
        stroke: "rgba(216,180,90,.56)",
        strokeWidth: 2,
        borderRadius: 26,
        shadow: "0 26px 54px rgba(8,17,13,.25)"
      }
    }),
    ...findings.map(([label, copy], i) =>
      text({
        id: `finding-${i + 1}`,
        morphKey: `!!finding-${i + 1}`,
        name: `调研结论 ${label}`,
        content: `${label}｜${copy}`,
        x: 928 + (i % 2) * 390,
        y: 810 + Math.floor(i / 2) * 58,
        w: 350,
        h: 44,
        z: 20,
        style: { fontSize: 22, color: "#f7fbff", lineHeight: 1.25, fontWeight: 600 }
      })
    )
  ]
});

export default slide;
