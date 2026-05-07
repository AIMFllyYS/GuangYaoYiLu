from __future__ import annotations

import hashlib
import html
import json
import shutil
import zipfile
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "答辩PPT_v3"
FULL = OUT / "full_ai_slides"
LAYERS = OUT / "layers"
PREVIEW = OUT / "preview_png"
SOURCE = OUT / "source_assets"

PX_W = 1920
PX_H = 1080
SLIDE_CX = 12192000
SLIDE_CY = 6858000

PPTX_NAME = "光药医路_5分钟纯图分层答辩PPT.pptx"
PDF_NAME = "光药医路_5分钟纯图分层答辩PPT_静态预览.pdf"
SCRIPT_NAME = "光药医路_5分钟答辩讲稿.md"

FONTS = {
    "yahei": "C:/Windows/Fonts/msyh.ttc",
    "hei": "C:/Windows/Fonts/simhei.ttf",
}


@dataclass(frozen=True)
class Layer:
    name: str
    path: str
    x: int
    y: int
    w: int
    h: int
    role: str
    animate_group: int = 0


@dataclass(frozen=True)
class Photo:
    path: str
    x: int
    y: int
    w: int
    h: int
    radius: int = 28


SLIDE_TEXT = [
    {
        "title": "光药医路",
        "visible_text": [
            "光药医路",
            "金光青黛同济兴，本草杏林华夏清",
            "药学2503 × 光电2506 × 基医2501 联合团支部",
            "01/15",
        ],
        "speaker": "各位评委老师好，我们是药学中外2503、光电2506、基础医学强基2501联合团支部。我们的特色团日主题是“金光青黛同济兴，本草杏林华夏清”。接下来，我们将用五分钟汇报这段从三个班走向一个集体的“光药医路”。",
    },
    {
        "title": "评分导向",
        "visible_text": ["评分导向", "主题贯穿 · 内容丰富 · 组织有效 · 形式创新 · 成长表达", "我们围绕五个关键词展开答辩", "02/15"],
        "speaker": "本次特色团日评分不仅看活动有没有做，更看主题是否贯穿、内容是否丰富、组织是否有效、形式是否有创新，以及答辩能否讲出支部成长。因此我们的展示不按流水账展开，而围绕这五个关键词呈现。",
    },
    {
        "title": "主题释义",
        "visible_text": ["主题释义", "光", "药", "医", "路", "技术视角", "本草传承", "仁心关怀", "共同成长", "中医药文化，是三个专业共同对话的交汇点", "03/15"],
        "speaker": "“光药医路”不是简单拼接三个专业名称。“光”代表光电技术与创新视角，“药”代表本草文化与药学传承，“医”代表生命科学与仁心关怀，“路”代表我们75位同学共同走过的实践过程。中医药文化，正好成为三个专业共同对话的交汇点。",
    },
    {
        "title": "三支部总览",
        "visible_text": ["三支部总览", "75位同行者，差异成为合力", "药学2503", "光电2506", "基医2501", "04/15"],
        "speaker": "联合支部由三个专业背景差异很大的班级组成。药学支部负责总协调和中药知识支撑，光电支部带来技术和系统设计能力，基医支部提供医学理解和视觉表达。差异不是阻力，反而成为我们活动创新的来源。",
    },
    {
        "title": "组织架构",
        "visible_text": ["组织架构", "跨班混编，让联合支部真正运转", "策划组", "宣传组", "实践组", "财务组", "后勤组", "策划 · 物资 · 执行 · 宣传 · 总结", "05/15"],
        "speaker": "为了让联合支部真正运转起来，我们没有按班级各做各的，而是设置宣传、财务、实践、策划、后勤五个功能组，跨班混编。每一次活动都形成“策划、物资、执行、宣传、总结”的闭环，这保证了后续多场活动能够持续推进。",
    },
    {
        "title": "三色成长弧",
        "visible_text": ["三色成长弧", "初识白", "思政红", "药草绿", "破冰相识", "团课学习 · 志愿服务", "嘉年华 · 宣讲 · 家乡考察 · 叶开泰", "06/15"],
        "speaker": "我们把整个特色团日概括为三色成长弧。初识白，是破冰相识；思政红，是团课学习和志愿服务；药草绿，是围绕中医药文化展开的路演、宣讲、家乡考察和叶开泰参观。三种颜色共同构成支部成长的完整路径。",
    },
    {
        "title": "初识白",
        "visible_text": ["初识白", "破冰相识，味冰之夜", "传声筒", "数字炸弹", "狼人杀", "阿瓦隆", "联合支部从通知里的名称，变成真实的温度", "07/15"],
        "speaker": "12月7日，我们在韵苑活动中心开展破冰活动。特色团日介绍让大家知道未来要一起做什么，传声筒、数字炸弹、狼人杀和阿瓦隆让同学们真正熟悉起来。那天之后，“联合支部”不再只是通知里的名称，而开始有了真实的温度。",
    },
    {
        "title": "思政红团课",
        "visible_text": ["思政红团课", "国家需求中的青年使命", "科技创新", "民生健康", "绿色发展", "从专业出发，理解时代责任", "08/15"],
        "speaker": "思政红首先体现在共同学习。3月29日，三个支部围绕十五五规划开展团课，从科技创新、民生健康、绿色发展等维度理解青年使命。药学、光电、基医三个专业，也在国家需求的语境中找到了各自的责任位置。",
    },
    {
        "title": "思政红志愿",
        "visible_text": ["思政红志愿", "把担当写在社区巷道里", "清理广告", "扫除落叶", "张贴通知", "红建社区 · 4月19日", "09/15"],
        "speaker": "思政红不只停留在课堂。4月19日，我们来到红建社区，清理违法小广告、扫除巷道落叶、张贴正规通知。大家穿上红马甲，拿起铲子和喷壶，在真实社区场景中理解“服务基层”的含义。",
    },
    {
        "title": "药草绿嘉年华",
        "visible_text": ["药草绿嘉年华", "让中医药在互动中被看见", "辨认药材", "捣药闻香", "药秤称量", "观察 · 触摸 · 嗅闻 · 操作", "10/15"],
        "speaker": "嘉年华是我们面向全校的首次集中亮相。我们把中医药知识设计成三个互动游戏：辨认药材、捣药闻香、传统药秤称量。参与者不是被动听科普，而是在观察、触摸、嗅闻和操作中走近中医药文化。",
    },
    {
        "title": "创新亮点",
        "visible_text": ["创新亮点", "用代码和视觉，让传统文化年轻化", "小程序", "积分", "百科", "电子奖券", "技术 × 文化 × 传播", "11/15"],
        "speaker": "我们的创新不只是活动内容，也包括传播方式。光电同学参与小程序搭建，让游戏规则、积分排行和中药百科在线化；基医同学主导海报设计，把传统中医药做成年轻人愿意靠近的国潮视觉。技术和设计，让文化传播更轻盈。",
    },
    {
        "title": "冬暖青日",
        "visible_text": ["冬暖青日", "本草寻踪，从校园到家乡", "返乡宣讲", "家乡考察", "本草地图", "75位同学 · 17个省份", "12/15"],
        "speaker": "寒假期间，联合支部把实践从校园延伸到家乡。同学们返乡开展中医药文化宣讲，也结合家乡资源进行考察。我们把75位同学的家乡分布整理成本草地图，让每个省份都对应本地特色中药，呈现出一张属于青年视角的“本草中国”。",
    },
    {
        "title": "叶开泰",
        "visible_text": ["叶开泰", "从游戏化体验，走向历史现场", "历史展板", "闻香体验", "互动桌", "传统药铺", "叶开泰中医药文化园 · 4月19日", "13/15"],
        "speaker": "4月19日下午，我们走进叶开泰中医药文化园。这里不是单纯参观，而是一次沉浸式体验：看中医药历史展板，闻药材香气，触摸互动桌，走进传统药铺复原场景。嘉年华上被游戏化的中医药，在叶开泰回到了更深厚的历史现场。",
    },
    {
        "title": "成果总结",
        "visible_text": ["成果总结", "三种成长，落在真实行动里", "思想上：从学习到担当", "组织上：从三班到一体", "文化上：从了解走向传播", "14/15"],
        "speaker": "回看整个过程，我们的收获可以概括为三点。思想上，团课和志愿让同学们把个人专业放进时代责任中理解；组织上，跨班分工让三个支部真正形成协作共同体；文化上，我们从了解中医药，到用游戏、技术、宣讲和参观主动传播中医药。",
    },
    {
        "title": "光药医路 一起走",
        "visible_text": ["光药医路 一起走", "光可以照亮黑暗，药可以治愈疾病，医可以守护生命，而路，需要一起走。", "谢谢各位老师", "15/15"],
        "speaker": "最后，我们想用一句话收束这段经历：光可以照亮黑暗，药可以治愈疾病，医可以守护生命，而路，需要一起走。光药医路的意义，不只在完成一次特色团日，更在于让75位来自不同专业的青年，真正成为了一个共同成长的集体。谢谢各位老师。",
    },
]


