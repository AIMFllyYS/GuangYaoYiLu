from __future__ import annotations

import html
import math
import os
import shutil
import zipfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
BOOK = ROOT / "总结书流水线"
OUT = ROOT / "交付物" / "答辩PPT" / "答辩PPT"
ASSETS = OUT / "assets"
PREVIEW = OUT / "preview_png"

SLIDE_W = 13.333333
SLIDE_H = 7.5
PX_W = 1920
PX_H = 1080
EMU_PER_IN = 914400

COLORS = {
    "cream": "#F7F1E8",
    "paper": "#FBF8F0",
    "ink": "#243025",
    "muted": "#6C6A5F",
    "gold": "#C4A35A",
    "red": "#C41E3A",
    "green": "#2D5A27",
    "white": "#FFFFFF",
    "warm": "#F5F0EB",
    "brown": "#5A4330",
}

FONTS = {
    "hei": "C:/Windows/Fonts/simhei.ttf",
    "yahei": "C:/Windows/Fonts/msyh.ttc",
    "song": "C:/Windows/Fonts/simsun.ttc",
    "kai": "C:/Windows/Fonts/simkai.ttf",
    "fangsong": "C:/Windows/Fonts/simfang.ttf",
}


@dataclass
class Pic:
    path: Path
    x: float
    y: float
    w: float
    h: float
    crop: bool = True
    radius: int = 0


@dataclass
class TextBox:
    text: str
    x: float
    y: float
    w: float
    h: float
    size: int
    color: str = COLORS["ink"]
    bold: bool = False
    font: str = "yahei"
    align: str = "l"
    valign: str = "top"


@dataclass
class Shape:
    kind: str
    x: float
    y: float
    w: float
    h: float
    fill: str
    line: str | None = None
    radius: float = 0
    opacity: float = 1.0


@dataclass
class Slide:
    title: str
    speaker: str
    bg: str = COLORS["paper"]
    pics: list[Pic] = field(default_factory=list)
    texts: list[TextBox] = field(default_factory=list)
    shapes: list[Shape] = field(default_factory=list)
    footer: str = ""


def px(v: float, axis: str) -> int:
    return round(v / (SLIDE_W if axis == "x" else SLIDE_H) * (PX_W if axis == "x" else PX_H))


def emu(v: float) -> int:
    return round(v * EMU_PER_IN)


def color_tuple(hex_color: str, alpha: int = 255) -> tuple[int, int, int, int]:
    hex_color = hex_color.strip("#")
    return (int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16), alpha)


def font(name: str, size_px: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONTS[name], size_px)


def fit_cover(src: Path, dest: Path, w: int, h: int) -> Path:
    im = Image.open(src).convert("RGB")
    scale = max(w / im.width, h / im.height)
    nw, nh = round(im.width * scale), round(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, (nw - w) // 2)
    top = max(0, (nh - h) // 2)
    im = im.crop((left, top, left + w, top + h))
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, quality=92)
    return dest


def asset(name: str) -> Path:
    if str(name).startswith("Antigravity/"):
        return BOOK / name
    return ROOT / name


def rel_asset(src: Path, key: str, w: int, h: int, crop: bool = True) -> Path:
    ext = ".jpg" if src.suffix.lower() in [".jpg", ".jpeg"] else ".png"
    dest = ASSETS / f"{key}{ext}"
    if crop:
        return fit_cover(src, dest, w, h)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    return dest


def draw_multiline(
    draw: ImageDraw.ImageDraw,
    text: str,
    box: tuple[int, int, int, int],
    fnt: ImageFont.FreeTypeFont,
    fill: str,
    align: str = "left",
    spacing: int = 8,
):
    x1, y1, x2, _ = box
    max_w = x2 - x1
    lines: list[str] = []
    for para in text.split("\n"):
        if not para:
            lines.append("")
            continue
        cur = ""
        for ch in para:
            test = cur + ch
            if draw.textbbox((0, 0), test, font=fnt)[2] <= max_w or not cur:
                cur = test
            else:
                lines.append(cur)
                cur = ch
        if cur:
            lines.append(cur)
    y = y1
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=fnt)
        tw = bbox[2] - bbox[0]
        if align == "center":
            x = x1 + (max_w - tw) // 2
        elif align == "right":
            x = x2 - tw
        else:
            x = x1
        draw.text((x, y), line, font=fnt, fill=color_tuple(fill))
        y += (bbox[3] - bbox[1]) + spacing


