import { defineSlide, ellipse, image, rect, text } from "../../../../deck/authoring";

const asset = (name: string) => new URL(`../../assets/${name}`, import.meta.url).href;

const games = [
  ["捣药", "从器具入手，体验传统制药动作"],
  ["闻药", "用气味记忆药材，降低认知门槛"],
  ["认药", "把冷门草本变成现场挑战"]
];

export const slide = defineSlide({
  id: "005-carnival",
  title: "嘉年华路演",
  background: "#f4efe2",
  transition: {
    type: "morph",
    durationMs: 920,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "carnival-bg",
      morphKey: "!!cover-veil",
      name: "嘉年华宣纸底",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 0,
      style: { fill: "linear-gradient(128deg, #f4efe2, #e1f4df 50%, #fffaf0)" }
    }),
    ellipse({
      id: "herbal-ring",
      morphKey: "!!herbal-ring",
      name: "嘉年华光环",
      x: 1080,
      y: -180,
      w: 980,
      h: 980,
      opacity: 0.32,
      z: 1,
      style: {
        fill: "radial-gradient(circle, transparent 42%, rgba(84,185,106,.22) 43%, rgba(216,180,90,.10) 54%, transparent 64%)",
        stroke: "rgba(15,107,95,.22)",
        strokeWidth: 4
      }
    }),
    image({
      id: "brand-logo-primary",
      morphKey: "!!brand-logo-primary",
      name: "主 Logo",
      asset: asset("logo-light.jpg"),
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
      content: "05 / 嘉年华路演",
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
      name: "嘉年华标题",
      content: "把中药知识做成可以上手的路演",
      x: 126,
      y: 166,
      w: 1180,
      h: 74,
      z: 22,
      style: { fontSize: 49, fontWeight: 850, color: "#08110d" }
    }),
    text({
      id: "carnival-subtitle",
      morphKey: "!!carnival-subtitle",
      name: "嘉年华副标题",
      content: "调研显示：青年更愿意参与趣味实操。嘉年华把“识草药、闻药香、做互动”放到现场。",
      x: 130,
      y: 250,
      w: 1260,
      h: 42,
      z: 22,
      style: { fontSize: 27, color: "rgba(8,17,13,.70)", fontWeight: 500 }
    }),
    image({
      id: "carnival-main-photo",
      morphKey: "!!carnival-main-photo",
      name: "嘉年华主图",
      asset: asset("carnival-photo-a.jpg"),
      alt: "嘉年华活动现场",
      x: 110,
      y: 350,
      w: 680,
      h: 452,
      z: 8,
      style: { objectFit: "cover", borderRadius: 32, shadow: "0 24px 58px rgba(8,17,13,.18)" }
    }),
    image({
      id: "carnival-side-photo-a",
      morphKey: "!!carnival-side-photo-a",
      name: "嘉年华现场小图 A",
      asset: asset("carnival-photo-b.jpg"),
      alt: "嘉年华活动现场",
      x: 830,
      y: 350,
      w: 360,
      h: 214,
      z: 8,
      style: { objectFit: "cover", borderRadius: 26, shadow: "0 18px 42px rgba(8,17,13,.16)" }
    }),
    image({
      id: "carnival-poster",
      morphKey: "!!carnival-poster",
      name: "嘉年华宣传海报",
      asset: asset("carnival-poster.png"),
      alt: "光药医路海报",
      x: 1260,
      y: 328,
      w: 292,
      h: 420,
      z: 9,
      style: { objectFit: "cover", borderRadius: 24, shadow: "0 22px 48px rgba(8,17,13,.18)" }
    }),
    image({
      id: "mini-program",
      morphKey: "!!mini-program",
      name: "小程序展示",
      asset: asset("mini-program.jpg"),
      alt: "小程序内部界面",
      x: 1585,
      y: 378,
      w: 210,
      h: 338,
      z: 10,
      style: { objectFit: "cover", borderRadius: 30, shadow: "0 20px 42px rgba(8,17,13,.20)" }
    }),
    ...games.map(([title], i) =>
      rect({
        id: `game-card-${i + 1}`,
        morphKey: `!!game-card-${i + 1}`,
        name: `小游戏 ${title}`,
        x: 830 + i * 305,
        y: 625,
        w: 270,
        h: 178,
        z: 7,
        style: {
          fill: "rgba(8,17,13,.88)",
          stroke: "rgba(216,180,90,.48)",
          strokeWidth: 2,
          borderRadius: 26
        }
      })
    ),
    ...games.map(([title, copy], i) =>
      text({
        id: `game-text-${i + 1}`,
        morphKey: `!!game-text-${i + 1}`,
        name: `小游戏文案 ${title}`,
        content: `${title}\n${copy}`,
        x: 858 + i * 305,
        y: 650,
        w: 214,
        h: 108,
        z: 20,
        style: { fontSize: 25, color: "#f7fbff", lineHeight: 1.42, textAlign: "center", fontWeight: 760 }
      })
    ),
    rect({
      id: "carnival-conclusion",
      morphKey: "!!carnival-conclusion",
      name: "嘉年华结论",
      x: 190,
      y: 870,
      w: 1540,
      h: 86,
      z: 6,
      style: { fill: "rgba(15,107,95,.92)", stroke: "rgba(216,180,90,.45)", strokeWidth: 2, borderRadius: 43 }
    }),
    text({
      id: "carnival-conclusion-text",
      morphKey: "!!carnival-conclusion-text",
      name: "嘉年华结论文本",
      content: "从“看见中药”到“动手理解中药”，路演让传统知识变成可参与的青年体验。",
      x: 250,
      y: 892,
      w: 1420,
      h: 42,
      z: 22,
      style: { fontSize: 29, color: "#f7fbff", textAlign: "center", fontWeight: 760 }
    })
  ]
});

export default slide;
