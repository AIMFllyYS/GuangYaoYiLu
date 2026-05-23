import { defineSlide, ellipse, line, rect, text } from "../../../../deck/authoring";

export const slide = defineSlide({
  id: "001-cinematic-cover",
  title: "???????",
  background: "#07110d",
  transition: {
    type: "morph",
    durationMs: 900,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "stage-bg-1",
      morphKey: "!!stage-bg",
      name: "????",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 0,
      style: { fill: "linear-gradient(120deg, #07110d, #0f3328 52%, #050807)" }
    }),
    ellipse({
      id: "herbal-ring-1",
      morphKey: "!!herbal-ring",
      name: "????",
      x: -260,
      y: 520,
      w: 820,
      h: 820,
      opacity: 0.32,
      z: 1,
      style: {
        fill: "radial-gradient(circle, transparent 43%, rgba(84,185,106,.24) 44%, rgba(216,180,90,.10) 54%, transparent 64%)",
        stroke: "rgba(216,180,90,.30)",
        strokeWidth: 4
      }
    }),
    line({
      id: "gold-path-1",
      morphKey: "!!gold-path",
      name: "????",
      x: 118,
      y: 866,
      w: 1380,
      h: 0,
      rotate: -3,
      opacity: 0.68,
      z: 2,
      style: { stroke: "rgba(216,180,90,.72)", strokeWidth: 4 }
    }),
    text({
      id: "deck-title-shadow-1",
      morphKey: "!!deck-title-shadow",
      name: "?????",
      content: "???????",
      x: 154,
      y: 170,
      w: 1280,
      h: 86,
      z: 20,
      style: { fontSize: 56, fontWeight: 850, color: "rgba(0,0,0,.48)", fontFamily: "Noto Serif SC, SimSun, serif" }
    }),
    text({
      id: "deck-title-1",
      morphKey: "!!deck-title",
      name: "???",
      content: "???????",
      x: 146,
      y: 160,
      w: 1280,
      h: 86,
      z: 22,
      style: { fontSize: 56, fontWeight: 850, color: "#f7fbff", fontFamily: "Noto Serif SC, SimSun, serif" }
    }),
    text({
      id: "stage-copy-1",
      morphKey: "!!stage-copy",
      name: "?????",
      content: "???????????????????????????",
      x: 150,
      y: 285,
      w: 1060,
      h: 92,
      z: 22,
      style: { fontSize: 31, color: "rgba(223,246,229,.86)", lineHeight: 1.42, fontWeight: 600 }
    }),
    text({
      id: "page-index-1",
      morphKey: "!!page-index",
      name: "??",
      content: "01 / 30",
      x: 1520,
      y: 82,
      w: 250,
      h: 42,
      z: 23,
      style: { fontSize: 25, color: "#d8b45a", textAlign: "right", fontWeight: 800 }
    })
  ]
});

export default slide;