PHOTO_LAYOUTS: dict[int, list[Photo]] = {
    4: [
        Photo("素材库/08人员与合照/08总结书-药学合照.jpg", 200, 350, 430, 310),
        Photo("素材库/08人员与合照/08总结书-光电合照.jpg", 745, 350, 430, 310),
        Photo("素材库/08人员与合照/08总结书-基医合照.png", 1290, 350, 430, 310),
    ],
    7: [
        Photo("素材库/03破冰活动/图集/03破冰活动-图集-全体合照.jpeg", 130, 250, 820, 465),
        Photo("素材库/03破冰活动/图集/03破冰活动-图集-桌游互动1.jpeg", 910, 410, 275, 200),
        Photo("素材库/03破冰活动/图集/03破冰活动-图集-全景听讲.jpeg", 1230, 410, 275, 200),
        Photo("素材库/03破冰活动/图集/03破冰活动-图集-围坐讨论.jpeg", 1545, 410, 275, 200),
    ],
    8: [
        Photo("素材库/06三月活动/3.29主题团会/06三月活动-3.29主题团会-团会PPT讲解1.jpg", 130, 245, 680, 385),
        Photo("素材库/06三月活动/3.29主题团会/06三月活动-3.29主题团会-团会全景合照.jpg", 130, 690, 680, 210),
    ],
    9: [
        Photo("素材库/07四月活动/图片集/志愿服务/07四月活动-图片集-志愿服务-红建社区合影1.jpg", 150, 350, 735, 415),
        Photo("素材库/07四月活动/图片集/志愿服务/07四月活动-图片集-志愿服务-男生使用铲子清理红砖墙小广告1.jpg", 985, 355, 245, 315),
        Photo("素材库/07四月活动/图片集/志愿服务/07四月活动-图片集-志愿服务-红建社区清扫巷道落叶的同学1.jpg", 1288, 355, 245, 315),
        Photo("素材库/07四月活动/图片集/志愿服务/07四月活动-图片集-志愿服务-两名同学在社区公告栏张贴通知1.jpg", 1592, 355, 245, 315),
    ],
    10: [
        Photo("素材库/04嘉年华/图集/04嘉年华-图集-摊位合照.jpg", 130, 230, 815, 545),
    ],
    11: [
        Photo("素材库/04嘉年华/04嘉年华-小程序内部.jpg", 170, 205, 330, 635),
        Photo("素材库/04嘉年华/04嘉年华-光药医路海报.png", 1430, 185, 390, 390),
        Photo("素材库/04嘉年华/04嘉年华-小程序码.png", 1390, 640, 170, 170, 0),
    ],
    12: [
        Photo("素材库/05冬暖青日/宣讲/05冬暖青日-宣讲-女生讲PPT.jpg", 75, 165, 285, 295),
        Photo("素材库/05冬暖青日/宣讲/05冬暖青日-宣讲-男生讲PPT.png", 410, 165, 285, 295),
    ],
    13: [
        Photo("素材库/07四月活动/图片集/叶开泰/合照与活动花絮/07四月活动-图片集-叶开泰-叶开泰中医药文化园横幅大合照1.jpg", 250, 360, 760, 400),
        Photo("素材库/07四月活动/图片集/叶开泰/展厅内部参观/07四月活动-图片集-叶开泰-展厅内部参观-叶开泰传统中药铺全景复原2.jpg", 1075, 355, 220, 255),
        Photo("素材库/07四月活动/图片集/叶开泰/展厅内部参观/07四月活动-图片集-叶开泰-展厅内部参观-叶开泰植物标本玻璃瓶墙1.jpg", 1340, 355, 220, 255),
        Photo("素材库/07四月活动/图片集/叶开泰/07四月活动-图片集-叶开泰-触摸互动桌体验.png", 1610, 355, 220, 255),
    ],
    14: [
        Photo("素材库/06三月活动/3.29主题团会/06三月活动-3.29主题团会-团会全景合照.jpg", 140, 350, 470, 280),
        Photo("素材库/03破冰活动/图集/03破冰活动-图集-大合照2.jpeg", 725, 350, 470, 280),
        Photo("素材库/04嘉年华/图集/04嘉年华-图集-摊位互动1.jpg", 1310, 350, 470, 280),
    ],
}


