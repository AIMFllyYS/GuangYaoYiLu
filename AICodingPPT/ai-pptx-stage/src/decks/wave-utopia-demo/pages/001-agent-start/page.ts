import { defineSlide, ellipse, icon, image, line, rect, text } from "../../../../deck/authoring";
import { avatarA, avatarB } from "../../assets/avatars";

export const slide = defineSlide({
  id: "001-agent-start",
  title: "代理启动",
  background: "#030405",
  transition: {
    type: "morph",
    durationMs: 900,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "slide-bg-panel",
      morphKey: "!!slide-bg-panel",
      name: "幻灯片半透明底板",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 1,
      style: {
        fill: "rgba(2, 5, 7, 0.78)",
        stroke: "rgba(70, 201, 255, 0.34)",
        strokeWidth: 2
      }
    }),
    ellipse({
      id: "outside-cyan-glow",
      morphKey: "!!outside-cyan-glow",
      name: "页面外蓝色光源",
      x: 1700,
      y: -250,
      w: 620,
      h: 620,
      opacity: 0.7,
      z: 0,
      style: {
        fill: "radial-gradient(circle, rgba(70,201,255,.55), rgba(70,201,255,.05) 52%, transparent 72%)"
      }
    }),
    line({
      id: "outside-diamond-a",
      morphKey: "!!outside-diamond-a",
      name: "页面外菱形线条 A",
      x: -260,
      y: -80,
      w: 980,
      h: 980,
      rotate: -45,
      opacity: 0.32,
      z: 2,
      style: {
        fill: "transparent",
        stroke: "rgba(255,255,255,.28)",
        strokeWidth: 8,
        borderRadius: 0
      }
    }),
    image({
      id: "avatar-wave",
      morphKey: "!!avatar-wave",
      name: "Wave AI 头像",
      asset: avatarA,
      x: 128,
      y: 435,
      w: 86,
      h: 86,
      z: 10,
      style: {
        borderRadius: 999,
        shadow: "0 0 52px rgba(240,106,223,.75)"
      }
    }),
    text({
      id: "human-line-01",
      morphKey: "!!human-line-01",
      name: "人类旁白 01",
      content: "【人类】：1935年8月，四川松潘，草地边上。\n【人类】：天快黑了。",
      x: 800,
      y: 205,
      w: 780,
      h: 96,
      z: 20,
      style: {
        fontSize: 30,
        color: "#ffffff",
        lineHeight: 1.45
      }
    }),
    text({
      id: "agent-line-01",
      morphKey: "!!agent-line-01",
      name: "代理启动台词",
      content: "指令收到。正在启动代理模式，请看屏幕。",
      x: 300,
      y: 480,
      w: 720,
      h: 44,
      z: 20,
      style: {
        fontSize: 28,
        color: "#ffffff"
      }
    }),
    rect({
      id: "pack-card",
      morphKey: "!!pack-card",
      name: "浪前大学答辩资料包",
      x: 300,
      y: 545,
      w: 660,
      h: 112,
      z: 9,
      style: {
        fill: "rgba(255,255,255,.055)",
        stroke: "rgba(255,255,255,.28)",
        strokeWidth: 2,
        borderRadius: 28
      }
    }),
    text({
      id: "pack-copy",
      morphKey: "!!pack-copy",
      name: "资料包文字",
      content: "浪前大学答辩资料\nPack",
      x: 340,
      y: 572,
      w: 360,
      h: 64,
      z: 20,
      style: {
        fontSize: 22,
        color: "rgba(247,251,255,.72)",
        lineHeight: 1.25
      }
    }),
    image({
      id: "avatar-human",
      morphKey: "!!avatar-human",
      name: "人类头像",
      asset: avatarB,
      x: 1736,
      y: 250,
      w: 86,
      h: 86,
      z: 22,
      style: {
        borderRadius: 999,
        stroke: "#ffffff",
        strokeWidth: 2
      }
    }),
    icon({
      id: "logo-wave",
      morphKey: "!!logo-wave",
      name: "右上角 Wave 标识",
      asset: "Far Wave",
      x: 1670,
      y: 78,
      w: 150,
      h: 70,
      z: 21,
      style: {
        color: "#34c6ff",
        fontSize: 24,
        fontWeight: 800
      }
    }),
    text({
      id: "summary-line",
      morphKey: "!!summary-line",
      name: "页面总结句",
      content: "方案已生成。您的大学，从此只有探索，没有迷茫。",
      x: 300,
      y: 735,
      w: 980,
      h: 48,
      z: 22,
      style: {
        fontSize: 30,
        color: "#ffffff"
      }
    })
  ]
});

export default slide;