def render_slide(slide: Slide, idx: int) -> Path:
    im = Image.new("RGB", (PX_W, PX_H), color_tuple(slide.bg)[:3])
    draw = ImageDraw.Draw(im, "RGBA")

    # subtle paper texture
    for y in range(0, PX_H, 12):
        draw.line([(0, y), (PX_W, y)], fill=(255, 255, 255, 18), width=1)

    for p in slide.pics:
        x, y, w, h = px(p.x, "x"), px(p.y, "y"), px(p.w, "x"), px(p.h, "y")
        src = rel_asset(p.path, f"preview_{idx}_{len(slide.pics)}_{abs(hash(str(p.path))) % 99999}", w, h, p.crop)
        pic = Image.open(src).convert("RGB").resize((w, h), Image.Resampling.LANCZOS)
        shadow = Image.new("RGBA", (w + 24, h + 24), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow)
        sd.rounded_rectangle((12, 12, w + 12, h + 12), radius=p.radius, fill=(0, 0, 0, 80))
        shadow = shadow.filter(ImageFilter.GaussianBlur(10))
        im.paste(shadow.convert("RGB"), (x - 12, y - 12), shadow)
        if p.radius:
            mask = Image.new("L", (w, h), 0)
            md = ImageDraw.Draw(mask)
            md.rounded_rectangle((0, 0, w, h), radius=p.radius, fill=255)
            im.paste(pic, (x, y), mask)
        else:
            im.paste(pic, (x, y))

    for s in slide.shapes:
        box = (px(s.x, "x"), px(s.y, "y"), px(s.x + s.w, "x"), px(s.y + s.h, "y"))
        fill = color_tuple(s.fill, round(255 * s.opacity))
        if s.kind == "ellipse":
            draw.ellipse(box, fill=fill, outline=color_tuple(s.line) if s.line else None, width=3)
        elif s.kind == "line":
            draw.line([(box[0], box[1]), (box[2], box[3])], fill=fill, width=max(2, px(s.h, "y")))
        else:
            radius = max(0, round(s.radius / SLIDE_W * PX_W))
            draw.rounded_rectangle(box, radius=radius, fill=fill, outline=color_tuple(s.line) if s.line else None, width=3)

    for t in slide.texts:
        f = font(t.font, round(t.size * PX_H / 1080))
        box = (px(t.x, "x"), px(t.y, "y"), px(t.x + t.w, "x"), px(t.y + t.h, "y"))
        align = {"l": "left", "ctr": "center", "r": "right"}.get(t.align, "left")
        draw_multiline(draw, t.text, box, f, t.color, align=align, spacing=max(4, round(t.size * 0.24)))

    if slide.footer:
        f = font("yahei", 18)
        draw.text((px(0.52, "x"), px(7.12, "y")), slide.footer, font=f, fill=color_tuple(COLORS["muted"]))
        draw.text((px(12.45, "x"), px(7.12, "y")), f"{idx:02d}/15", font=f, fill=color_tuple(COLORS["muted"]))

    PREVIEW.mkdir(parents=True, exist_ok=True)
    out = PREVIEW / f"slide_{idx:02d}.png"
    im.save(out)
    return out


def tx_body(text: str, size: int, color: str, bold: bool, font_name: str, align: str) -> str:
    paras = text.split("\n")
    p_xml = []
    latin = {
        "hei": "SimHei",
        "yahei": "Microsoft YaHei",
        "song": "SimSun",
        "kai": "KaiTi",
        "fangsong": "FangSong",
    }[font_name]
    for para in paras:
        esc = html.escape(para)
        algn = f' algn="{align}"' if align else ""
        p_xml.append(
            f"""<a:p><a:pPr{algn}/><a:r><a:rPr lang="zh-CN" sz="{size * 100}" dirty="0"{' b="1"' if bold else ''}><a:solidFill><a:srgbClr val="{color.strip('#')}"/></a:solidFill><a:latin typeface="{latin}"/><a:ea typeface="{latin}"/><a:cs typeface="{latin}"/></a:rPr><a:t>{esc}</a:t></a:r></a:p>"""
        )
    return "<p:txBody><a:bodyPr wrap=\"square\" anchor=\"t\"/><a:lstStyle/>" + "".join(p_xml) + "</p:txBody>"


def shape_xml(shape_id: int, t: TextBox | Shape) -> str:
    if isinstance(t, TextBox):
        return f"""
<p:sp>
  <p:nvSpPr><p:cNvPr id="{shape_id}" name="Text {shape_id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
  <p:spPr><a:xfrm><a:off x="{emu(t.x)}" y="{emu(t.y)}"/><a:ext cx="{emu(t.w)}" cy="{emu(t.h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr>
  {tx_body(t.text, t.size, t.color, t.bold, t.font, t.align)}
</p:sp>"""
    prst = "ellipse" if t.kind == "ellipse" else "rect"
    fill_alpha = "" if t.opacity >= 0.999 else f'<a:alpha val="{round(t.opacity * 100000)}"/>'
    line = f'<a:ln w="12700"><a:solidFill><a:srgbClr val="{t.line.strip("#")}"/></a:solidFill></a:ln>' if t.line else '<a:ln><a:noFill/></a:ln>'
    return f"""
<p:sp>
  <p:nvSpPr><p:cNvPr id="{shape_id}" name="Shape {shape_id}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
  <p:spPr><a:xfrm><a:off x="{emu(t.x)}" y="{emu(t.y)}"/><a:ext cx="{emu(t.w)}" cy="{emu(t.h)}"/></a:xfrm><a:prstGeom prst="{prst}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="{t.fill.strip('#')}">{fill_alpha}</a:srgbClr></a:solidFill>{line}</p:spPr>
  <p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody>
</p:sp>"""