def reset_dirs() -> None:
    for folder in [FULL, LAYERS, PREVIEW]:
        if folder.exists():
            shutil.rmtree(folder)
        folder.mkdir(parents=True)
    SOURCE.mkdir(parents=True, exist_ok=True)


def copy_generated_ai_slides() -> None:
    source_dir = Path.home() / ".codex" / "generated_images" / "019e019b-5e9b-74c1-8f57-9df8293f8ec1"
    files = sorted(source_dir.glob("*.png"), key=lambda p: p.stat().st_mtime)
    if len(files) < 15:
        raise RuntimeError(f"expected at least 15 generated images in {source_dir}, found {len(files)}")
    for idx, src in enumerate(files[-15:], 1):
        with Image.open(src) as image:
            normalized = ImageOps.fit(image.convert("RGB"), (PX_W, PX_H), Image.Resampling.LANCZOS, centering=(0.5, 0.5))
            normalized.save(FULL / f"slide_{idx:02d}.png")


def font(size: int):
    return Image.truetype(FONTS["yahei"], size)


def crop_logo() -> Path:
    src = SOURCE / "hust_logo_official_left_right.jpg"
    if not src.exists():
        raise FileNotFoundError(src)
    image = Image.open(src).convert("RGB")
    w, h = image.size
    # The official guide image contains several logo variants plus construction
    # guides. Isolate the red horizontal combination in the right content area.
    roi_x0, roi_y0 = int(w * 0.34), int(h * 0.45)
    roi_x1, roi_y1 = int(w * 0.90), int(h * 0.72)
    roi = image.crop((roi_x0, roi_y0, roi_x1, roi_y1))
    mask = Image.new("L", roi.size, 0)
    mask_px = []
    for r, g, b in roi.getdata():
        if r > 130 and g < 125 and b < 125 and r > g * 1.45 and r > b * 1.45:
            mask_px.append(255)
        else:
            mask_px.append(0)
    mask.putdata(mask_px)
    bbox = mask.getbbox()
    if not bbox:
        raise RuntimeError("failed to locate the red HUST logo combination in the official guide image")
    pad = 45
    left = max(roi_x0 + bbox[0] - pad, 0)
    top = max(roi_y0 + bbox[1] - pad, 0)
    right = min(roi_x0 + bbox[2] + pad, w)
    bottom = min(roi_y0 + bbox[3] + pad, h)

    crop = image.crop((left, top, right, bottom)).convert("RGBA")
    data = []
    for r, g, b, a in crop.getdata():
        # Keep red antialiased logo pixels and remove the white page plus gray
        # construction grid, producing a transparent PNG layer.
        if r > 90 and r > g * 1.22 and r > b * 1.22:
            data.append((r, g, b, a))
        else:
            data.append((255, 255, 255, 0))
    crop.putdata(data)
    bbox = crop.getbbox()
    if bbox:
        crop = crop.crop(bbox)
    out = SOURCE / "hust_logo_official_layer.png"
    crop.save(out)
    return out


