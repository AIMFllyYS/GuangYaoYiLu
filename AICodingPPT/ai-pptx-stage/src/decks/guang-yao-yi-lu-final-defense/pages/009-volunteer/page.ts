import { defineSlide, ellipse, image, rect, text } from "../../../../deck/authoring";

const A = "/src/decks/guang-yao-yi-lu-final-defense/assets/";

export const slide = defineSlide({
  id: "009-volunteer",
  title: "社区志愿服务",
  background: "#f7fbff",
  transition: {
    type: "morph",
    durationMs: 940,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "volunteer-bg",
      morphKey: "!!cover-veil",
      name: "志愿服务浅底",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 0,
      style: { fill: "linear-gradient(130deg, #f7fbff, #f4efe2 45%, #dff6e5)" }
    }),
    ellipse({
      id: "herbal-ring",
      morphKey: "!!herbal-ring",
      name: "志愿服务光环",
      x: -280,
      y: -210,
      w: 900,
      h: 900,
      opacity: 0.23,
      z: 1,
      style: {
        fill: "radial-gradient(circle, transparent 42%, rgba(201,51,38,.18) 43%, rgba(84,185,106,.08) 55%, transparent 65%)",
        stroke: "rgba(201,51,38,.24)",
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
      content: "09 / 社区志愿服务",
      x: 1410,
      y: 72,
      w: 360,
      h: 38,
      z: 22,
      style: { fontSize: 24, color: "#c93326", textAlign: "right", fontWeight: 800 }
    }),
    text({
      id: "deck-title",
      morphKey: "!!deck-title",
      name: "志愿服务标题",
      content: "团学践行：让青年服务走进社区现场",
      x: 126,
      y: 166,
      w: 1120,
      h: 74,
      z: 22,
      style: { fontSize: 49, fontWeight: 850, color: "#08110d" }
    }),
    text({
      id: "volunteer-subtitle",
      morphKey: "!!volunteer-subtitle",
      name: "志愿服务副标题",
      content: "红建社区、清除牛皮癣、环境治理与志愿协作，把团日主题落实到身边公共空间。",
      x: 130,
      y: 250,
      w: 1260,
      h: 42,
      z: 22,
      style: { fontSize: 27, color: "rgba(8,17,13,.70)", fontWeight: 500 }
    }),
    image({
      id: "volunteer-photo-a",
      morphKey: "!!volunteer-photo-a",
      name: "志愿服务照片 A",
      asset: `${A}volunteer-photo-a.jpg`,
      alt: "社区志愿服务",
      x: 120,
      y: 350,
      w: 430,
      h: 560,
      z: 8,
      style: { objectFit: "cover", borderRadius: 32, shadow: "0 24px 54px rgba(8,17,13,.18)" }
    }),
    image({
      id: "volunteer-photo-b",
      morphKey: "!!volunteer-photo-b",
      name: "志愿服务照片 B",
      asset: `${A}volunteer-photo-b.jpg`,
      alt: "社区志愿服务",
      x: 588,
      y: 350,
      w: 500,
      h: 330,
      z: 8,
      style: { objectFit: "cover", borderRadius: 32, shadow: "0 24px 54px rgba(8,17,13,.16)" }
    }),
    image({
      id: "volunteer-photo-c",
      morphKey: "!!volunteer-photo-c",
      name: "志愿服务照片 C",
      asset: `${A}volunteer-photo-c.jpg`,
      alt: "社区志愿服务",
      x: 1124,
      y: 350,
      w: 320,
      h: 245,
      z: 8,
      style: { objectFit: "cover", borderRadius: 28, shadow: "0 22px 48px rgba(8,17,13,.15)" }
    }),
    image({
      id: "volunteer-photo-d",
      morphKey: "!!volunteer-photo-d",
      name: "志愿服务照片 D",
      asset: `${A}volunteer-photo-d.jpg`,
      alt: "社区志愿服务",
      x: 1480,
      y: 350,
      w: 320,
      h: 245,
      z: 8,
      style: { objectFit: "cover", borderRadius: 28, shadow: "0 22px 48px rgba(8,17,13,.15)" }
    }),
    rect({
      id: "volunteer-action-panel",
      morphKey: "!!volunteer-action-panel",
      name: "志愿服务行动面板",
      x: 588,
      y: 724,
      w: 1212,
      h: 186,
      z: 7,
      style: {
        fill: "rgba(8,17,13,.88)",
        stroke: "rgba(201,51,38,.38)",
        strokeWidth: 2,
        borderRadius: 34
      }
    }),
    text({
      id: "volunteer-action-text",
      morphKey: "!!volunteer-action-text",
      name: "志愿服务行动文本",
      content: "红建社区协作｜清除牛皮癣｜环境整理｜公共空间维护\n\n从“认识中药”到“服务人民健康”，团学实践把专业热情转化为真实行动。",
      x: 650,
      y: 758,
      w: 1088,
      h: 118,
      z: 20,
      style: { fontSize: 30, color: "#f7fbff", lineHeight: 1.5, textAlign: "center", fontWeight: 720 }
    })
  ]
});

export default slide;
