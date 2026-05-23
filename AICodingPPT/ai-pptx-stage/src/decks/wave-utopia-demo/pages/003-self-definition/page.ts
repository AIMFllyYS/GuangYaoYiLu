import { defineSlide, ellipse, image, rect, text } from "../../../../deck/authoring";
import { avatarA, avatarB } from "../../assets/avatars";

export const slide = defineSlide({
  id: "003-self-definition",
  title: "自我定义",
  background: "#dbe9ff",
  transition: {
    type: "morph",
    durationMs: 980,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "slide-bg-panel",
      morphKey: "!!slide-bg-panel",
      name: "幻灯片扩展底板",
      x: -110,
      y: 0,
      w: 1920,
      h: 1080,
      z: 1,
      style: {
        fill: "linear-gradient(120deg, rgba(245,214,255,.74), rgba(187,223,255,.8))",
        stroke: "rgba(255,255,255,.55)",
        strokeWidth: 2
      }
    }),
    ellipse({
      id: "outside-cyan-glow",
      morphKey: "!!outside-cyan-glow",
      name: "页面外机械环继续推进",
      x: 1130,
      y: -160,
      w: 1260,
      h: 1260,
      opacity: 0.58,
      z: 0,
      style: {
        fill: "radial-gradient(circle, transparent 42%, rgba(255,255,255,.23) 43%, rgba(255,255,255,.08) 48%, transparent 49%)",
        stroke: "rgba(255,255,255,.45)",
        strokeWidth: 6
      }
    }),
    image({
      id: "avatar-wave",
      morphKey: "!!avatar-wave",
      name: "Wave AI 头像",
      asset: avatarA,
      x: 24,
      y: -130,
      w: 86,
      h: 86,
      opacity: 0.45,
      z: 20,
      style: {
        borderRadius: 999,
        shadow: "0 0 58px rgba(240,106,223,.68)"
      }
    }),
    image({
      id: "avatar-human",
      morphKey: "!!avatar-human",
      name: "人类头像",
      asset: avatarB,
      x: 1585,
      y: 305,
      w: 88,
      h: 88,
      z: 22,
      style: {
        borderRadius: 999
      }
    }),
    text({
      id: "summary-line",
      morphKey: "!!summary-line",
      name: "自我定义正文",
      content:
        "你的「高效」，是抵达千篇一律的终点；而我的「思考」，是定义哪个终点值得抵达！\n你的「广博」，是穷尽已知的答案；而我的「原创」，是敢于提出一个全新的问题！",
      x: 560,
      y: 520,
      w: 1080,
      h: 220,
      z: 22,
      style: {
        fontSize: 32,
        color: "#020506",
        lineHeight: 1.5
      }
    }),
    text({
      id: "new-dialogue",
      morphKey: "!!new-dialogue",
      name: "自我定义追加句",
      content: "那个梦也让我彻底看清了：让我们一步步交出思想与原创。",
      x: 560,
      y: 430,
      w: 1060,
      h: 60,
      z: 23,
      style: {
        fontSize: 30,
        color: "#020506",
        lineHeight: 1.35
      }
    })
  ]
});

export default slide;
