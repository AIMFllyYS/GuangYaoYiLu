import { defineDeck, defineSlide, ellipse, icon, image, line, rect, text, wide16x9 } from "./builders";

const avatarA =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <defs>
    <radialGradient id="g" cx="40%" cy="32%">
      <stop offset="0" stop-color="#5bd8ff"/>
      <stop offset="0.55" stop-color="#0b1117"/>
      <stop offset="1" stop-color="#050607"/>
    </radialGradient>
  </defs>
  <rect width="160" height="160" fill="url(#g)"/>
  <path d="M35 98 C62 43 97 41 124 96" fill="none" stroke="#f7fbff" stroke-width="9" stroke-linecap="round"/>
  <path d="M58 98 L82 66 L102 98" fill="none" stroke="#a351ff" stroke-width="8" stroke-linecap="round"/>
  <text x="80" y="124" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="18" font-weight="700">WAVE</text>
</svg>`);

const avatarB =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <defs>
    <linearGradient id="p" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#3ecbff"/>
      <stop offset="1" stop-color="#22110c"/>
    </linearGradient>
  </defs>
  <rect width="160" height="160" fill="#07090a"/>
  <circle cx="83" cy="71" r="36" fill="url(#p)" opacity="0.8"/>
  <path d="M54 134 C61 105 103 103 113 134" fill="#0f171c"/>
  <path d="M63 59 C78 36 112 42 120 70" fill="none" stroke="#f4c17d" stroke-width="5" opacity="0.55"/>
</svg>`);

export const sampleDeck = defineDeck({
  id: "wave-utopia-ai-coding-final",
  title: "Wave Utopia AI Coding 决赛演示",
  size: wide16x9,
  theme: {
    name: "dark-wave-command",
    fontSans: "Microsoft YaHei UI",
    fontSerif: "Noto Serif SC",
    colors: {
      cyan: "#46c9ff",
      rose: "#f06adf",
      black: "#050607",
      white: "#f7fbff"
    }
  },
  slides: [
    defineSlide({
      id: "s01-agent-start",
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
    }),
    defineSlide({
      id: "s02-optimization-conflict",
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
    }),
    defineSlide({
      id: "s03-self-definition",
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
    })
  ]
});
