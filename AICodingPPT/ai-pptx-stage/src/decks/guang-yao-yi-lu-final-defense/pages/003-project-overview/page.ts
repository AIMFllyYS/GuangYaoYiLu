import { defineSlide, ellipse, image, line, rect, text } from "../../../../deck/authoring";

const asset = (name: string) => new URL(`../../assets/${name}`, import.meta.url).href;

export const slide = defineSlide({
  id: "003-project-overview",
  title: "?????????????????",
  background: "#07110d",
  transition: {
    type: "morph",
    durationMs: 920,
    easing: "cubic-bezier(.22,1,.36,1)",
    textMorph: "object"
  },
  elements: [
    image({ id: "bg-image", morphKey: "!!section-bg", name: "????", asset: asset("generated/bg-001-cover.jpg"), alt: "????", x: 0, y: 0, w: 1920, h: 1080, opacity: 1, rotate: 0, z: 0, style: {"objectFit":"cover"} }),
    rect({ id: "bg-veil", morphKey: "!!stage-bg", name: "?????", x: 0, y: 0, w: 1920, h: 1080, z: 1, style: {"fill":"linear-gradient(110deg, rgba(3,4,5,.72), rgba(7,17,13,.40), rgba(3,4,5,.82))"} }),
    ellipse({ id: "herbal-ring", morphKey: "!!herbal-ring", name: "????", x: -300, y: -230, w: 860, h: 860, opacity: 0.42, z: 2, style: {"fill":"radial-gradient(circle, transparent 43%, rgba(84,185,106,.24) 44%, rgba(216,180,90,.10) 55%, transparent 66%)","stroke":"rgba(216,180,90,.30)","strokeWidth":5} }),
    line({ id: "gold-path", morphKey: "!!gold-path", name: "????", x: 145, y: 775, w: 1480, h: 0, rotate: 2, opacity: 0.75, z: 4, style: {"stroke":"rgba(216,180,90,.74)","strokeWidth":4} }),
    image({ id: "brand-logo-primary", morphKey: "!!brand-logo-primary", name: "? Logo", asset: asset("brand/logo-dark.jpg"), alt: "? Logo", x: 70, y: 58, w: 78, h: 78, opacity: 1, rotate: 0, z: 22, style: {"objectFit":"contain","borderRadius":16} }),
    image({ id: "brand-logo-secondary", morphKey: "!!brand-logo-secondary", name: "? Logo", asset: asset("brand/logo-secondary.png"), alt: "? Logo", x: 166, y: 56, w: 86, h: 86, opacity: 1, rotate: 0, z: 22, style: {"objectFit":"contain"} }),
    text({ id: "section-label", morphKey: "!!section-label", name: "????", content: `?? / ????`, x: 1500, y: 76, w: 290, h: 36, z: 22, style: {"fontSize":23,"color":"#d8b45a","textAlign":"right","fontWeight":800} }),
    text({ id: "title-shadow", morphKey: "!!deck-title-shadow", name: "?????", content: `?????????????????`, x: 154, y: 156, w: 1300, h: 88, z: 20, style: {"fontFamily":"Noto Serif SC, SimSun, serif","fontSize":48,"fontWeight":900,"color":"rgba(0,0,0,.42)"} }),
    text({ id: "title-main", morphKey: "!!deck-title", name: "???", content: `?????????????????`, x: 146, y: 148, w: 1300, h: 88, z: 23, style: {"fontFamily":"Noto Serif SC, SimSun, serif","fontSize":48,"fontWeight":900,"color":"#f7fbff","shadow":"0 0 30px rgba(216,180,90,.28)"} }),
    text({ id: "title-gold", morphKey: "!!deck-title-gold", name: "?????", content: `?? ? ?? ? ?? ? ?? ? ?? ? ?? ? ??`, x: 150, y: 248, w: 1200, h: 76, z: 24, style: {"fontSize":38,"fontWeight":850,"color":"#d8b45a","fontFamily":"Noto Serif SC, SimSun, serif","lineHeight":1.2} }),
    text({ id: "subtitle", morphKey: "!!stage-copy", name: "?????", content: `??????????????????????????????????????????????`, x: 152, y: 330, w: 1100, h: 86, z: 24, style: {"fontSize":28,"color":"rgba(223,246,229,.84)","lineHeight":1.42,"fontWeight":620} }),
    rect({ id: "main-panel", morphKey: "!!main-panel", name: "?????", x: 112, y: 438, w: 1040, h: 450, z: 8, style: {"fill":"rgba(5,8,7,.72)","stroke":"rgba(216,180,90,.42)","strokeWidth":2,"borderRadius":32,"shadow":"0 22px 60px rgba(0,0,0,.20)"} }),
    image({ id: "icon-1", morphKey: "!!icon-1", name: "????", asset: asset("icons/survey.svg"), alt: "????", x: 160, y: 466, w: 58, h: 58, opacity: 1, rotate: 0, z: 25, style: {"objectFit":"contain","borderRadius":16} }),
    image({ id: "icon-2", morphKey: "!!icon-2", name: "????", asset: asset("icons/policy.svg"), alt: "????", x: 246, y: 466, w: 58, h: 58, opacity: 1, rotate: 0, z: 25, style: {"objectFit":"contain","borderRadius":16} }),
    image({ id: "icon-3", morphKey: "!!icon-3", name: "????", asset: asset("icons/mortar.svg"), alt: "????", x: 332, y: 466, w: 58, h: 58, opacity: 1, rotate: 0, z: 25, style: {"objectFit":"contain","borderRadius":16} }),
    image({ id: "icon-4", morphKey: "!!icon-4", name: "????", asset: asset("icons/museum.svg"), alt: "????", x: 418, y: 466, w: 58, h: 58, opacity: 1, rotate: 0, z: 25, style: {"objectFit":"contain","borderRadius":16} }),
    image({ id: "icon-5", morphKey: "!!icon-5", name: "????", asset: asset("icons/search.svg"), alt: "????", x: 504, y: 466, w: 58, h: 58, opacity: 1, rotate: 0, z: 25, style: {"objectFit":"contain","borderRadius":16} }),
    image({ id: "icon-6", morphKey: "!!icon-6", name: "????", asset: asset("icons/volunteer.svg"), alt: "????", x: 590, y: 466, w: 58, h: 58, opacity: 1, rotate: 0, z: 25, style: {"objectFit":"contain","borderRadius":16} }),
    rect({ id: "card-1", morphKey: "!!project-card-1", name: "??? ????", x: 154, y: 560, w: 430, h: 96, z: 12, style: {"fill":"rgba(244,239,226,.08)","stroke":"rgba(216,180,90,.42)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-1", morphKey: "!!card-title-3-1", name: "?????", content: `????`, x: 178, y: 576, w: 380, h: 30, z: 26, style: {"fontSize":24,"color":"#d8b45a","fontWeight":820} }),
    text({ id: "card-copy-1", morphKey: "!!card-copy-3-1", name: "?????", content: `????????`, x: 178, y: 610, w: 380, h: 32, z: 26, style: {"fontSize":21,"color":"#f7fbff","lineHeight":1.25,"fontWeight":620} }),
    rect({ id: "card-2", morphKey: "!!project-card-2", name: "??? ????", x: 634, y: 560, w: 430, h: 96, z: 12, style: {"fill":"rgba(244,239,226,.08)","stroke":"rgba(216,180,90,.42)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-2", morphKey: "!!card-title-3-2", name: "?????", content: `????`, x: 658, y: 576, w: 380, h: 30, z: 26, style: {"fontSize":24,"color":"#d8b45a","fontWeight":820} }),
    text({ id: "card-copy-2", morphKey: "!!card-copy-3-2", name: "?????", content: `???????`, x: 658, y: 610, w: 380, h: 32, z: 26, style: {"fontSize":21,"color":"#f7fbff","lineHeight":1.25,"fontWeight":620} }),
    rect({ id: "card-3", morphKey: "!!project-card-3", name: "??? ????", x: 154, y: 688, w: 430, h: 96, z: 12, style: {"fill":"rgba(244,239,226,.08)","stroke":"rgba(216,180,90,.42)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-3", morphKey: "!!card-title-3-3", name: "?????", content: `????`, x: 178, y: 704, w: 380, h: 30, z: 26, style: {"fontSize":24,"color":"#d8b45a","fontWeight":820} }),
    text({ id: "card-copy-3", morphKey: "!!card-copy-3-3", name: "?????", content: `????????`, x: 178, y: 738, w: 380, h: 32, z: 26, style: {"fontSize":21,"color":"#f7fbff","lineHeight":1.25,"fontWeight":620} }),
    rect({ id: "card-4", morphKey: "!!project-card-4", name: "??? ????", x: 634, y: 688, w: 430, h: 96, z: 12, style: {"fill":"rgba(244,239,226,.08)","stroke":"rgba(216,180,90,.42)","strokeWidth":2,"borderRadius":24} }),
    text({ id: "card-title-4", morphKey: "!!card-title-3-4", name: "?????", content: `????`, x: 658, y: 704, w: 380, h: 30, z: 26, style: {"fontSize":24,"color":"#d8b45a","fontWeight":820} }),
    text({ id: "card-copy-4", morphKey: "!!card-copy-3-4", name: "?????", content: `????????`, x: 658, y: 738, w: 380, h: 32, z: 26, style: {"fontSize":21,"color":"#f7fbff","lineHeight":1.25,"fontWeight":620} }),
    image({ id: "photo-1", morphKey: "!!photo-strip-01", name: "???", asset: asset("photos/cover-photo-b.jpg"), alt: "???", x: 1210, y: 392, w: 300, h: 190, opacity: 0.92, rotate: -2, z: 16, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.22)"} }),
    image({ id: "photo-2", morphKey: "!!photo-strip-02", name: "???", asset: asset("photos/carnival-photo-c.jpg"), alt: "???", x: 1450, y: 392, w: 300, h: 190, opacity: 0.92, rotate: 2, z: 16, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.22)"} }),
    image({ id: "photo-3", morphKey: "!!photo-strip-03", name: "???", asset: asset("photos/volunteer-photo-d.jpg"), alt: "???", x: 1328, y: 620, w: 300, h: 190, opacity: 0.92, rotate: -2, z: 16, style: {"objectFit":"cover","borderRadius":26,"shadow":"0 20px 50px rgba(0,0,0,.22)"} }),
    rect({ id: "bottom-ribbon", morphKey: "!!bottom-ribbon", name: "?????", x: 320, y: 940, w: 1280, h: 70, z: 14, style: {"fill":"rgba(15,107,95,.92)","stroke":"rgba(216,180,90,.48)","strokeWidth":2,"borderRadius":35} }),
    text({ id: "bottom-ribbon-text", morphKey: "!!bottom-ribbon-text", name: "??????", content: `???????????????????`, x: 370, y: 958, w: 1180, h: 36, z: 27, style: {"fontSize":24,"color":"#f7fbff","textAlign":"center","fontWeight":760} }),
    text({ id: "page-index", morphKey: "!!page-index", name: "??", content: `03 / 30`, x: 1580, y: 1000, w: 190, h: 34, z: 27, style: {"fontSize":22,"color":"rgba(223,246,229,.72)","textAlign":"right","fontWeight":750} })
  ]
});

export default slide;
