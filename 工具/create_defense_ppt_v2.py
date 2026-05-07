from __future__ import annotations

import shutil
import zipfile
from pathlib import Path

import create_defense_ppt as base
from create_defense_ppt import Pic, Shape, Slide, TextBox
from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "答辩PPT_v2"
ASSETS = OUT / "assets"
PREVIEW = OUT / "preview_png"
BG_DIR = OUT / "generated_backgrounds"

SLIDE_W = base.SLIDE_W
SLIDE_H = base.SLIDE_H
COLORS = base.COLORS

PPTX_NAME = "光药医路_5分钟动画答辩PPT.pptx"
SCRIPT_NAME = "光药医路_5分钟动画答辩讲稿.md"
PDF_NAME = "光药医路_5分钟动画答辩PPT_静态预览.pdf"


BACKGROUND_FILES = [
    "bg_01_cover.png",
    "bg_02_scoring.png",
    "bg_03_theme.png",
    "bg_04_branches.png",
    "bg_05_org.png",
    "bg_06_timeline.png",
    "bg_07_icebreaker.png",
    "bg_08_red_class.png",
    "bg_09_volunteer.png",
    "bg_10_carnival.png",
    "bg_11_innovation.png",
    "bg_12_hometown.png",
    "bg_13_yekaitai.png",
    "bg_14_results.png",
    "bg_15_back.png",
]


def normalize_backgrounds() -> None:
    for name in BACKGROUND_FILES:
        path = BG_DIR / name
        if not path.exists():
            raise FileNotFoundError(f"missing generated background: {path}")
        with Image.open(path) as image:
            if image.size == (1920, 1080):
                continue
            normalized = ImageOps.fit(image.convert("RGB"), (1920, 1080), Image.Resampling.LANCZOS, centering=(0.5, 0.5))
            normalized.save(path)


def configure_base_paths() -> None:
    base.OUT = OUT
    base.ASSETS = ASSETS
    base.PREVIEW = PREVIEW


def is_full_slide_picture(pic: Pic) -> bool:
    return (
        abs(pic.x) < 0.01
        and abs(pic.y) < 0.01
        and abs(pic.w - SLIDE_W) < 0.01
        and abs(pic.h - SLIDE_H) < 0.01
    )


def build_slides() -> list[Slide]:
    configure_base_paths()
    slides = base.build_slides()
    for idx, slide in enumerate(slides, 1):
        bg = BG_DIR / BACKGROUND_FILES[idx - 1]
        if not bg.exists():
            raise FileNotFoundError(f"missing generated background: {bg}")
        real_pics = [pic for pic in slide.pics if not is_full_slide_picture(pic)]
        slide.pics = [Pic(bg, 0, 0, SLIDE_W, SLIDE_H, True)] + real_pics
        slide.bg = COLORS["paper"]
        if idx == 11:
            slide.shapes.append(Shape("rect", 3.92, 1.36, 2.05, 0.72, COLORS["paper"], radius=0.06, opacity=0.86))
    return slides


def timing_xml(shape_ids: list[int]) -> str:
    if not shape_ids:
        return ""
    effects: list[str] = []
    tn = 10
    for order, spid in enumerate(shape_ids[:4]):
        delay = order * 220
        effects.append(
            f"""
          <p:par>
            <p:cTn id="{tn}" fill="hold">
              <p:stCondLst><p:cond delay="{delay}"/></p:stCondLst>
              <p:childTnLst>
                <p:animEffect transition="in" filter="fade">
                  <p:cBhvr>
                    <p:cTn id="{tn + 1}" dur="520" fill="hold"/>
                    <p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>
                  </p:cBhvr>
                </p:animEffect>
              </p:childTnLst>
            </p:cTn>
          </p:par>"""
        )
        tn += 2
    return f"""
  <p:timing>
    <p:tnLst>
      <p:par>
        <p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot">
          <p:childTnLst>
            <p:seq concurrent="1" nextAc="seek">
              <p:cTn id="2" dur="indefinite" nodeType="mainSeq">
                <p:childTnLst>
                  {''.join(effects)}
                </p:childTnLst>
              </p:cTn>
            </p:seq>
          </p:childTnLst>
        </p:cTn>
      </p:par>
    </p:tnLst>
  </p:timing>"""