def pic_xml(shape_id: int, rid: str, p: Pic) -> str:
    return f"""
<p:pic>
  <p:nvPicPr><p:cNvPr id="{shape_id}" name="Picture {shape_id}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>
  <p:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
  <p:spPr><a:xfrm><a:off x="{emu(p.x)}" y="{emu(p.y)}"/><a:ext cx="{emu(p.w)}" cy="{emu(p.h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
</p:pic>"""


def slide_xml(slide: Slide, idx: int, image_rels: list[tuple[str, Path, Pic]]) -> str:
    elements = []
    sid = 2
    # Background color as a full rectangle.
    elements.append(shape_xml(sid, Shape("rect", 0, 0, SLIDE_W, SLIDE_H, slide.bg)))
    sid += 1
    for rid, _, p in image_rels:
        elements.append(pic_xml(sid, rid, p))
        sid += 1
    for s in slide.shapes:
        elements.append(shape_xml(sid, s))
        sid += 1
    for t in slide.texts:
        elements.append(shape_xml(sid, t))
        sid += 1
    if slide.footer:
        elements.append(shape_xml(sid, TextBox(slide.footer, 0.52, 7.13, 6, 0.22, 10, COLORS["muted"])))
        sid += 1
        elements.append(shape_xml(sid, TextBox(f"{idx:02d}/15", 12.2, 7.13, 0.7, 0.22, 10, COLORS["muted"], align="r")))
    body = "\n".join(elements)
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    {body}
  </p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>"""


def write_pptx(slides: list[Slide], pptx_path: Path):
    tmp = OUT / "_pptx_build"
    if tmp.exists():
        shutil.rmtree(tmp)
    (tmp / "_rels").mkdir(parents=True)
    (tmp / "ppt" / "slides" / "_rels").mkdir(parents=True)
    (tmp / "ppt" / "media").mkdir(parents=True)
    (tmp / "ppt" / "_rels").mkdir(parents=True)
    (tmp / "docProps").mkdir(parents=True)

    media_idx = 1
    slide_ids = []
    for i, sl in enumerate(slides, 1):
        rels = []
        img_rels = []
        for p in sl.pics:
            w, h = px(p.w, "x"), px(p.h, "y")
            prepared = rel_asset(p.path, f"ppt_{i}_{media_idx}", w, h, p.crop)
            ext = prepared.suffix.lower().replace(".", "")
            media_name = f"image{media_idx}.{ext}"
            shutil.copy2(prepared, tmp / "ppt" / "media" / media_name)
            rid = f"rId{len(rels) + 1}"
            rels.append((rid, f"../media/{media_name}", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"))
            img_rels.append((rid, prepared, p))
            media_idx += 1
        (tmp / "ppt" / "slides" / f"slide{i}.xml").write_text(slide_xml(sl, i, img_rels), encoding="utf-8")
        rel_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" + "".join(
            f'<Relationship Id="{rid}" Type="{typ}" Target="{target}"/>' for rid, target, typ in rels
        ) + "</Relationships>"
        (tmp / "ppt" / "slides" / "_rels" / f"slide{i}.xml.rels").write_text(rel_xml, encoding="utf-8")
        slide_ids.append((256 + i, i))

    (tmp / "[Content_Types].xml").write_text(
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">"
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Default Extension="png" ContentType="image/png"/>'
        '<Default Extension="jpg" ContentType="image/jpeg"/>'
        '<Default Extension="jpeg" ContentType="image/jpeg"/>'
        '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>'
        + "".join(f'<Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' for i in range(1, len(slides) + 1))
        + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
        "</Types>",
        encoding="utf-8",
    )
    (tmp / "_rels" / ".rels").write_text(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>',
        encoding="utf-8",
    )
    (tmp / "ppt" / "_rels" / "presentation.xml.rels").write_text(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + "".join(f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>' for i in range(1, len(slides) + 1))
        + "</Relationships>",
        encoding="utf-8",
    )
    (tmp / "ppt" / "presentation.xml").write_text(
        f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>{''.join(f'<p:sldId id="{sid}" r:id="rId{idx}"/>' for sid, idx in slide_ids)}</p:sldIdLst>
  <p:sldSz cx="{emu(SLIDE_W)}" cy="{emu(SLIDE_H)}" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>''',
        encoding="utf-8",
    )
    (tmp / "docProps" / "core.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>光药医路5分钟答辩展示PPT</dc:title><dc:creator>Codex</dc:creator><cp:revision>1</cp:revision></cp:coreProperties>',
        encoding="utf-8",
    )
    (tmp / "docProps" / "app.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Codex</Application><Slides>{len(slides)}</Slides></Properties>',
        encoding="utf-8",
    )
    if pptx_path.exists():
        pptx_path.unlink()
    with zipfile.ZipFile(pptx_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file in tmp.rglob("*"):
            if file.is_file():
                zf.write(file, file.relative_to(tmp).as_posix())
    shutil.rmtree(tmp)


def title(slide: Slide, txt: str, accent: str = COLORS["green"]):
    slide.shapes.append(Shape("rect", 0.52, 0.48, 0.12, 0.62, accent, radius=0.03))
    slide.texts.append(TextBox(txt, 0.76, 0.42, 7.8, 0.62, 28, COLORS["ink"], True, "hei"))


def photo(path: str, x: float, y: float, w: float, h: float, crop: bool = True) -> Pic:
    return Pic(asset(path), x, y, w, h, crop, radius=20)


def build_slides() -> list[Slide]:
    slides: list[Slide] = []

    s = Slide("封面", "各位评委老师好，我们是药学中外2503、光电2506、基础医学强基2501联合团支部。我们的特色团日主题是“金光青黛同济兴，本草杏林华夏清”。接下来，我们将用五分钟汇报这段从三个班走向一个集体的“光药医路”。", COLORS["ink"])
    s.pics.append(Pic(asset("Antigravity/_shared/cover_bg.png"), 0, 0, SLIDE_W, SLIDE_H, True))
    s.shapes.append(Shape("rect", 0, 0, SLIDE_W, SLIDE_H, "#102018", opacity=0.42))
    s.pics.append(Pic(asset("Antigravity/_shared/yaoguang.png"), 9.25, 0.86, 3.0, 5.95, False))
    s.texts += [
        TextBox("光药医路", 0.72, 1.0, 7.8, 1.1, 58, COLORS["white"], True, "hei"),
        TextBox("金光青黛同济兴，本草杏林华夏清", 0.82, 2.2, 7.9, 0.45, 24, "#F7E9B8", False, "kai"),
        TextBox("药学2503 × 光电2506 × 基医2501 联合团支部", 0.86, 6.55, 8.8, 0.36, 18, COLORS["white"], False, "yahei"),
    ]
    slides.append(s)

    s = Slide("评分导向", "本次特色团日评分不仅看活动有没有做，更看主题是否贯穿、内容是否丰富、组织是否有效、形式是否有创新，以及答辩能否讲出支部成长。因此我们的展示不按流水账展开，而围绕这五个关键词呈现。", footer="答辩逻辑")
    title(s, "5分钟，回应评审真正关心的问题", COLORS["red"])
    s.shapes += [
        Shape("ellipse", 0.82, 1.76, 1.8, 1.8, COLORS["green"], opacity=0.94),
        Shape("ellipse", 2.1, 3.26, 1.45, 1.45, COLORS["gold"], opacity=0.95),
        Shape("ellipse", 0.72, 4.3, 1.8, 1.8, COLORS["red"], opacity=0.94),
    ]
    s.texts += [
        TextBox("40%\n活动实效", 1.1, 2.2, 1.25, 0.8, 24, COLORS["white"], True, "hei", "ctr"),
        TextBox("20%\n总结书", 2.33, 3.58, 0.95, 0.65, 19, COLORS["ink"], True, "hei", "ctr"),
        TextBox("40%\n现场答辩", 1.0, 4.74, 1.25, 0.8, 24, COLORS["white"], True, "hei", "ctr"),
        TextBox("我们回应五个关键词", 5.0, 1.45, 5.2, 0.52, 32, COLORS["ink"], True, "hei"),
        TextBox("主题契合  ·  活动覆盖  ·  组织执行\n形式创新  ·  支部成长", 5.05, 2.35, 6.5, 1.35, 32, COLORS["green"], True, "kai"),
        TextBox("不是逐项报流水账，而是用证据说明：\n我们为什么做、怎么组织、做出了什么变化。", 5.08, 4.72, 6.3, 0.9, 22, COLORS["muted"], False, "yahei"),
    ]
    slides.append(s)

    s = Slide("主题释义", "“光药医路”不是简单拼接三个专业名称。“光”代表光电技术与创新视角，“药”代表本草文化与药学传承，“医”代表生命科学与仁心关怀，“路”代表我们75位同学共同走过的实践过程。中医药文化，正好成为三个专业共同对话的交汇点。", footer="主题契合")
    title(s, "“光药医路”：三个专业的共同语言", COLORS["green"])
    chars = [("光", "科技之光"), ("药", "本草传承"), ("医", "生命关怀"), ("路", "75位青年共同走过")]
    for i, (ch, sub) in enumerate(chars):
        x = 0.92 + i * 3.05
        s.shapes.append(Shape("ellipse", x, 2.0, 1.75, 1.75, [COLORS["gold"], COLORS["green"], COLORS["red"], "#8D6E4B"][i], opacity=0.93))
        s.texts.append(TextBox(ch, x + 0.43, 2.23, 0.9, 0.78, 44, COLORS["white"], True, "hei", "ctr"))
        s.texts.append(TextBox(sub, x - 0.1, 4.0, 1.95, 0.55, 20, COLORS["ink"], True, "yahei", "ctr"))
    s.texts.append(TextBox("中医药文化成为药学、光电、基医共同对话的交汇点", 1.55, 5.5, 10.3, 0.55, 28, COLORS["green"], True, "kai", "ctr"))
    slides.append(s)

    s = Slide("三支部总览", "联合支部由三个专业背景差异很大的班级组成。药学支部负责总协调和中药知识支撑，光电支部带来技术和系统设计能力，基医支部提供医学理解和视觉表达。差异不是阻力，反而成为我们活动创新的来源。", footer="组织基础")
    title(s, "75位同行者：差异成为合力", COLORS["green"])
    imgs = [
        ("素材库/08人员与合照/08总结书-药学合照.jpg", "药学2503\n26人 · 总协调"),
        ("素材库/08人员与合照/08总结书-光电合照.jpg", "光电2506\n29人 · 技术支撑"),
        ("素材库/08人员与合照/08总结书-基医合照.png", "基医2501\n20人 · 学术引领"),
    ]
    for i, (img, label) in enumerate(imgs):
        x = 0.72 + i * 4.2
        s.pics.append(photo(img, x, 1.55, 3.72, 3.05))
        s.shapes.append(Shape("rect", x, 4.78, 3.72, 0.78, COLORS["white"], line="#E1D6C1", radius=0.08, opacity=0.94))
        s.texts.append(TextBox(label, x + 0.18, 4.92, 3.36, 0.5, 18, COLORS["ink"], True, "yahei", "ctr"))
    s.texts.append(TextBox("三个专业，三种能力，共同绘就“光药医路”", 2.18, 6.12, 8.9, 0.45, 25, COLORS["green"], True, "kai", "ctr"))
    slides.append(s)

    s = Slide("组织架构", "为了让联合支部真正运转起来，我们没有按班级各做各的，而是设置宣传、财务、实践、策划、后勤五个功能组，跨班混编。每一次活动都形成“策划、物资、执行、宣传、总结”的闭环，这保证了后续多场活动能够持续推进。", footer="组织执行")
    title(s, "跨班混编：让联合支部真正运转", COLORS["red"])
    s.shapes.append(Shape("rect", 4.5, 1.36, 4.35, 0.72, COLORS["green"], radius=0.1))
    s.texts.append(TextBox("联合团支部“光药医路”", 4.72, 1.54, 3.9, 0.38, 20, COLORS["white"], True, "hei", "ctr"))
    for i, name in enumerate(["艾宇杭\n药学", "张子栋\n光电", "高雨佳\n基医"]):
        x = 1.58 + i * 4.16
        s.shapes.append(Shape("rect", x, 2.68, 2.8, 0.78, COLORS["white"], line=COLORS["gold"], radius=0.08))
        s.texts.append(TextBox(name, x + 0.2, 2.84, 2.4, 0.42, 18, COLORS["ink"], True, "yahei", "ctr"))
    groups = ["宣传组", "财务组", "实践组", "策划组", "后勤组"]
    for i, g in enumerate(groups):
        x = 0.78 + i * 2.48
        s.shapes.append(Shape("rect", x, 4.8, 1.78, 0.72, [COLORS["red"], COLORS["gold"], COLORS["green"], "#8D6E4B", "#477A47"][i], radius=0.08))
        s.texts.append(TextBox(g, x + 0.15, 4.98, 1.48, 0.32, 17, COLORS["white"], True, "hei", "ctr"))
    s.texts.append(TextBox("三位团支书统筹 · 五个功能组协作 · 任务到人 · 活动闭环", 1.72, 6.15, 9.8, 0.45, 24, COLORS["ink"], True, "kai", "ctr"))
    slides.append(s)

    s = Slide("三色成长弧", "我们把整个特色团日概括为三色成长弧。初识白，是破冰相识；思政红，是团课学习和志愿服务；药草绿，是围绕中医药文化展开的路演、宣讲、家乡考察和叶开泰参观。三种颜色共同构成支部成长的完整路径。", footer="叙事主线")
    s.pics.append(Pic(asset("Antigravity/_shared/timeline_bg.png"), 0, 0, SLIDE_W, SLIDE_H, True))
    s.shapes.append(Shape("rect", 0, 0, SLIDE_W, SLIDE_H, "#FFF9EF", opacity=0.78))
    title(s, "三色成长弧：从相遇到同行", COLORS["green"])
    segments = [("初识白", "从陌生到相识", COLORS["warm"]), ("思政红", "从学习到担当", COLORS["red"]), ("药草绿", "从兴趣到传承", COLORS["green"])]
    for i, (a, b, c) in enumerate(segments):
        x = 1.1 + i * 4.05
        s.shapes.append(Shape("rect", x, 3.15, 3.1, 0.28, c, radius=0.1))
        s.shapes.append(Shape("ellipse", x + 1.15, 2.48, 0.78, 0.78, c, line=COLORS["white"]))
        s.texts.append(TextBox(a, x + 0.55, 3.72, 2.15, 0.42, 26, COLORS["ink"], True, "hei", "ctr"))
        s.texts.append(TextBox(b, x + 0.35, 4.38, 2.55, 0.32, 18, COLORS["muted"], False, "yahei", "ctr"))
    slides.append(s)

    s = Slide("初识白", "12月7日，我们在韵苑活动中心开展破冰活动。特色团日介绍让大家知道未来要一起做什么，传声筒、数字炸弹、狼人杀和阿瓦隆让同学们真正熟悉起来。那天之后，“联合支部”不再只是通知里的名称，而开始有了真实的温度。", footer="初识白")
    title(s, "初识白 · 破冰之夜", "#BFAE92")
    s.pics += [
        photo("素材库/03破冰活动/图集/03破冰活动-图集-全体合照.jpeg", 0.72, 1.35, 6.0, 3.72),
        photo("素材库/03破冰活动/图集/03破冰活动-图集-桌游互动1.jpeg", 7.05, 1.35, 2.55, 1.72),
        photo("素材库/03破冰活动/图集/03破冰活动-图集-全景听讲.jpeg", 9.88, 1.35, 2.55, 1.72),
        photo("素材库/03破冰活动/图集/03破冰活动-图集-围坐讨论.jpeg", 7.05, 3.35, 5.38, 1.72),
    ]
    s.texts += [
        TextBox("2025.12.7  韵苑活动中心", 0.82, 5.55, 4.2, 0.35, 20, COLORS["brown"], True, "yahei"),
        TextBox("三个班第一次真正坐在一起", 0.82, 6.02, 5.6, 0.42, 25, COLORS["ink"], True, "kai"),
    ]
    slides.append(s)

    s = Slide("思政红团课", "思政红首先体现在共同学习。3月29日，三个支部围绕十五五规划开展团课，从科技创新、民生健康、绿色发展等维度理解青年使命。药学、光电、基医三个专业，也在国家需求的语境中找到了各自的责任位置。", footer="思政红")
    s.bg = "#FFF5F3"
    title(s, "思政红 · 团课铸魂", COLORS["red"])
    s.pics += [
        photo("素材库/06三月活动/3.29主题团会/06三月活动-3.29主题团会-团会PPT讲解1.jpg", 0.78, 1.35, 5.65, 3.25),
        photo("素材库/06三月活动/3.29主题团会/06三月活动-3.29主题团会-团会全景合照.jpg", 0.78, 4.86, 5.65, 1.55),
    ]
    for i, kw in enumerate(["十五五规划", "青年责任", "专业使命"]):
        s.shapes.append(Shape("rect", 7.28, 1.65 + i * 1.35, 3.88, 0.78, COLORS["red"], radius=0.1, opacity=0.92))
        s.texts.append(TextBox(kw, 7.55, 1.86 + i * 1.35, 3.34, 0.32, 24, COLORS["white"], True, "hei", "ctr"))
    s.texts.append(TextBox("锚定十五五蓝图\n以青春之我践时代之责", 7.32, 5.78, 4.4, 0.7, 25, COLORS["ink"], True, "kai", "ctr"))
    slides.append(s)

    s = Slide("思政红志愿", "思政红不只停留在课堂。4月19日，我们来到红建社区，清理违法小广告、扫除巷道落叶、张贴正规通知。大家穿上红马甲，拿起铲子和喷壶，在真实社区场景中理解“服务基层”的含义。", footer="思政红")
    s.bg = "#FFF5F3"
    title(s, "红建社区：把担当写在街巷里", COLORS["red"])
    s.pics += [
        photo("素材库/07四月活动/图片集/志愿服务/07四月活动-图片集-志愿服务-红建社区合影1.jpg", 0.72, 1.25, 5.8, 3.35),
        photo("素材库/07四月活动/图片集/志愿服务/07四月活动-图片集-志愿服务-男生使用铲子清理红砖墙小广告1.jpg", 6.84, 1.25, 2.8, 2.0),
        photo("素材库/07四月活动/图片集/志愿服务/07四月活动-图片集-志愿服务-红建社区清扫巷道落叶的同学1.jpg", 9.9, 1.25, 2.8, 2.0),
        photo("素材库/07四月活动/图片集/志愿服务/07四月活动-图片集-志愿服务-两名同学在社区公告栏张贴通知1.jpg", 6.84, 3.55, 5.86, 1.82),
    ]
    s.shapes.append(Shape("rect", 0.82, 5.72, 11.2, 0.58, COLORS["red"], radius=0.08))
    s.texts.append(TextBox("58人参与 · 约3小时 · 清理巷道、广告、垃圾", 1.08, 5.88, 10.65, 0.28, 21, COLORS["white"], True, "yahei", "ctr"))
    slides.append(s)

    s = Slide("药草绿嘉年华", "嘉年华是我们面向全校的首次集中亮相。我们把中医药知识设计成三个互动游戏：辨认药材、捣药闻香、传统药秤称量。参与者不是被动听科普，而是在观察、触摸、嗅闻和操作中走近中医药文化。", footer="药草绿")
    s.bg = "#F3FAF0"
    title(s, "药草绿 · 风采嘉年华", COLORS["green"])
    s.pics.append(photo("素材库/04嘉年华/图集/04嘉年华-图集-摊位合照.jpg", 0.78, 1.25, 6.2, 4.42))
    for i, item in enumerate(["草色通真：辨药材", "捣药闻香：闻草木", "分两入毫：称分量"]):
        s.shapes.append(Shape("rect", 7.65, 1.6 + i * 1.28, 4.3, 0.78, COLORS["green"], radius=0.1, opacity=0.95))
        s.texts.append(TextBox(item, 7.92, 1.83 + i * 1.28, 3.8, 0.3, 22, COLORS["white"], True, "hei", "ctr"))
    s.pics += [
        photo("素材库/04嘉年华/图集/04嘉年华-图集-捣药钵与茶水.jpg", 7.65, 5.25, 1.9, 1.1),
        photo("素材库/04嘉年华/图集/04嘉年华-图集-中药称量体验.jpg", 9.78, 5.25, 1.9, 1.1),
    ]
    slides.append(s)

    s = Slide("创新亮点", "我们的创新不只是活动内容，也包括传播方式。光电同学参与小程序搭建，让游戏规则、积分排行和中药百科在线化；基医同学主导海报设计，把传统中医药做成年轻人愿意靠近的国潮视觉。技术和设计，让文化传播更轻盈。", footer="形式创新")
    s.bg = "#F3FAF0"
    title(s, "用代码和视觉，让传统文化年轻化", COLORS["green"])
    s.pics += [
        photo("素材库/04嘉年华/04嘉年华-小程序内部.jpg", 0.78, 1.35, 3.08, 4.72),
        photo("素材库/04嘉年华/04嘉年华-小程序码.png", 4.08, 3.88, 1.52, 1.52, False),
        photo("素材库/04嘉年华/04嘉年华-光药医路海报.png", 6.45, 1.28, 5.2, 4.9),
    ]
    s.texts.append(TextBox("小程序、积分、百科、电子奖券", 3.98, 1.72, 2.0, 1.1, 22, COLORS["green"], True, "kai", "ctr"))
    s.texts.append(TextBox("技术 × 文化 × 传播", 4.0, 6.35, 5.2, 0.42, 28, COLORS["ink"], True, "hei", "ctr"))
    slides.append(s)

    s = Slide("冬暖青日", "寒假期间，联合支部把实践从校园延伸到家乡。同学们返乡开展中医药文化宣讲，也结合家乡资源进行考察。我们把75位同学的家乡分布整理成本草地图，让每个省份都对应本地特色中药，呈现出一张属于青年视角的“本草中国”。", footer="药草绿")
    s.bg = "#F3FAF0"
    title(s, "冬暖青日 · 本草寻踪", COLORS["green"])
    s.pics += [
        photo("素材库/05冬暖青日/宣讲/05冬暖青日-宣讲-女生讲PPT.jpg", 0.78, 1.32, 3.1, 2.15),
        photo("素材库/05冬暖青日/宣讲/05冬暖青日-宣讲-男生讲PPT.png", 4.08, 1.32, 3.1, 2.15),
        photo("素材库/05冬暖青日/博物馆/05冬暖青日-博物馆-胡庆余堂留影.jpg", 7.38, 1.32, 2.1, 2.15),
    ]
    # Stylized map substitute using province tags.
    tags = ["湖北17", "河南6", "湖南5", "福建4", "黑龙江4", "浙江3", "广东3", "四川3", "江苏3", "安徽3", "北京3", "山东2", "山西2", "贵州1", "陕西1", "重庆1", "广西1"]
    for i, tag in enumerate(tags):
        x = 0.88 + (i % 5) * 1.78
        y = 4.18 + (i // 5) * 0.55
        s.shapes.append(Shape("rect", x, y, 1.32, 0.34, COLORS["green"] if i < 5 else COLORS["gold"], radius=0.07, opacity=0.9))
        s.texts.append(TextBox(tag, x + 0.08, y + 0.08, 1.12, 0.16, 11, COLORS["white"], True, "yahei", "ctr"))
    s.shapes.append(Shape("rect", 10.0, 4.2, 2.35, 1.28, COLORS["white"], line=COLORS["gold"], radius=0.08, opacity=0.94))
    s.texts.append(TextBox("返乡宣讲\n+\n家乡考察", 10.25, 4.38, 1.85, 0.72, 20, COLORS["brown"], True, "kai", "ctr"))
    s.texts.append(TextBox("75位同学 · 17个省份", 10.18, 5.18, 1.98, 0.24, 17, COLORS["ink"], True, "yahei", "ctr"))
    slides.append(s)

    s = Slide("叶开泰", "4月19日下午，我们走进叶开泰中医药文化园。这里不是单纯参观，而是一次沉浸式体验：看中医药历史展板，闻药材香气，触摸互动桌，走进传统药铺复原场景。嘉年华上被游戏化的中医药，在叶开泰回到了更深厚的历史现场。", footer="药草绿")
    s.bg = "#F3FAF0"
    title(s, "叶开泰寻药记：从课本走进历史", COLORS["green"])
    s.pics += [
        photo("素材库/07四月活动/图片集/叶开泰/合照与活动花絮/07四月活动-图片集-叶开泰-叶开泰中医药文化园横幅大合照1.jpg", 0.72, 1.25, 6.0, 3.55),
        photo("素材库/07四月活动/图片集/叶开泰/展厅内部参观/07四月活动-图片集-叶开泰-展厅内部参观-叶开泰传统中药铺全景复原2.jpg", 7.0, 1.25, 2.7, 1.72),
        photo("素材库/07四月活动/图片集/叶开泰/展厅内部参观/07四月活动-图片集-叶开泰-展厅内部参观-叶开泰植物标本玻璃瓶墙1.jpg", 9.98, 1.25, 2.7, 1.72),
        photo("素材库/07四月活动/图片集/叶开泰/07四月活动-图片集-叶开泰-触摸互动桌体验.png", 7.0, 3.25, 5.68, 1.72),
    ]
    s.texts.append(TextBox("从观看走向体验", 7.18, 5.48, 3.8, 0.46, 28, COLORS["green"], True, "kai", "ctr"))
    slides.append(s)

    s = Slide("成果总结", "回看整个过程，我们的收获可以概括为三点。思想上，团课和志愿让同学们把个人专业放进时代责任中理解；组织上，跨班分工让三个支部真正形成协作共同体；文化上，我们从了解中医药，到用游戏、技术、宣讲和参观主动传播中医药。", footer="成长成效")
    title(s, "三种成长，落在真实行动里", COLORS["gold"])
    cards = [
        ("思想上", "从学习到担当", "素材库/06三月活动/3.29主题团会/06三月活动-3.29主题团会-团会全景合照.jpg", COLORS["red"]),
        ("组织上", "从三班到一体", "素材库/03破冰活动/图集/03破冰活动-图集-大合照2.jpeg", COLORS["gold"]),
        ("文化上", "从了解走向传播", "素材库/04嘉年华/图集/04嘉年华-图集-摊位互动1.jpg", COLORS["green"]),
    ]
    for i, (a, b, img, c) in enumerate(cards):
        x = 0.82 + i * 4.15
        s.pics.append(photo(img, x, 1.35, 3.55, 2.65))
        s.shapes.append(Shape("rect", x, 4.35, 3.55, 1.15, c, radius=0.09, opacity=0.93))
        s.texts.append(TextBox(a, x + 0.25, 4.55, 3.05, 0.32, 23, COLORS["white"], True, "hei", "ctr"))
        s.texts.append(TextBox(b, x + 0.25, 5.02, 3.05, 0.26, 18, COLORS["white"], False, "yahei", "ctr"))
    slides.append(s)

    s = Slide("封底", "最后，我们想用一句话收束这段经历：光可以照亮黑暗，药可以治愈疾病，医可以守护生命，而路，需要一起走。光药医路的意义，不只在完成一次特色团日，更在于让75位来自不同专业的青年，真正成为了一个共同成长的集体。谢谢各位老师。", COLORS["ink"])
    s.pics.append(Pic(asset("Antigravity/_shared/back_cover_bg.png"), 0, 0, SLIDE_W, SLIDE_H, True))
    s.shapes.append(Shape("rect", 0, 0, SLIDE_W, SLIDE_H, "#102018", opacity=0.55))
    s.pics.append(Pic(asset("Antigravity/_shared/yaoguang.png"), 9.75, 1.0, 2.3, 4.7, False))
    s.texts += [
        TextBox("光可以照亮黑暗\n药可以治愈疾病\n医可以守护生命\n而路，需要一起走", 1.05, 1.45, 7.6, 3.4, 42, COLORS["white"], True, "kai"),
        TextBox("光药医路 · 谢谢各位老师", 1.1, 6.32, 6.2, 0.45, 24, "#F7E9B8", False, "yahei"),
    ]
    slides.append(s)

    return slides


def write_script(slides: list[Slide]):
    lines = ["# 光药医路 5分钟答辩展示PPT讲稿", "", "目标时长：4分40秒-4分55秒。", ""]
    for i, s in enumerate(slides, 1):
        lines.append(f"## {i:02d}. {s.title}")
        lines.append("")
        lines.append(s.speaker)
        lines.append("")
    (OUT / "光药医路_5分钟答辩讲稿.md").write_text("\n".join(lines), encoding="utf-8")


def write_pdf(previews: list[Path]):
    images = [Image.open(p).convert("RGB") for p in previews]
    images[0].save(OUT / "光药医路_5分钟答辩展示PPT_预览.pdf", save_all=True, append_images=images[1:], resolution=120)


def write_contact_sheet(previews: list[Path]):
    thumbs = [Image.open(p).convert("RGB").resize((384, 216), Image.Resampling.LANCZOS) for p in previews]
    sheet = Image.new("RGB", (384 * 3, 246 * 5), "white")
    draw = ImageDraw.Draw(sheet)
    label_font = font("yahei", 18)
    for i, thumb in enumerate(thumbs, 1):
        x = ((i - 1) % 3) * 384
        y = ((i - 1) // 3) * 246
        sheet.paste(thumb, (x, y + 24))
        draw.text((x + 8, y + 2), f"{i:02d}", fill=(30, 30, 30), font=label_font)
    sheet.save(OUT / "preview_contact_sheet.png")


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    ASSETS.mkdir()
    PREVIEW.mkdir()
    slides = build_slides()
    previews = [render_slide(s, i) for i, s in enumerate(slides, 1)]
    write_pdf(previews)
    write_contact_sheet(previews)
    write_script(slides)
    write_pptx(slides, OUT / "光药医路_5分钟答辩展示PPT.pptx")
    shutil.rmtree(ASSETS)
    print(f"generated: {OUT}")
    print(f"slides: {len(slides)}")


if __name__ == "__main__":
    main()
