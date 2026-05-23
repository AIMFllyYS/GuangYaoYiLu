import { defineSlide, ellipse, image, line, rect, text } from "../../../../deck/authoring";

const A = "/src/decks/guang-yao-yi-lu-final-defense/assets/";

export const slide = defineSlide({
  id: "003-policy",
  title: "政策",
  background: "#f7fbff",
  transition: {
    type: "morph",
    durationMs: 900,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "policy-bg",
      morphKey: "!!cover-veil",
      name: "政策页白底",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 0,
      style: { fill: "linear-gradient(135deg, #f7fbff, #f4efe2 58%, #e5f3e9)" }
    }),
    ellipse({
      id: "herbal-ring",
      morphKey: "!!herbal-ring",
      name: "政策页光环",
      x: -220,
      y: -250,
      w: 780,
      h: 780,
      opacity: 0.25,
      z: 1,
      style: {
        fill: "radial-gradient(circle, transparent 42%, rgba(201,51,38,.18) 43%, rgba(216,180,90,.08) 52%, transparent 60%)",
        stroke: "rgba(201,51,38,.22)",
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
      content: "03 / 政策",
      x: 1520,
      y: 72,
      w: 250,
      h: 38,
      z: 22,
      style: { fontSize: 24, color: "#c93326", textAlign: "right", fontWeight: 800 }
    }),
    text({
      id: "deck-title",
      morphKey: "!!deck-title",
      name: "政策页标题",
      content: "把青年调研放进国家坐标",
      x: 126,
      y: 170,
      w: 950,
      h: 72,
      z: 22,
      style: { fontSize: 50, fontWeight: 850, color: "#08110d" }
    }),
    text({
      id: "policy-subtitle",
      morphKey: "!!policy-subtitle",
      name: "政策页副标题",
      content: "健康中国建设与中医药传承创新，为“光药医路”的科普实践提供方向。",
      x: 130,
      y: 254,
      w: 1100,
      h: 44,
      z: 22,
      style: { fontSize: 27, color: "rgba(8,17,13,.70)", fontWeight: 500 }
    }),
    ...(["policy-doc-a", "policy-doc-b", "policy-doc-c"] as const).map((id, i) =>
      rect({
        id,
        morphKey: `!!${id}`,
        name: `政策文件卡 ${i + 1}`,
        x: 126 + i * 555,
        y: 372,
        w: 500,
        h: 450,
        z: 6,
        style: {
          fill: "#fffaf0",
          stroke: "rgba(201,51,38,.34)",
          strokeWidth: 2,
          borderRadius: 18,
          shadow: "0 18px 44px rgba(8,17,13,.14)"
        }
      })
    ),
    ...([
      ["policy-head-a", "中共中央 国务院", 126],
      ["policy-head-b", "国务院", 681],
      ["policy-head-c", "传承创新", 1236]
    ] as const).map(([id, content, x]) =>
      text({
        id,
        morphKey: `!!${id}`,
        name: "红头文件抬头",
        content,
        x: Number(x) + 42,
        y: 414,
        w: 416,
        h: 44,
        z: 20,
        style: { fontSize: 28, color: "#c93326", textAlign: "center", fontWeight: 850 }
      })
    ),
    line({
      id: "policy-red-rule-a",
      morphKey: "!!policy-red-rule-a",
      name: "红头线 A",
      x: 176,
      y: 482,
      w: 400,
      h: 0,
      z: 20,
      style: { stroke: "#c93326", strokeWidth: 3 }
    }),
    line({
      id: "policy-red-rule-b",
      morphKey: "!!policy-red-rule-b",
      name: "红头线 B",
      x: 731,
      y: 482,
      w: 400,
      h: 0,
      z: 20,
      style: { stroke: "#c93326", strokeWidth: 3 }
    }),
    line({
      id: "policy-red-rule-c",
      morphKey: "!!policy-red-rule-c",
      name: "红头线 C",
      x: 1286,
      y: 482,
      w: 400,
      h: 0,
      z: 20,
      style: { stroke: "#c93326", strokeWidth: 3 }
    }),
    ...([
      ["policy-title-a", "《“健康中国2030”规划纲要》\n充分发挥中医药独特优势\n把健康融入所有政策", 166],
      ["policy-title-b", "《中医药发展战略规划纲要》\n推进继承创新\n推动中医药走进校园与社区", 721],
      ["policy-title-c", "中医药传承创新发展\n传承精华，守正创新\n让传统文化回到青年生活", 1276]
    ] as const).map(([id, content, x]) =>
      text({
        id,
        morphKey: `!!${id}`,
        name: "政策正文摘要",
        content,
        x: Number(x),
        y: 534,
        w: 420,
        h: 174,
        z: 20,
        style: { fontSize: 29, color: "#08110d", lineHeight: 1.46, fontWeight: 760, textAlign: "center" }
      })
    ),
    rect({
      id: "policy-bridge",
      morphKey: "!!policy-bridge",
      name: "政策到行动连接条",
      x: 350,
      y: 875,
      w: 1220,
      h: 92,
      z: 7,
      style: {
        fill: "rgba(15,107,95,.92)",
        stroke: "rgba(216,180,90,.52)",
        strokeWidth: 2,
        borderRadius: 46
      }
    }),
    text({
      id: "policy-bridge-text",
      morphKey: "!!policy-bridge-text",
      name: "政策到行动结论",
      content: "国家倡导的“传承创新”，落到我们这里，就是一次青年可参与、社区可感知、线上可沉淀的中药文化行动。",
      x: 410,
      y: 898,
      w: 1100,
      h: 46,
      z: 22,
      style: { fontSize: 28, color: "#f7fbff", textAlign: "center", fontWeight: 700 }
    })
  ]
});

export default slide;