def rounded_photo(src: Path, w: int, h: int, radius: int) -> Image.Image:
    im = ImageOps.fit(Image.open(src).convert("RGB"), (w, h), Image.Resampling.LANCZOS)
    if radius <= 0:
        return im.convert("RGBA")
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
    out = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    shadow = Image.new("RGBA", (w + 28, h + 28), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((14, 14, w + 14, h + 14), radius=radius, fill=(0, 0, 0, 95))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    canvas = Image.new("RGBA", (w + 28, h + 28), (255, 255, 255, 0))
    canvas.alpha_composite(shadow, (0, 0))
    out.paste(im, (0, 0), mask)
    canvas.alpha_composite(out, (14, 14))
    return canvas


def crop_tiles(slide_no: int, image: Image.Image, slide_dir: Path) -> list[Layer]:
    tile_rects = [
        ("header", 0, 0, 1920, 170, 1),
        ("left_field", 0, 170, 640, 700, 2),
        ("center_field", 640, 170, 640, 700, 2),
        ("right_field", 1280, 170, 640, 700, 2),
        ("footer_left", 0, 870, 960, 210, 3),
        ("footer_right", 960, 870, 960, 210, 3),
    ]
    layers: list[Layer] = []
    for name, x, y, w, h, group in tile_rects:
        path = slide_dir / f"{name}.png"
        image.crop((x, y, x + w, y + h)).save(path)
        layers.append(Layer(name, path.relative_to(OUT).as_posix(), x, y, w, h, "ai_tile", group))
    return layers


def build_layers() -> tuple[list[list[Layer]], list[Path]]:
    logo_path = crop_logo()
    all_layers: list[list[Layer]] = []
    previews: list[Path] = []
    for slide_no in range(1, 16):
        slide_dir = LAYERS / f"slide_{slide_no:02d}"
        slide_dir.mkdir(parents=True, exist_ok=True)
        full = Image.open(FULL / f"slide_{slide_no:02d}.png").convert("RGB")
        layers = crop_tiles(slide_no, full, slide_dir)
        preview = Image.new("RGBA", (PX_W, PX_H), (255, 255, 255, 0))
        for layer in layers:
            preview.alpha_composite(Image.open(OUT / layer.path).convert("RGBA"), (layer.x, layer.y))

        logo = Image.open(logo_path).convert("RGBA")
        logo_w = 260
        logo_h = round(logo.height * logo_w / logo.width)
        logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
        logo_layer = slide_dir / "hust_logo.png"
        logo.save(logo_layer)
        preview.alpha_composite(logo, (42, 22))
        layers.append(Layer("hust_logo", logo_layer.relative_to(OUT).as_posix(), 42, 22, logo_w, logo_h, "official_logo", 1))

        for pidx, photo in enumerate(PHOTO_LAYOUTS.get(slide_no, []), 1):
            src = ROOT / photo.path
            img = rounded_photo(src, photo.w, photo.h, photo.radius)
            layer_path = slide_dir / f"photo_{pidx:02d}.png"
            img.save(layer_path)
            px = photo.x - (14 if photo.radius > 0 else 0)
            py = photo.y - (14 if photo.radius > 0 else 0)
            preview.alpha_composite(img, (px, py))
            layers.append(Layer(f"photo_{pidx:02d}", layer_path.relative_to(OUT).as_posix(), px, py, img.width, img.height, "real_photo", 2))

        preview_path = PREVIEW / f"slide_{slide_no:02d}.png"
        preview.convert("RGB").save(preview_path)
        previews.append(preview_path)
        all_layers.append(layers)
    return all_layers, previews


def emu_x(px: int) -> int:
    return round(px * SLIDE_CX / PX_W)


def emu_y(px: int) -> int:
    return round(px * SLIDE_CY / PX_H)


def pic_xml(shape_id: int, rid: str, layer: Layer) -> str:
    name = html.escape(layer.name)
    return f"""
    <p:pic>
      <p:nvPicPr><p:cNvPr id="{shape_id}" name="{name}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>
      <p:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
      <p:spPr><a:xfrm><a:off x="{emu_x(layer.x)}" y="{emu_y(layer.y)}"/><a:ext cx="{emu_x(layer.w)}" cy="{emu_y(layer.h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
    </p:pic>"""


def timing_xml(target_ids: list[int]) -> str:
    if not target_ids:
        return ""
    effects = []
    tn = 10
    for order, spid in enumerate(target_ids[:4]):
        delay = order * 180
        effects.append(
            f"""
          <p:par><p:cTn id="{tn}" fill="hold"><p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>
            <p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{tn + 1}" dur="430" fill="hold"/><p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>
          </p:childTnLst></p:cTn></p:par>"""
        )
        tn += 2
    return f"""
  <p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>{''.join(effects)}</p:childTnLst></p:cTn></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>"""


def slide_xml(layers: list[Layer], rels: list[tuple[str, Layer]]) -> str:
    elements = []
    animate_ids = []
    sid = 2
    for rid, layer in rels:
        elements.append(pic_xml(sid, rid, layer))
        if layer.animate_group in {1, 2, 3}:
            animate_ids.append(sid)
        sid += 1
    body = "\n".join(elements)
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    {body}
  </p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
  <p:transition spd="med"><p:fade/></p:transition>
  {timing_xml(animate_ids)}
</p:sld>'''


def write_pptx(all_layers: list[list[Layer]], pptx_path: Path) -> None:
    tmp = OUT / "_pptx_build"
    if tmp.exists():
        shutil.rmtree(tmp)
    (tmp / "_rels").mkdir(parents=True)
    (tmp / "ppt" / "slides" / "_rels").mkdir(parents=True)
    (tmp / "ppt" / "media").mkdir(parents=True)
    (tmp / "ppt" / "_rels").mkdir(parents=True)
    (tmp / "docProps").mkdir(parents=True)

    media_idx = 1
    for slide_no, layers in enumerate(all_layers, 1):
        slide_rels: list[tuple[str, str, str]] = []
        rel_layers: list[tuple[str, Layer]] = []
        for layer in layers:
            src = OUT / layer.path
            media_name = f"image{media_idx}.png"
            shutil.copy2(src, tmp / "ppt" / "media" / media_name)
            rid = f"rId{len(slide_rels) + 1}"
            slide_rels.append((rid, f"../media/{media_name}", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"))
            rel_layers.append((rid, layer))
            media_idx += 1
        (tmp / "ppt" / "slides" / f"slide{slide_no}.xml").write_text(slide_xml(layers, rel_layers), encoding="utf-8")
        rel_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" + "".join(
            f'<Relationship Id="{rid}" Type="{typ}" Target="{target}"/>' for rid, target, typ in slide_rels
        ) + "</Relationships>"
        (tmp / "ppt" / "slides" / "_rels" / f"slide{slide_no}.xml.rels").write_text(rel_xml, encoding="utf-8")

    content_types = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">"
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Default Extension="png" ContentType="image/png"/>'
        '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>'
        + "".join(f'<Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' for i in range(1, 16))
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
        + "".join(f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>' for i in range(1, 16))
        + "</Relationships>",
        encoding="utf-8",
    )
    (tmp / "ppt" / "presentation.xml").write_text(
        f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>{''.join(f'<p:sldId id="{256 + i}" r:id="rId{i}"/>' for i in range(1, 16))}</p:sldIdLst>
  <p:sldSz cx="{SLIDE_CX}" cy="{SLIDE_CY}" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>''',
        encoding="utf-8",
    )
    (tmp / "docProps" / "core.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>光药医路5分钟纯图分层答辩PPT</dc:title><dc:creator>Codex</dc:creator></cp:coreProperties>',
        encoding="utf-8",
    )
    (tmp / "docProps" / "app.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Codex</Application><Slides>15</Slides></Properties>',
        encoding="utf-8",
    )
    if pptx_path.exists():
        pptx_path.unlink()
    with zipfile.ZipFile(pptx_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file in tmp.rglob("*"):
            if file.is_file():
                zf.write(file, file.relative_to(tmp).as_posix())
    shutil.rmtree(tmp)


def write_contact_sheet(previews: list[Path]) -> None:
    thumbs = [Image.open(p).convert("RGB").resize((384, 216), Image.Resampling.LANCZOS) for p in previews]
    sheet = Image.new("RGB", (384 * 3, 246 * 5), "white")
    draw = ImageDraw.Draw(sheet)
    for i, thumb in enumerate(thumbs, 1):
        x = ((i - 1) % 3) * 384
        y = ((i - 1) // 3) * 246
        sheet.paste(thumb, (x, y + 24))
        draw.text((x + 8, y + 2), f"{i:02d}", fill=(30, 30, 30))
    sheet.save(OUT / "preview_contact_sheet.png")


def write_pdf(previews: list[Path]) -> None:
    images = [Image.open(p).convert("RGB") for p in previews]
    images[0].save(OUT / PDF_NAME, save_all=True, append_images=images[1:], resolution=120)


def write_script() -> None:
    lines = ["# 光药医路 5分钟答辩讲稿", "", "目标时长：4分40秒-4分55秒。v3 PPTX 可见内容均为图片层，完整讲稿保存在此 Markdown。", ""]
    for i, item in enumerate(SLIDE_TEXT, 1):
        lines.extend([f"## {i:02d}. {item['title']}", "", item["speaker"], ""])
    (OUT / SCRIPT_NAME).write_text("\n".join(lines), encoding="utf-8")


def write_manifests(all_layers: list[list[Layer]]) -> None:
    layer_manifest = []
    for i, layers in enumerate(all_layers, 1):
        layer_manifest.append(
            {
                "slide": i,
                "size": [PX_W, PX_H],
                "layers": [layer.__dict__ | {"sha256": hashlib.sha256((OUT / layer.path).read_bytes()).hexdigest()} for layer in layers],
            }
        )
    (OUT / "layer_manifest.json").write_text(json.dumps(layer_manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    text_manifest = [{"slide": i, **item} for i, item in enumerate(SLIDE_TEXT, 1)]
    (OUT / "text_manifest.json").write_text(json.dumps(text_manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    reset_dirs()
    copy_generated_ai_slides()
    all_layers, previews = build_layers()
    write_manifests(all_layers)
    write_contact_sheet(previews)
    write_pdf(previews)
    write_script()
    write_pptx(all_layers, OUT / PPTX_NAME)
    print(f"generated: {OUT}")
    print("slides: 15")
    print(f"pptx: {OUT / PPTX_NAME}")


if __name__ == "__main__":
    main()
