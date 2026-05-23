import { defineSlide, ellipse, image, rect, text } from "../../../../deck/authoring";

const asset = (name: string) => new URL(`../../assets/${name}`, import.meta.url).href;

export const slide = defineSlide({
  id: "004-team-brand",
  title: "人员组成与品牌",
  background: "#07110d",
  transition: {
    type: "morph",
    durationMs: 920,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    rect({
      id: "dark-bg",
      morphKey: "!!cover-veil",
      name: "深色品牌底",
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      z: 0,
      style: { fill: "linear-gradient(118deg, #06100c, #0f3328 48%, #050807)" }
    }),
    ellipse({
      id: "herbal-ring",
      morphKey: "!!herbal-ring",
      name: "品牌页光环",
      x: 1140,
      y: 80,
      w: 980,
      h: 980,
      opacity: 0.42,
      z: 1,
      style: {
        fill: "radial-gradient(circle, transparent 44%, rgba(84,185,106,.22) 45%, rgba(216,180,90,.10) 54%, transparent 64%)",
        stroke: "rgba(216,180,90,.30)",
        strokeWidth: 4
      }
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
    text({
      id: "section-index",
      morphKey: "!!section-index",
      name: "页码章节",
      content: "04 / 组成与文宣",
      x: 1450,
      y: 72,
      w: 320,
      h: 38,
      z: 22,
      style: { fontSize: 24, color: "#d8b45a", textAlign: "right", fontWeight: 800 }
    }),
    text({
      id: "deck-title",
      morphKey: "!!deck-title",
      name: "品牌页标题",
      content: "75 人联合团支部：把“光、药、医”走成一条路",
      x: 126,
      y: 166,
      w: 1250,
      h: 74,
      z: 22,
      style: { fontSize: 48, fontWeight: 850, color: "#f7fbff" }
    }),
    text({
      id: "brand-subtitle",
      morphKey: "!!brand-subtitle",
      name: "品牌页副标题",
      content: "“光药医路”由三个支部各取一字，也是一条从专业协同到社会实践的青年路径。",
      x: 130,
      y: 250,
      w: 1180,
      h: 42,
      z: 22,
      style: { fontSize: 27, color: "rgba(223,246,229,.78)", fontWeight: 500 }
    }),
    ...([
      ["team-photo-pharmacy", "药", "药学（中外）2503", asset("team-photo-pharmacy.jpg"), 128],
      ["team-photo-optics", "光", "光电 2506", asset("team-photo-optics.jpg"), 500],
      ["team-photo-medicine", "医", "基础医学（强基）2501", asset("team-photo-medicine.png"), 872]
    ] as const).map(([id, , label, asset, x]) =>
      image({
        id,
        morphKey: `!!${id}`,
        name: `${label} 合照`,
        asset,
        alt: `${label} 合照`,
        x: Number(x),
        y: 370,
        w: 330,
        h: 245,
        z: 8,
        style: { objectFit: "cover", borderRadius: 28, shadow: "0 22px 50px rgba(0,0,0,.32)" }
      })
    ),
    ...([
      ["name-pill-pharmacy", "药", "药学：草本与药理", 128],
      ["name-pill-optics", "光", "光电：视觉与传播", 500],
      ["name-pill-medicine", "医", "基医：健康与生命", 872]
    ] as const).map(([id, char, , x]) =>
      rect({
        id,
        morphKey: `!!${id}`,
        name: `${char} 字来源`,
        x: Number(x),
        y: 635,
        w: 330,
        h: 116,
        z: 7,
        style: {
          fill: "rgba(244,239,226,.09)",
          stroke: "rgba(216,180,90,.45)",
          strokeWidth: 2,
          borderRadius: 28
        }
      })
    ),
    ...([
      ["name-text-pharmacy", "药\n药学：草本与药理", 128],
      ["name-text-optics", "光\n光电：视觉与传播", 500],
      ["name-text-medicine", "医\n基医：健康与生命", 872]
    ] as const).map(([id, content, x]) =>
      text({
        id,
        morphKey: `!!${id}`,
        name: "名称由来文本",
        content,
        x: Number(x) + 28,
        y: 652,
        w: 274,
        h: 82,
        z: 20,
        style: { fontSize: 28, color: "#f7fbff", lineHeight: 1.35, textAlign: "center", fontWeight: 780 }
      })
    ),
    image({
      id: "promo-poster",
      morphKey: "!!promo-poster",
      name: "宣传海报",
      asset: asset("promo-poster-1.png"),
      alt: "宣传海报",
      x: 1300,
      y: 276,
      w: 245,
      h: 356,
      z: 9,
      style: { objectFit: "cover", borderRadius: 20, shadow: "0 22px 48px rgba(0,0,0,.34)" }
    }),
    image({
      id: "yaoguang-helper",
      morphKey: "!!yaoguang-helper",
      name: "瑶光助手",
      asset: asset("yaoguang-1.jpg"),
      alt: "瑶光助手形象",
      x: 1580,
      y: 330,
      w: 220,
      h: 220,
      z: 10,
      style: { objectFit: "cover", borderRadius: 110, shadow: "0 0 48px rgba(84,185,106,.45)" }
    }),
    rect({
      id: "brand-impact-bar",
      morphKey: "!!brand-impact-bar",
      name: "品牌成果底栏",
      x: 128,
      y: 840,
      w: 1664,
      h: 96,
      z: 6,
      style: {
        fill: "rgba(8,17,13,.70)",
        stroke: "rgba(84,185,106,.40)",
        strokeWidth: 2,
        borderRadius: 36
      }
    }),
    text({
      id: "brand-impact-text",
      morphKey: "!!brand-impact-text",
      name: "品牌成果文本",
      content: "团队组织、视觉识别、海报推文、瑶光助手共同构成可被看见、可被记住、可被继续传播的活动品牌。",
      x: 180,
      y: 866,
      w: 1560,
      h: 46,
      z: 22,
      style: { fontSize: 29, color: "#dff6e5", textAlign: "center", fontWeight: 700 }
    })
  ]
});

export default slide;
