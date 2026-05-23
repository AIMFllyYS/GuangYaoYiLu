import { defineSlide, ellipse, image, rect, text } from "../../../../deck/authoring";

const asset = (name: string) => new URL(`../../assets/${name}`, import.meta.url).href;

export const slide = defineSlide({
  id: "010-ending",
  title: "结尾",
  background: "#030405",
  transition: {
    type: "morph",
    durationMs: 980,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "ending-bg",
      morphKey: "!!cover-veil",
      name: "结尾幕布底",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 0,
      style: { fill: "linear-gradient(110deg, #030405, #07110d 48%, #020302)" }
    }),
    ellipse({
      id: "herbal-ring",
      morphKey: "!!herbal-ring",
      name: "结尾草本光环",
      x: 520,
      y: -330,
      w: 880,
      h: 880,
      opacity: 0.28,
      z: 1,
      style: {
        fill: "radial-gradient(circle, transparent 42%, rgba(216,180,90,.18) 43%, rgba(84,185,106,.10) 55%, transparent 65%)",
        stroke: "rgba(216,180,90,.28)",
        strokeWidth: 5
      }
    }),
    rect({
      id: "curtain-top",
      morphKey: "!!curtain-top",
      name: "电影幕布上",
      x: 0,
      y: 0,
      w: 1920,
      h: 114,
      z: 5,
      style: { fill: "rgba(0,0,0,.58)" }
    }),
    rect({
      id: "curtain-bottom",
      morphKey: "!!curtain-bottom",
      name: "电影幕布下",
      x: 0,
      y: 966,
      w: 1920,
      h: 114,
      z: 5,
      style: { fill: "rgba(0,0,0,.58)" }
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
    image({
      id: "ending-photo-a",
      morphKey: "!!volunteer-photo-a",
      name: "结尾照片流 A",
      asset: asset("cover-photo-a.jpg"),
      alt: "活动照片",
      x: -30,
      y: 206,
      w: 430,
      h: 300,
      rotate: -5,
      opacity: 0.84,
      z: 6,
      style: { objectFit: "cover", borderRadius: 24, shadow: "0 22px 48px rgba(0,0,0,.34)" }
    }),
    image({
      id: "ending-photo-b",
      morphKey: "!!volunteer-photo-b",
      name: "结尾照片流 B",
      asset: asset("carnival-photo-c.jpeg"),
      alt: "活动照片",
      x: 310,
      y: 610,
      w: 380,
      h: 250,
      rotate: 4,
      opacity: 0.80,
      z: 6,
      style: { objectFit: "cover", borderRadius: 24, shadow: "0 22px 48px rgba(0,0,0,.34)" }
    }),
    image({
      id: "ending-photo-c",
      morphKey: "!!museum-photo-c",
      name: "结尾照片流 C",
      asset: asset("museum-photo-c.jpg"),
      alt: "活动照片",
      x: 1230,
      y: 196,
      w: 520,
      h: 310,
      rotate: 4,
      opacity: 0.82,
      z: 6,
      style: { objectFit: "cover", borderRadius: 24, shadow: "0 22px 48px rgba(0,0,0,.34)" }
    }),
    image({
      id: "ending-photo-d",
      morphKey: "!!winter-talk-a",
      name: "结尾照片流 D",
      asset: asset("winter-talk-a.png"),
      alt: "活动照片",
      x: 1420,
      y: 640,
      w: 390,
      h: 250,
      rotate: -4,
      opacity: 0.78,
      z: 6,
      style: { objectFit: "cover", borderRadius: 24, shadow: "0 22px 48px rgba(0,0,0,.34)" }
    }),
    rect({
      id: "ending-center-panel",
      morphKey: "!!ending-center-panel",
      name: "结尾中心底板",
      x: 410,
      y: 286,
      w: 1100,
      h: 470,
      z: 8,
      style: {
        fill: "rgba(3,4,5,.72)",
        stroke: "rgba(216,180,90,.42)",
        strokeWidth: 2,
        borderRadius: 42,
        shadow: "0 0 70px rgba(84,185,106,.18)"
      }
    }),
    text({
      id: "deck-title",
      morphKey: "!!deck-title",
      name: "结尾主标题",
      content: "金光青黛同济兴\n百草杏林华夏清",
      x: 500,
      y: 370,
      w: 920,
      h: 174,
      z: 22,
      style: {
        fontFamily: "Noto Serif SC, SimSun, serif",
        fontSize: 62,
        fontWeight: 850,
        color: "#f7fbff",
        textAlign: "center",
        lineHeight: 1.24,
        shadow: "0 0 34px rgba(216,180,90,.42)"
      }
    }),
    text({
      id: "project-name",
      morphKey: "!!project-name",
      name: "结尾项目名称",
      content: "光药医路",
      x: 710,
      y: 584,
      w: 500,
      h: 74,
      z: 23,
      style: { fontSize: 48, color: "#d8b45a", textAlign: "center", fontWeight: 850 }
    }),
    text({
      id: "ending-thanks",
      morphKey: "!!ending-thanks",
      name: "致谢",
      content: "感谢聆听",
      x: 802,
      y: 692,
      w: 316,
      h: 48,
      z: 23,
      style: { fontSize: 31, color: "rgba(223,246,229,.86)", textAlign: "center", fontWeight: 720 }
    })
  ]
});

export default slide;
