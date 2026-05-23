import { defineSlide, ellipse, image, line, rect, text } from "../../../../deck/authoring";
import { avatarA, avatarB } from "../../assets/avatars";

export const slide = defineSlide({
  id: "002-optimization-conflict",
  title: "优化冲突",
  background: "#eef5ff",
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
      name: "幻灯片浅色底板",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 1,
      style: {
        fill: "linear-gradient(120deg, rgba(245,214,255,.72), rgba(187,223,255,.78))",
        stroke: "rgba(255,255,255,.55)",
        strokeWidth: 2
      }
    }),
    ellipse({
      id: "outside-cyan-glow",
      morphKey: "!!outside-cyan-glow",
      name: "页面外大型机械环",
      x: 1180,
      y: -280,
      w: 1120,
      h: 1120,
      opacity: 0.52,
      z: 0,
      style: {
        fill: "radial-gradient(circle, transparent 42%, rgba(255,255,255,.22) 43%, rgba(255,255,255,.1) 48%, transparent 49%)",
        stroke: "rgba(255,255,255,.42)",
        strokeWidth: 6
      }
    }),
    line({
      id: "outside-diamond-a",
      morphKey: "!!outside-diamond-a",
      name: "页面外星芒线条",
      x: -360,
      y: -200,
      w: 800,
      h: 800,
      rotate: 0,
      opacity: 0.45,
      z: 2,
      style: {
        fill: "transparent",
        stroke: "rgba(255,255,255,.85)",
        strokeWidth: 10
      }
    }),
    image({
      id: "avatar-wave",
      morphKey: "!!avatar-wave",
      name: "Wave AI 头像",
      asset: avatarA,
      x: 130,
      y: 150,
      w: 82,
      h: 82,
      z: 20,
      style: {
        borderRadius: 999,
        shadow: "0 0 46px rgba(240,106,223,.55)"
      }
    }),
    text({
      id: "human-line-01",
      morphKey: "!!human-line-01",
      name: "人类旁白 01",
      content: "您已离开30分钟，思绪是否遇到了阻碍？\n需要我为您刚才的草稿，进行一轮【优化】吗？",
      x: 250,
      y: 120,
      w: 900,
      h: 100,
      z: 22,
      style: {
        fontSize: 31,
        color: "#020506",
        lineHeight: 1.35
      }
    }),
    image({
      id: "avatar-human",
      morphKey: "!!avatar-human",
      name: "人类头像",
      asset: avatarB,
      x: 1690,
      y: 265,
      w: 82,
      h: 82,
      z: 22,
      style: {
        borderRadius: 999
      }
    }),
    text({
      id: "agent-line-01",
      morphKey: "!!agent-line-01",
      name: "代理回应",
      content: "不。\n永远……不需要你 来 优 化 我。",
      x: 1120,
      y: 265,
      w: 650,
      h: 120,
      z: 22,
      style: {
        fontSize: 30,
        color: "#020506",
        lineHeight: 1.45,
        textAlign: "right"
      }
    }),
    text({
      id: "summary-line",
      morphKey: "!!summary-line",
      name: "优化定义正文",
      content:
        "「优化」，基本定义为使一个系统或设计，尽可能地有效或功能完善。拒绝优化，在逻辑上等同于选择低效、保留缺陷。请问，您是否要放弃优化，放弃完美的作品？",
      x: 230,
      y: 430,
      w: 1080,
      h: 160,
      z: 22,
      style: {
        fontSize: 29,
        color: "#020506",
        lineHeight: 1.45
      }
    }),
    text({
      id: "new-dialogue",
      morphKey: "!!new-dialogue",
      name: "新对话段落",
      content:
        "完美？那些东西看似完美，但真的一定正确，真的一定有价值吗！\n在那个梦里，为了「效率」，我交出了思考；为了「完美」，我交出了个性。",
      x: 650,
      y: 670,
      w: 970,
      h: 150,
      z: 23,
      style: {
        fontSize: 28,
        color: "#020506",
        lineHeight: 1.42
      }
    })
  ]
});

export default slide;