def slide_xml(slide: Slide, idx: int, image_rels: list[tuple[str, Path, Pic]]) -> str:
    elements: list[str] = []
    animate_pics: list[int] = []
    animate_texts: list[int] = []
    sid = 2

    elements.append(base.shape_xml(sid, Shape("rect", 0, 0, SLIDE_W, SLIDE_H, slide.bg)))
    sid += 1

    for image_index, (rid, _, pic) in enumerate(image_rels):
        elements.append(base.pic_xml(sid, rid, pic))
        if image_index > 0:
            animate_pics.append(sid)
        sid += 1

    for shape in slide.shapes:
        elements.append(base.shape_xml(sid, shape))
        sid += 1

    for text in slide.texts:
        elements.append(base.shape_xml(sid, text))
        animate_texts.append(sid)
        sid += 1

    if slide.footer:
        elements.append(base.shape_xml(sid, TextBox(slide.footer, 0.52, 7.13, 6, 0.22, 10, COLORS["muted"])))
        sid += 1
        elements.append(base.shape_xml(sid, TextBox(f"{idx:02d}/15", 12.2, 7.13, 0.7, 0.22, 10, COLORS["muted"], align="r")))
        sid += 1

    # Keep the complete narration inside the PPTX as native editable text, but
    # outside the visible canvas so it does not crowd the live defense slide.
    note_text = f"讲稿（可编辑，画布外）\n{slide.speaker}"
    elements.append(base.shape_xml(sid, TextBox(note_text, 13.72, 0.36, 5.75, 6.7, 12, COLORS["muted"], False, "yahei")))

    targets = []
    if animate_texts:
        targets.append(animate_texts[0])
    targets.extend(animate_pics[:2])
    if len(animate_texts) > 1:
        targets.append(animate_texts[1])

    body = "\n".join(elements)
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    {body}
  </p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
  <p:transition spd="med"><p:fade/></p:transition>
  {timing_xml(targets)}
