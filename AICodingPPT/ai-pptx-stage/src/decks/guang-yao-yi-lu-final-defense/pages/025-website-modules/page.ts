import { defineSlide, ellipse, image, line, rect, text } from "../../../../deck/authoring";


export const slide = defineSlide({
  id: "025-website-modules",
  title: "功能矩阵：搜索、知识、问答、研究成果四线并行",
  background: "#07110d",
  transition: {
    type: "morph",
    durationMs: 920,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    image({ id: "bg-image", morphKey: "!!section-bg", name: "章节背景", asset: new URL("../../assets/generated/bg-024-website.jpg", import.meta.url).href, alt: "无文字生成背景", x: 0, y: 0, w: 1920, h: 1080, opacity: 1, rotate: 0, z: 0, style: {"objectFit":"cover"} }),
    rect({ id: "bg-veil", morphKey: "!!stage-bg", name: "背景遮罩", x: 0, y: 0, w: 1920, h: 1080, z: 1, style: {"fill":"linear-gradient(110deg, rgba(3,11,8,.82), rgba(7,37,31,.62), rgba(3,11,8,.90))"} }),
    rect({ id: "grain-layer", morphKey: "!!paper-grain", name: "宣纸暗纹", x: -80, y: -60, w: 2080, h: 1200, opacity: 0.32, z: 2, style: {"fill":"radial-gradient(circle at 20% 30%, rgba(216,180,90,.20), transparent 24%), radial-gradient(circle at 80% 72%, rgba(84,185,106,.18), transparent 28%)"} }),
    ellipse({ id: "herbal-ring", morphKey: "!!herbal-ring", name: "草本光环", x: 1130, y: 520, w: 860, h: 860, opacity: 0.42, z: 3, style: {"fill":"radial-gradient(circle, transparent 43%, rgba(84,185,106,.24) 44%, rgba(216,180,90,.10) 55%, transparent 66%)","stroke":"rgba(216,180,90,.30)","strokeWidth":5} }),
    ellipse({ id: "herbal-ring-inner", morphKey: "!!herbal-ring-inner", name: "内层药金环", x: 1350, y: 230, w: 420, h: 420, opacity: 0.36, z: 4, style: {"fill":"transparent","stroke":"rgba(216,180,90,.42)","strokeWidth":3} }),
    line({ id: "gold-path", morphKey: "!!gold-path", name: "药金路径", x: 180, y: 825, w: 1480, h: 0, rotate: -7, opacity: 0.74, z: 5, style: {"stroke":"rgba(216,180,90,.74)","strokeWidth":4} }),
    image({ id: "brand-logo-primary", morphKey: "!!brand-logo-primary", name: "主 Logo", asset: new URL("../../assets/brand/logo-dark.jpg", import.meta.url).href, alt: "主 Logo", x: 70, y: 58, w: 78, h: 78, opacity: 1, rotate: 0, z: 25, style: {"objectFit":"contain","borderRadius":16} }),
    image({ id: "brand-logo-secondary", morphKey: "!!brand-logo-secondary", name: "副 Logo", asset: new URL("../../assets/brand/logo-secondary.png", import.meta.url).href, alt: "副 Logo", x: 166, y: 56, w: 86, h: 86, opacity: 1, rotate: 0, z: 25, style: {"objectFit":"contain"} }),
    text({ id: "section-label", morphKey: "!!section-label", name: "章节标签", content: "网站 / 功能矩阵", x: 1410, y: 76, w: 380, h: 36, z: 26, style: {"fontSize":23,"color":"#dff6e5","textAlign":"right","fontWeight":800} }),
    text({ id: "title-shadow", morphKey: "!!deck-title-shadow", name: "标题暗影层", content: "功能矩阵：搜索、知识、问答、研究成果四线并行", x: 154, y: 154, w: 1280, h: 92, z: 18, style: {"fontFamily":"Noto Serif SC, SimSun, serif","fontSize":47,"fontWeight":900,"color":"rgba(0,0,0,.70)"} }),
    text({ id: "title-main", morphKey: "!!deck-title", name: "主标题", content: "功能矩阵：搜索、知识、问答、研究成果四线并行", x: 146, y: 146, w: 1280, h: 92, z: 27, style: {"fontFamily":"Noto Serif SC, SimSun, serif","fontSize":47,"fontWeight":900,"color":"#f7fbff","shadow":"0 0 30px rgba(216,180,90,.28)","lineHeight":1.1} }),
    text({ id: "title-gold", morphKey: "!!deck-title-gold", name: "药金艺术字", content: "网站功能对应调研中的四类需求：基础、兴趣、互动、专业", x: 150, y: 248, w: 1260, h: 78, z: 28, style: {"fontFamily":"Noto Serif SC, SimSun, serif","fontSize":34,"fontWeight":850,"color":"#d8b45a","lineHeight":1.2} }),
    text({ id: "subtitle", morphKey: "!!stage-copy", name: "页内说明", content: "页面用模块卡片展示网站建设方向：中药功能查询、趣味知识介绍、趣味问答小游戏、最新研究成果。", x: 152, y: 326, w: 1080, h: 94, z: 28, style: {"fontSize":26,"color":"rgba(247,251,255,.78)","lineHeight":1.42,"fontWeight":620} }),
    rect({ id: "main-panel", morphKey: "!!main-panel", name: "主内容玻璃面板", x: 112, y: 438, w: 1040, h: 450, z: 8, style: {"fill":"rgba(6,18,14,.72)","stroke":"rgba(216,180,90,.34)","strokeWidth":2,"borderRadius":32,"shadow":"0 22px 60px rgba(0,0,0,.20)"} }),
    rect({ id: "kicker-chip", morphKey: "!!kicker-chip", name: "页眉胶囊", x: 152, y: 454, w: 620, h: 52, z: 20, style: {"fill":"rgba(216,180,90,.16)","stroke":"rgba(216,180,90,.46)","strokeWidth":2,"borderRadius":26} }),
    text({ id: "kicker-text", morphKey: "!!kicker-text", name: "页眉关键词", content: "从“想了解”到“查得到、玩得动、看得深”", x: 178, y: 466, w: 570, h: 30, z: 29, style: {"fontSize":22,"color":"#dff6e5","fontWeight":850} }),
    image({ id: "icon-1", morphKey: "!!icon-1", name: "主题图标 1", asset: new URL("../../assets/icons/search.svg", import.meta.url).href, alt: "search", x: 820, y: 454, w: 56, h: 56, opacity: 1, rotate: 0, z: 28, style: {"objectFit":"contain","borderRadius":14} }),
    image({ id: "icon-2", morphKey: "!!icon-2", name: "主题图标 2", asset: new URL("../../assets/icons/leaf.svg", import.meta.url).href, alt: "leaf", x: 896, y: 454, w: 56, h: 56, opacity: 1, rotate: 0, z: 28, style: {"objectFit":"contain","borderRadius":14} }),
    image({ id: "icon-3", morphKey: "!!icon-3", name: "主题图标 3", asset: new URL("../../assets/icons/qa.svg", import.meta.url).href, alt: "qa", x: 972, y: 454, w: 56, h: 56, opacity: 1, rotate: 0, z: 28, style: {"objectFit":"contain","borderRadius":14} }),
    image({ id: "icon-4", morphKey: "!!icon-4", name: "主题图标 4", asset: new URL("../../assets/icons/research.svg", import.meta.url).href, alt: "research", x: 1048, y: 454, w: 56, h: 56, opacity: 1, rotate: 0, z: 28, style: {"objectFit":"contain","borderRadius":14} }),
    rect({ id: "card-1", morphKey: "!!website-module-1", name: "内容卡 功能查询", x: 154, y: 546, w: 430, h: 108, z: 13, style: {"fill":"rgba(247,251,255,.08)","stroke":"rgba(216,180,90,.34)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-1", morphKey: "!!card-title-25-1", name: "内容卡标题 1", content: "功能查询", x: 178, y: 562, w: 380, h: 32, z: 30, style: {"fontSize":24,"color":"#d8b45a","fontWeight":860} }),
    text({ id: "card-copy-1", morphKey: "!!card-copy-25-1", name: "内容卡说明 1", content: "输入药材名称，查看基础功效与生活提示", x: 178, y: 598, w: 382, h: 44, z: 30, style: {"fontSize":19,"color":"#f7fbff","lineHeight":1.25,"fontWeight":620} }),
    rect({ id: "card-2", morphKey: "!!website-module-2", name: "内容卡 趣味知识", x: 634, y: 546, w: 430, h: 108, z: 13, style: {"fill":"rgba(247,251,255,.08)","stroke":"rgba(216,180,90,.34)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-2", morphKey: "!!card-title-25-2", name: "内容卡标题 2", content: "趣味知识", x: 658, y: 562, w: 380, h: 32, z: 30, style: {"fontSize":24,"color":"#d8b45a","fontWeight":860} }),
    text({ id: "card-copy-2", morphKey: "!!card-copy-25-2", name: "内容卡说明 2", content: "用短卡片呈现药材故事和使用场景", x: 658, y: 598, w: 382, h: 44, z: 30, style: {"fontSize":19,"color":"#f7fbff","lineHeight":1.25,"fontWeight":620} }),
    rect({ id: "card-3", morphKey: "!!website-module-3", name: "内容卡 问答游戏", x: 154, y: 688, w: 430, h: 108, z: 13, style: {"fill":"rgba(247,251,255,.08)","stroke":"rgba(216,180,90,.34)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-3", morphKey: "!!card-title-25-3", name: "内容卡标题 3", content: "问答游戏", x: 178, y: 704, w: 380, h: 32, z: 30, style: {"fontSize":24,"color":"#d8b45a","fontWeight":860} }),
    text({ id: "card-copy-3", morphKey: "!!card-copy-25-3", name: "内容卡说明 3", content: "把认药、闻药经验转成线上互动", x: 178, y: 740, w: 382, h: 44, z: 30, style: {"fontSize":19,"color":"#f7fbff","lineHeight":1.25,"fontWeight":620} }),
    rect({ id: "card-4", morphKey: "!!website-module-4", name: "内容卡 研究成果", x: 634, y: 688, w: 430, h: 108, z: 13, style: {"fill":"rgba(247,251,255,.08)","stroke":"rgba(216,180,90,.34)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-4", morphKey: "!!card-title-25-4", name: "内容卡标题 4", content: "研究成果", x: 658, y: 704, w: 380, h: 32, z: 30, style: {"fontSize":24,"color":"#d8b45a","fontWeight":860} }),
    text({ id: "card-copy-4", morphKey: "!!card-copy-25-4", name: "内容卡说明 4", content: "展示中医药现代化与青年关注话题", x: 658, y: 740, w: 382, h: 44, z: 30, style: {"fontSize":19,"color":"#f7fbff","lineHeight":1.25,"fontWeight":620} }),
    image({ id: "photo-1", morphKey: "!!photo-strip-01", name: "照片流 1", asset: new URL("../../assets/photos/mini-program.jpg", import.meta.url).href, alt: "活动照片 1", x: 1210, y: 388, w: 300, h: 188, opacity: 0.94, rotate: -2, z: 16, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.24)"} }),
    image({ id: "photo-2", morphKey: "!!photo-strip-02", name: "照片流 2", asset: new URL("../../assets/photos/yaoguang-1.jpg", import.meta.url).href, alt: "活动照片 2", x: 1452, y: 388, w: 300, h: 188, opacity: 0.94, rotate: 2, z: 17, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.24)"} }),
    image({ id: "photo-3", morphKey: "!!photo-strip-03", name: "照片流 3", asset: new URL("../../assets/photos/museum-photo-c.jpg", import.meta.url).href, alt: "活动照片 3", x: 1286, y: 616, w: 300, h: 188, opacity: 0.94, rotate: 3, z: 18, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.24)"} }),
    image({ id: "photo-4", morphKey: "!!photo-strip-04", name: "照片流 4", asset: new URL("../../assets/photos/carnival-photo-a.jpg", import.meta.url).href, alt: "活动照片 4", x: 1528, y: 616, w: 300, h: 188, opacity: 0.94, rotate: -2, z: 19, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.24)"} }),
    rect({ id: "search-bar", morphKey: "!!website-search-bar", name: "网站搜索栏", x: 1210, y: 828, w: 560, h: 70, z: 29, style: {"fill":"rgba(247,251,255,.92)","stroke":"rgba(216,180,90,.54)","strokeWidth":2,"borderRadius":35} }),
    text({ id: "search-text", morphKey: "!!website-search-text", name: "搜索栏文字", content: "搜索：陈皮 / 枸杞 / 香囊 / 药膳", x: 1260, y: 846, w: 460, h: 34, z: 32, style: {"fontSize":23,"color":"#0f6b5f","fontWeight":760} }),
    rect({ id: "bottom-ribbon", morphKey: "!!bottom-ribbon", name: "底部金线胶囊", x: 320, y: 940, w: 1280, h: 70, z: 14, style: {"fill":"rgba(247,251,255,.12)","stroke":"rgba(216,180,90,.48)","strokeWidth":2,"borderRadius":35} }),
    text({ id: "bottom-ribbon-text", morphKey: "!!bottom-ribbon-text", name: "底部总结", content: "所有网站 UI 都用 PPTX-compatible 图层模拟，便于后续在 PowerPoint 调整", x: 370, y: 958, w: 1180, h: 36, z: 35, style: {"fontSize":23,"color":"#f7fbff","textAlign":"center","fontWeight":760} }),
    text({ id: "page-index", morphKey: "!!page-index", name: "页码", content: "25 / 30", x: 1580, y: 1000, w: 190, h: 34, z: 35, style: {"fontSize":22,"color":"rgba(247,251,255,.58)","textAlign":"right","fontWeight":750} })
  ]
});

export default slide;
