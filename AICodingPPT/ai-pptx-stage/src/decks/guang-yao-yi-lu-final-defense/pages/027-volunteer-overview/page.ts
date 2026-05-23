import { defineSlide, ellipse, image, line, rect, text } from "../../../../deck/authoring";

const asset = (name: string) => new URL(`../../assets/${name}`, import.meta.url).href;

export const slide = defineSlide({
  id: "027-volunteer-overview",
  title: "社区志愿服务：让团学实践落到真实公共空间",
  background: "#f4efe2",
  transition: {
    type: "morph",
    durationMs: 920,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    image({ id: "bg-image", morphKey: "!!section-bg", name: "章节背景", asset: asset("generated/bg-027-volunteer.jpg"), alt: "无文字生成背景", x: 0, y: 0, w: 1920, h: 1080, opacity: 1, rotate: 0, z: 0, style: {"objectFit":"cover"} }),
    rect({ id: "bg-veil", morphKey: "!!stage-bg", name: "背景遮罩", x: 0, y: 0, w: 1920, h: 1080, z: 1, style: {"fill":"linear-gradient(110deg, rgba(247,251,255,.84), rgba(244,239,226,.64), rgba(223,246,229,.76))"} }),
    rect({ id: "grain-layer", morphKey: "!!paper-grain", name: "宣纸暗纹", x: -80, y: -60, w: 2080, h: 1200, opacity: 0.32, z: 2, style: {"fill":"radial-gradient(circle at 20% 30%, rgba(216,180,90,.20), transparent 24%), radial-gradient(circle at 80% 72%, rgba(84,185,106,.18), transparent 28%)"} }),
    ellipse({ id: "herbal-ring", morphKey: "!!herbal-ring", name: "草本光环", x: 1130, y: 460, w: 860, h: 860, opacity: 0.42, z: 3, style: {"fill":"radial-gradient(circle, transparent 43%, rgba(84,185,106,.24) 44%, rgba(216,180,90,.10) 55%, transparent 66%)","stroke":"rgba(216,180,90,.30)","strokeWidth":5} }),
    ellipse({ id: "herbal-ring-inner", morphKey: "!!herbal-ring-inner", name: "内层药金环", x: 1350, y: 300, w: 420, h: 420, opacity: 0.36, z: 4, style: {"fill":"transparent","stroke":"rgba(216,180,90,.42)","strokeWidth":3} }),
    line({ id: "gold-path", morphKey: "!!gold-path", name: "药金路径", x: 180, y: 825, w: 1480, h: 0, rotate: -7, opacity: 0.74, z: 5, style: {"stroke":"rgba(216,180,90,.74)","strokeWidth":4} }),
    image({ id: "brand-logo-primary", morphKey: "!!brand-logo-primary", name: "主 Logo", asset: asset("brand/logo-light.jpg"), alt: "主 Logo", x: 70, y: 58, w: 78, h: 78, opacity: 1, rotate: 0, z: 25, style: {"objectFit":"contain","borderRadius":16} }),
    image({ id: "brand-logo-secondary", morphKey: "!!brand-logo-secondary", name: "副 Logo", asset: asset("brand/logo-secondary.png"), alt: "副 Logo", x: 166, y: 56, w: 86, h: 86, opacity: 1, rotate: 0, z: 25, style: {"objectFit":"contain"} }),
    text({ id: "section-label", morphKey: "!!section-label", name: "章节标签", content: "志愿服务 / 总览", x: 1410, y: 76, w: 380, h: 36, z: 26, style: {"fontSize":23,"color":"#0f6b5f","textAlign":"right","fontWeight":800} }),
    text({ id: "title-shadow", morphKey: "!!deck-title-shadow", name: "标题暗影层", content: "社区志愿服务：让团学实践落到真实公共空间", x: 154, y: 154, w: 1280, h: 92, z: 18, style: {"fontFamily":"Noto Serif SC, SimSun, serif","fontSize":47,"fontWeight":900,"color":"rgba(0,0,0,.34)"} }),
    text({ id: "title-main", morphKey: "!!deck-title", name: "主标题", content: "社区志愿服务：让团学实践落到真实公共空间", x: 146, y: 146, w: 1280, h: 92, z: 27, style: {"fontFamily":"Noto Serif SC, SimSun, serif","fontSize":47,"fontWeight":900,"color":"#08110d","shadow":"0 0 30px rgba(216,180,90,.28)","lineHeight":1.1} }),
    text({ id: "title-gold", morphKey: "!!deck-title-gold", name: "药金艺术字", content: "从讲知识到做服务，项目的社会价值在社区现场被看见", x: 150, y: 248, w: 1260, h: 78, z: 28, style: {"fontFamily":"Noto Serif SC, SimSun, serif","fontSize":34,"fontWeight":850,"color":"#d8b45a","lineHeight":1.2} }),
    text({ id: "subtitle", morphKey: "!!stage-copy", name: "页内说明", content: "志愿服务章节强调团学践行：不只讲中药文化，也参与社区环境治理，体现青年支部的公共责任。", x: 152, y: 326, w: 1080, h: 94, z: 28, style: {"fontSize":26,"color":"rgba(8,17,13,.72)","lineHeight":1.42,"fontWeight":620} }),
    rect({ id: "main-panel", morphKey: "!!main-panel", name: "主内容玻璃面板", x: 112, y: 438, w: 1040, h: 450, z: 8, style: {"fill":"rgba(255,250,240,.84)","stroke":"rgba(15,107,95,.28)","strokeWidth":2,"borderRadius":32,"shadow":"0 22px 60px rgba(0,0,0,.20)"} }),
    rect({ id: "kicker-chip", morphKey: "!!kicker-chip", name: "页眉胶囊", x: 152, y: 454, w: 620, h: 52, z: 20, style: {"fill":"rgba(15,107,95,.10)","stroke":"rgba(15,107,95,.28)","strokeWidth":2,"borderRadius":26} }),
    text({ id: "kicker-text", morphKey: "!!kicker-text", name: "页眉关键词", content: "红建社区 · 清除牛皮癣 · 公共环境共建", x: 178, y: 466, w: 570, h: 30, z: 29, style: {"fontSize":22,"color":"#0f6b5f","fontWeight":850} }),
    image({ id: "icon-1", morphKey: "!!icon-1", name: "主题图标 1", asset: asset("icons/volunteer.svg"), alt: "volunteer", x: 820, y: 454, w: 56, h: 56, opacity: 1, rotate: 0, z: 28, style: {"objectFit":"contain","borderRadius":14} }),
    image({ id: "icon-2", morphKey: "!!icon-2", name: "主题图标 2", asset: asset("icons/map-pin.svg"), alt: "map-pin", x: 896, y: 454, w: 56, h: 56, opacity: 1, rotate: 0, z: 28, style: {"objectFit":"contain","borderRadius":14} }),
    image({ id: "icon-3", morphKey: "!!icon-3", name: "主题图标 3", asset: asset("icons/leaf.svg"), alt: "leaf", x: 972, y: 454, w: 56, h: 56, opacity: 1, rotate: 0, z: 28, style: {"objectFit":"contain","borderRadius":14} }),
    image({ id: "icon-4", morphKey: "!!icon-4", name: "主题图标 4", asset: asset("icons/film.svg"), alt: "film", x: 1048, y: 454, w: 56, h: 56, opacity: 1, rotate: 0, z: 28, style: {"objectFit":"contain","borderRadius":14} }),
    rect({ id: "card-1", morphKey: "!!volunteer-card-1", name: "内容卡 服务对象", x: 154, y: 546, w: 430, h: 108, z: 13, style: {"fill":"rgba(8,17,13,.07)","stroke":"rgba(15,107,95,.28)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-1", morphKey: "!!card-title-27-1", name: "内容卡标题 1", content: "服务对象", x: 178, y: 562, w: 380, h: 32, z: 30, style: {"fontSize":24,"color":"#0f6b5f","fontWeight":860} }),
    text({ id: "card-copy-1", morphKey: "!!card-copy-27-1", name: "内容卡说明 1", content: "走进红建社区，面向真实公共空间", x: 178, y: 598, w: 382, h: 44, z: 30, style: {"fontSize":19,"color":"#08110d","lineHeight":1.25,"fontWeight":620} }),
    rect({ id: "card-2", morphKey: "!!volunteer-card-2", name: "内容卡 服务内容", x: 634, y: 546, w: 430, h: 108, z: 13, style: {"fill":"rgba(8,17,13,.07)","stroke":"rgba(15,107,95,.28)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-2", morphKey: "!!card-title-27-2", name: "内容卡标题 2", content: "服务内容", x: 658, y: 562, w: 380, h: 32, z: 30, style: {"fontSize":24,"color":"#0f6b5f","fontWeight":860} }),
    text({ id: "card-copy-2", morphKey: "!!card-copy-27-2", name: "内容卡说明 2", content: "清除牛皮癣、环境整理、秩序维护", x: 658, y: 598, w: 382, h: 44, z: 30, style: {"fontSize":19,"color":"#08110d","lineHeight":1.25,"fontWeight":620} }),
    rect({ id: "card-3", morphKey: "!!volunteer-card-3", name: "内容卡 组织方式", x: 154, y: 688, w: 430, h: 108, z: 13, style: {"fill":"rgba(8,17,13,.07)","stroke":"rgba(15,107,95,.28)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-3", morphKey: "!!card-title-27-3", name: "内容卡标题 3", content: "组织方式", x: 178, y: 704, w: 380, h: 32, z: 30, style: {"fontSize":24,"color":"#0f6b5f","fontWeight":860} }),
    text({ id: "card-copy-3", morphKey: "!!card-copy-27-3", name: "内容卡说明 3", content: "三支部分工协同，保障现场效率", x: 178, y: 740, w: 382, h: 44, z: 30, style: {"fontSize":19,"color":"#08110d","lineHeight":1.25,"fontWeight":620} }),
    rect({ id: "card-4", morphKey: "!!volunteer-card-4", name: "内容卡 价值表达", x: 634, y: 688, w: 430, h: 108, z: 13, style: {"fill":"rgba(8,17,13,.07)","stroke":"rgba(15,107,95,.28)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-4", morphKey: "!!card-title-27-4", name: "内容卡标题 4", content: "价值表达", x: 658, y: 704, w: 380, h: 32, z: 30, style: {"fontSize":24,"color":"#0f6b5f","fontWeight":860} }),
    text({ id: "card-copy-4", morphKey: "!!card-copy-27-4", name: "内容卡说明 4", content: "把青年责任从口号变成可见行动", x: 658, y: 740, w: 382, h: 44, z: 30, style: {"fontSize":19,"color":"#08110d","lineHeight":1.25,"fontWeight":620} }),
    image({ id: "photo-1", morphKey: "!!photo-strip-01", name: "照片流 1", asset: asset("photos/volunteer-photo-a.jpg"), alt: "活动照片 1", x: 1210, y: 388, w: 300, h: 188, opacity: 0.94, rotate: -2, z: 16, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.24)"} }),
    image({ id: "photo-2", morphKey: "!!photo-strip-02", name: "照片流 2", asset: asset("photos/volunteer-photo-b.jpg"), alt: "活动照片 2", x: 1452, y: 388, w: 300, h: 188, opacity: 0.94, rotate: 2, z: 17, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.24)"} }),
    image({ id: "photo-3", morphKey: "!!photo-strip-03", name: "照片流 3", asset: asset("photos/volunteer-photo-c.jpg"), alt: "活动照片 3", x: 1286, y: 616, w: 300, h: 188, opacity: 0.94, rotate: 3, z: 18, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.24)"} }),
    image({ id: "photo-4", morphKey: "!!photo-strip-04", name: "照片流 4", asset: asset("photos/volunteer-photo-d.jpg"), alt: "活动照片 4", x: 1528, y: 616, w: 300, h: 188, opacity: 0.94, rotate: -2, z: 19, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.24)"} }),
    rect({ id: "bottom-ribbon", morphKey: "!!bottom-ribbon", name: "底部金线胶囊", x: 320, y: 940, w: 1280, h: 70, z: 14, style: {"fill":"rgba(8,17,13,.86)","stroke":"rgba(216,180,90,.48)","strokeWidth":2,"borderRadius":35} }),
    text({ id: "bottom-ribbon-text", morphKey: "!!bottom-ribbon-text", name: "底部总结", content: "照片流从网站 UI 切换到社区现场，形成线上线下的价值闭环", x: 370, y: 958, w: 1180, h: 36, z: 35, style: {"fontSize":23,"color":"#f7fbff","textAlign":"center","fontWeight":760} }),
    text({ id: "page-index", morphKey: "!!page-index", name: "页码", content: "27 / 30", x: 1580, y: 1000, w: 190, h: 34, z: 35, style: {"fontSize":22,"color":"rgba(8,17,13,.58)","textAlign":"right","fontWeight":750} })
  ]
});

export default slide;