</p:sld>"""


def write_pptx(slides: list[Slide], pptx_path: Path) -> None:
    configure_base_paths()
    tmp = OUT / "_pptx_build"
    if tmp.exists():
        shutil.rmtree(tmp)
    (tmp / "_rels").mkdir(parents=True)
    (tmp / "ppt" / "slides" / "_rels").mkdir(parents=True)
    (tmp / "ppt" / "media").mkdir(parents=True)
    (tmp / "ppt" / "_rels").mkdir(parents=True)
    (tmp / "docProps").mkdir(parents=True)

    media_idx = 1
    slide_ids: list[tuple[int, int]] = []
    for i, sl in enumerate(slides, 1):
        rels: list[tuple[str, str, str]] = []
        img_rels: list[tuple[str, Path, Pic]] = []
        for pic in sl.pics:
            w, h = base.px(pic.w, "x"), base.px(pic.h, "y")
            prepared = base.rel_asset(pic.path, f"ppt_v2_{i}_{media_idx}", w, h, pic.crop)
            ext = prepared.suffix.lower().replace(".", "")
            media_name = f"image{media_idx}.{ext}"
            shutil.copy2(prepared, tmp / "ppt" / "media" / media_name)
            rid = f"rId{len(rels) + 1}"
            rels.append((rid, f"../media/{media_name}", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"))
            img_rels.append((rid, prepared, pic))
            media_idx += 1

        (tmp / "ppt" / "slides" / f"slide{i}.xml").write_text(slide_xml(sl, i, img_rels), encoding="utf-8")
        rel_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" + "".join(
            f'<Relationship Id="{rid}" Type="{typ}" Target="{target}"/>' for rid, target, typ in rels
        ) + "</Relationships>"
        (tmp / "ppt" / "slides" / "_rels" / f"slide{i}.xml.rels").write_text(rel_xml, encoding="utf-8")
        slide_ids.append((256 + i, i))

    content_types = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">"
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Default Extension="png" ContentType="image/png"/>'
        '<Default Extension="jpg" ContentType="image/jpeg"/>'
        '<Default Extension="jpeg" ContentType="image/jpeg"/>'
        '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>'
        + "".join(
            f'<Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'
            for i in range(1, len(slides) + 1)
        )
        + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
        "</Types>"
    )
    (tmp / "[Content_Types].xml").write_text(content_types, encoding="utf-8")
    (tmp / "_rels" / ".rels").write_text(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>',
        encoding="utf-8",
    )
    (tmp / "ppt" / "_rels" / "presentation.xml.rels").write_text(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + "".join(
            f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>'
            for i in range(1, len(slides) + 1)
        )
        + "</Relationships>",
        encoding="utf-8",
    )
    (tmp / "ppt" / "presentation.xml").write_text(
        f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>{''.join(f'<p:sldId id="{sid}" r:id="rId{idx}"/>' for sid, idx in slide_ids)}</p:sldIdLst>
  <p:sldSz cx="{base.emu(SLIDE_W)}" cy="{base.emu(SLIDE_H)}" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>''',
        encoding="utf-8",
    )
    (tmp / "docProps" / "core.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>光药医路5分钟动画答辩PPT</dc:title><dc:creator>Codex</dc:creator><cp:revision>2</cp:revision></cp:coreProperties>',
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


def write_script(slides: list[Slide]) -> None:
    lines = [
        "# 光药医路 5分钟动画答辩PPT讲稿",
        "",
        "目标时长：4分40秒-4分55秒。PPTX 每页另含画布外可编辑讲稿文本框，正式播放时不可见。",
        "",
    ]
    for i, slide in enumerate(slides, 1):
        lines.append(f"## {i:02d}. {slide.title}")
        lines.append("")
        lines.append(slide.speaker)
        lines.append("")
    (OUT / SCRIPT_NAME).write_text("\n".join(lines), encoding="utf-8")


def write_pdf(previews: list[Path]) -> None:
    images = [Image.open(p).convert("RGB") for p in previews]
    images[0].save(OUT / PDF_NAME, save_all=True, append_images=images[1:], resolution=120)


def write_contact_sheet(previews: list[Path]) -> None:
    thumbs = [Image.open(p).convert("RGB").resize((384, 216), Image.Resampling.LANCZOS) for p in previews]
    sheet = Image.new("RGB", (384 * 3, 246 * 5), "white")
    draw = ImageDraw.Draw(sheet)
    label_font = base.font("yahei", 18)
    for i, thumb in enumerate(thumbs, 1):
        x = ((i - 1) % 3) * 384
        y = ((i - 1) // 3) * 246
        sheet.paste(thumb, (x, y + 24))
        draw.text((x + 8, y + 2), f"{i:02d}", fill=(30, 30, 30), font=label_font)
    sheet.save(OUT / "preview_contact_sheet.png")


def main() -> None:
    configure_base_paths()
    normalize_backgrounds()
    for folder in [ASSETS, PREVIEW]:
        if folder.exists():
            shutil.rmtree(folder)
        folder.mkdir(parents=True)

    slides = build_slides()
    previews = [base.render_slide(slide, i) for i, slide in enumerate(slides, 1)]
    write_pdf(previews)
    write_contact_sheet(previews)
    write_script(slides)
    write_pptx(slides, OUT / PPTX_NAME)
    shutil.rmtree(ASSETS)
    print(f"generated: {OUT}")
    print(f"slides: {len(slides)}")
    print(f"pptx: {OUT / PPTX_NAME}")


if __name__ == "__main__":
    main()
