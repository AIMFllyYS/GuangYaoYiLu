from __future__ import annotations

import hashlib
import html
import json
import shutil
import zipfile
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

from validate_pptx_package import validate_pptx


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "交付物" / "答辩PPT" / "答辩PPT_v4"
V3 = ROOT / "交付物" / "答辩PPT" / "答辩PPT_v3"
SUPPLEMENT = ROOT / "交付物" / "答辩PPT" / "补充性PPT"
FULL = OUT / "full_ai_slides"
LAYERS = OUT / "layers"
PREVIEW = OUT / "preview_png"
SOURCE = OUT / "source_assets"

PX_W = 1920
PX_H = 1080
SLIDE_CX = 12192000
SLIDE_CY = 6858000

PPTX_NAME = "光药医路_5分钟纯图分层答辩PPT_v4.pptx"
PDF_NAME = "光药医路_5分钟纯图分层答辩PPT_v4_静态预览.pdf"
SCRIPT_NAME = "光药医路_5分钟答辩讲稿_v4.md"

FONTS = {
    "yahei": "C:/Windows/Fonts/msyh.ttc",
    "hei": "C:/Windows/Fonts/simhei.ttf",
}

CREAM = (245, 238, 219)
INK = (44, 55, 36)
GREEN = (55, 105, 67)
RED = (162, 38, 43)
GOLD = (185, 145, 74)
PALE_GREEN = (218, 231, 203)


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

SLIDE_TEXT.extend(
    [
        {
            "title": "瑶光角色解构",
            "visible_text": ["瑶光角色解构", "一位把光学、药学与医学连接起来的本草守护者", "白袍", "红衫", "绿带", "透镜", "药壶"],
            "speaker": "这里单独介绍贯穿视觉体系的看板娘瑶光。她不是普通插画角色：白色实验袍对应现代医学与实验精神，红色中式内衫承接思政红和传统文化，绿色腰带、药壶和银杏本草对应中医药主线，发簪透镜和 DNA 纹样则呼应光电与基础医学。瑶光把三个支部的专业气质合在同一个形象里。",
        },
        {
            "title": "瑶光周边设想",
            "visible_text": ["瑶光周边设想", "把活动记忆留在可带走的物件里", "日历", "笔记本", "徽章", "钥匙扣", "冰箱贴"],
            "speaker": "在活动传播上，瑶光也可以延展为一套周边：日历记录联合支部的活动节点，笔记本承载本草笔记，徽章和钥匙扣适合现场互动兑换，冰箱贴则把光药医路变成可以长期保存的纪念。这样，活动不只停留在一次现场，而能继续留在同学们的日常生活里。",
        },
        {
            "title": "嘉年华宣传",
            "visible_text": ["嘉年华宣传", "QQ空间推文，把同济杏林之约推向全校", "无需穿越时空，在中操亲手触碰千年本草"],
            "speaker": "嘉年华前期，我们通过 QQ 空间推文进行宣传，用更接近同学日常的语言发出邀请。推文中把活动包装成一场同济杏林之约，强调不用穿越时空，就能在校园里亲手触碰千年本草，让传统文化先通过轻松的传播方式被看见。",
        },
        {
            "title": "小游戏与奖品",
            "visible_text": ["小游戏与奖品", "用任务、积分与奖品，把中医药知识变成可参与的体验", "望色辨证", "草色通真", "捣药闻香", "分两入毫"],
            "speaker": "现场互动主要由多个小游戏组成：望色辨证通过颜色和现象引入中医思维，草色通真让同学辨认药材，捣药闻香让大家通过气味和操作理解药性，分两入毫则用传统药秤体验慎于分量。积分和奖品机制让参与者愿意停留、挑战和分享。",
        },
        {
            "title": "视频背景 01",
            "visible_text": ["视频背景 01", "开场氛围"],
            "speaker": "本页作为视频插入背景，可用于开场片段或主题引入。",
        },
        {
            "title": "视频背景 02",
            "visible_text": ["视频背景 02", "嘉年华互动"],
            "speaker": "本页作为视频插入背景，可用于嘉年华现场互动或游戏过程片段。",
        },
        {
            "title": "视频背景 03",
            "visible_text": ["视频背景 03", "共同成长"],
            "speaker": "本页作为视频插入背景，可用于结尾回顾、成果展示或合影视频。",
        },
    ]
)


def apply_slide_numbers() -> None:
    total = len(SLIDE_TEXT)
    for idx, item in enumerate(SLIDE_TEXT, 1):
        marker = f"{idx:02d}/{total:02d}"
        visible = item["visible_text"]
        if visible and "/" in visible[-1] and visible[-1].replace("/", "").isdigit():
            visible[-1] = marker
        else:
            visible.append(marker)


apply_slide_numbers()


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
    for src in (V3 / "source_assets").glob("*"):
        if src.is_file():
            shutil.copy2(src, SOURCE / src.name)


def copy_generated_ai_slides() -> None:
    for idx in range(1, min(15, len(SLIDE_TEXT)) + 1):
        src = V3 / "full_ai_slides" / f"slide_{idx:02d}.png"
        if not src.exists():
            raise FileNotFoundError(src)
        with Image.open(src) as source:
            replace_existing_page_marker(source, idx).save(FULL / f"slide_{idx:02d}.png")
    for idx in range(16, len(SLIDE_TEXT) + 1):
        make_additional_slide(idx).save(FULL / f"slide_{idx:02d}.png")


def font(size: int):
    return ImageFont.truetype(FONTS["yahei"], size)


def bold_font(size: int):
    return ImageFont.truetype(FONTS["hei"], size)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def draw_wrapped_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    max_width: int,
    fnt,
    fill: tuple[int, int, int] = INK,
    line_gap: int = 12,
) -> int:
    x, y = xy
    lines: list[str] = []
    current = ""
    for char in text:
        if char == "\n":
            lines.append(current)
            current = ""
            continue
        trial = current + char
        if current and text_size(draw, trial, fnt)[0] > max_width:
            lines.append(current)
            current = char
        else:
            current = trial
    if current:
        lines.append(current)
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += text_size(draw, line, fnt)[1] + line_gap
    return y


def parchment_background(accent: tuple[int, int, int] = GREEN) -> Image.Image:
    base = Image.new("RGB", (PX_W, PX_H), CREAM)
    noise = Image.effect_noise((PX_W, PX_H), 18).convert("L")
    tint = Image.new("RGB", (PX_W, PX_H), (14, 9, 0))
    base = Image.composite(tint, base, noise.point(lambda p: min(80, max(0, p - 120))))
    overlay = Image.new("RGBA", (PX_W, PX_H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    for offset, color, width in [(0, (*accent, 34), 34), (42, (*RED, 28), 26), (84, (*GOLD, 30), 18)]:
        draw.arc((-260 + offset, 710, 1110 + offset, 1410), 190, 350, fill=color, width=width)
        draw.arc((900 - offset, -270, 2190 - offset, 420), 12, 176, fill=color, width=width)
    for x, y, r in [(126, 926, 46), (170, 915, 35), (1485, 140, 32), (1548, 172, 23), (1675, 918, 38)]:
        draw.ellipse((x - r, y - r, x + r, y + r), outline=(*GOLD, 95), width=3)
        draw.line((x, y - r, x, y + r), fill=(*GOLD, 65), width=2)
        draw.line((x - r, y, x + r, y), fill=(*GOLD, 65), width=2)
    for i in range(9):
        x = 80 + i * 210
        draw.line((x, 1010, x + 120, 940), fill=(*GREEN, 38), width=4)
        draw.ellipse((x + 55, 948, x + 112, 988), outline=(*GREEN, 44), width=3)
    return Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")


def draw_hust_logo(draw: ImageDraw.ImageDraw) -> None:
    draw.text((42, 22), "华中科技大学", font=bold_font(30), fill=RED)


def draw_header(draw: ImageDraw.ImageDraw, title: str, subtitle: str, slide_no: int) -> None:
    draw.rectangle((0, 0, 18, 170), fill=RED)
    draw_hust_logo(draw)
    draw.text((105, 132), f"{slide_no:02d}/{len(SLIDE_TEXT):02d}", font=font(22), fill=(116, 106, 84))
    draw.text((130, 74), title, font=bold_font(72), fill=GREEN)
    if subtitle:
        draw.text((132, 154), subtitle, font=font(27), fill=(120, 84, 42))


def draw_page_marker(draw: ImageDraw.ImageDraw, slide_no: int) -> None:
    marker = f"{slide_no:02d}/{len(SLIDE_TEXT):02d}"
    x0, y0, x1, y1 = 1755, 1015, 1870, 1052
    draw.rounded_rectangle((x0, y0, x1, y1), radius=18, fill=(244, 238, 220), outline=(214, 190, 142), width=2)
    draw.text((x0 + 19, y0 + 6), marker, font=font(20), fill=(89, 84, 69))


def replace_existing_page_marker(image: Image.Image, slide_no: int) -> Image.Image:
    out = image.convert("RGB")
    draw = ImageDraw.Draw(out)
    draw.rounded_rectangle((1725, 1005, 1885, 1058), radius=24, fill=(244, 238, 220), outline=(214, 190, 142), width=2)
    draw.text((1761, 1018), f"{slide_no:02d}/{len(SLIDE_TEXT):02d}", font=font(20), fill=(89, 84, 69))
    return out


def paste_fit(
    canvas: Image.Image,
    src: Path,
    box: tuple[int, int, int, int],
    radius: int = 36,
    mode: str = "cover",
    shadow: bool = True,
) -> None:
    x, y, w, h = box
    image = Image.open(src).convert("RGB")
    if mode == "contain":
        image.thumbnail((w, h), Image.Resampling.LANCZOS)
        fitted = Image.new("RGB", (w, h), (250, 246, 234))
        fitted.paste(image, ((w - image.width) // 2, (h - image.height) // 2))
    else:
        fitted = ImageOps.fit(image, (w, h), Image.Resampling.LANCZOS)
    layer = fitted.convert("RGBA")
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
    if shadow:
        sh = Image.new("RGBA", (w + 34, h + 34), (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle((17, 17, w + 17, h + 17), radius=radius, fill=(55, 42, 18, 76))
        sh = sh.filter(ImageFilter.GaussianBlur(12))
        canvas.alpha_composite(sh, (x - 17, y - 17))
    canvas.paste(layer, (x, y), mask)


def tag(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fill: tuple[int, int, int]) -> None:
    x, y = xy
    w, h = text_size(draw, text, font(28))
    draw.rounded_rectangle((x, y, x + w + 44, y + 56), radius=28, fill=fill, outline=(232, 210, 162), width=2)
    draw.text((x + 22, y + 12), text, font=font(28), fill=(255, 252, 240))


def make_slide_16() -> Image.Image:
    image = parchment_background(GREEN).convert("RGBA")
    draw = ImageDraw.Draw(image)
    draw_header(draw, "瑶光角色解构", "光学、药学与医学在一个形象里汇合", 16)
    paste_fit(image, SUPPLEMENT / "瑶光-3.jpg", (110, 205, 690, 790), radius=34, mode="cover")
    points = [
        ("白色实验袍", "现代医学、实验精神与专业可信度", (925, 255), GREEN),
        ("红色中式内衫", "承接思政红，也把传统文化穿在身上", (1060, 402), RED),
        ("绿色腰带与药壶", "药草绿主线，指向中医药文化的生命力", (930, 555), GREEN),
        ("发簪透镜", "光电专业的技术视角，连接观测与创新", (1185, 705), GOLD),
        ("银杏 / DNA 纹样", "本草意象与基础医学理解同框出现", (905, 852), (88, 114, 93)),
    ]
    for title, body, (x, y), color in points:
        draw.line((790, y + 28, x - 36, y + 28), fill=(*color, 180), width=5)
        draw.ellipse((780, y + 18, 802, y + 40), fill=GOLD)
        draw.rounded_rectangle((x, y, x + 640, y + 98), radius=26, fill=(255, 252, 240, 222), outline=(*color, 160), width=3)
        draw.text((x + 26, y + 14), title, font=bold_font(34), fill=color)
        draw.text((x + 26, y + 56), body, font=font(24), fill=(80, 76, 62))
    draw_page_marker(draw, 16)
    return image.convert("RGB")


def make_slide_17() -> Image.Image:
    image = parchment_background(GOLD).convert("RGBA")
    draw = ImageDraw.Draw(image)
    draw_header(draw, "瑶光周边设想", "把活动记忆留在可带走的物件里", 17)
    avatar = SUPPLEMENT / "瑶光-2.jpg"
    paste_fit(image, avatar, (1280, 190, 420, 420), radius=210, mode="cover")
    draw.ellipse((1258, 168, 1722, 632), outline=(236, 204, 127, 230), width=8)

    # Calendar
    draw.rounded_rectangle((115, 250, 515, 555), radius=28, fill=(255, 252, 244), outline=GOLD, width=4)
    draw.rectangle((115, 250, 515, 325), fill=RED)
    draw.text((155, 273), "2026 · 光药医路", font=font(30), fill=(255, 246, 224))
    for i, day in enumerate(["一", "二", "三", "四", "五", "六", "日"]):
        draw.text((150 + i * 48, 350), day, font=font(24), fill=GREEN)
    for row in range(3):
        for col in range(7):
            draw.rounded_rectangle((143 + col * 48, 398 + row * 42, 173 + col * 48, 426 + row * 42), radius=6, fill=(237, 228, 204))
    tag(draw, (220, 575), "日历", GREEN)

    # Notebook
    draw.rounded_rectangle((610, 270, 965, 610), radius=30, fill=(70, 104, 72), outline=(238, 210, 157), width=5)
    draw.rectangle((640, 270, 675, 610), fill=(238, 210, 157))
    draw.text((715, 370), "本草笔记", font=bold_font(48), fill=(255, 247, 220))
    draw.text((725, 440), "YAO GUANG", font=font(24), fill=(224, 198, 138))
    tag(draw, (725, 635), "笔记本", RED)

    # Badge
    draw.ellipse((125, 700, 335, 910), fill=(255, 252, 240), outline=RED, width=7)
    draw.text((177, 756), "瑶", font=bold_font(78), fill=RED)
    draw.text((184, 842), "徽章", font=font(28), fill=GREEN)

    # Keychain
    draw.line((540, 730, 620, 665), fill=(150, 128, 92), width=8)
    draw.ellipse((500, 710, 578, 788), outline=GOLD, width=10)
    draw.rounded_rectangle((585, 705, 805, 900), radius=38, fill=(245, 248, 235), outline=GREEN, width=6)
    draw.text((638, 760), "光药", font=bold_font(44), fill=GREEN)
    draw.text((648, 822), "钥匙扣", font=font(26), fill=RED)

    # Magnet
    draw.rounded_rectangle((965, 718, 1235, 908), radius=32, fill=(182, 45, 48), outline=(239, 213, 154), width=6)
    draw.text((1018, 766), "杏林", font=bold_font(52), fill=(255, 245, 217))
    draw.text((1032, 842), "冰箱贴", font=font(28), fill=(248, 224, 178))

    # Tote card
    draw.rounded_rectangle((1320, 700, 1700, 920), radius=42, fill=(239, 246, 231), outline=GOLD, width=5)
    draw.arc((1405, 648, 1610, 772), 188, 352, fill=GREEN, width=8)
    draw.text((1400, 772), "光药医路", font=bold_font(46), fill=GREEN)
    draw.text((1458, 842), "纪念袋", font=font(28), fill=RED)
    draw_page_marker(draw, 17)
    return image.convert("RGB")


def make_slide_18() -> Image.Image:
    image = parchment_background(RED).convert("RGBA")
    draw = ImageDraw.Draw(image)
    draw_header(draw, "嘉年华宣传", "QQ空间推文，把同济杏林之约推向全校", 18)
    draw.rounded_rectangle((92, 230, 780, 920), radius=46, fill=(255, 252, 242, 225), outline=RED, width=5)
    paste_fit(image, SUPPLEMENT / "宣传推文.png", (128, 260, 616, 610), radius=28, mode="contain")
    draw.text((845, 290), "无需穿越时空", font=bold_font(56), fill=RED)
    draw.text((845, 368), "在校园亲手触碰千年本草", font=bold_font(56), fill=GREEN)
    copy = "宣传文案把活动包装成一场“同济杏林之约”：有兔子战队、有行动坐标、有游戏任务，也有100%掉落的战利品。它让传统文化先以年轻、轻快、可转发的方式抵达同学。"
    draw_wrapped_text(draw, (850, 480), copy, 820, font(32), fill=(72, 66, 52), line_gap=18)
    for i, text in enumerate(["兔子战队", "中操坐标", "本草任务", "幸运奖品"]):
        tag(draw, (880 + (i % 2) * 310, 735 + (i // 2) * 95), text, RED if i % 2 == 0 else GREEN)
    draw_page_marker(draw, 18)
    return image.convert("RGB")


def make_slide_19() -> Image.Image:
    image = parchment_background(GREEN).convert("RGBA")
    draw = ImageDraw.Draw(image)
    draw_header(draw, "小游戏与奖品", "用任务、积分与奖品，把中医药知识变成可参与的体验", 19)
    games = [
        ("望色辨证", "观察药液色彩，辨识草木本真", RED),
        ("草色通真", "识别药材图样，解锁中医智慧", GREEN),
        ("捣药闻香", "研磨药材，感受药香与古法技艺", GOLD),
        ("分两入毫", "挑战药秤称量，体验慎于分量", (112, 91, 62)),
    ]
    for idx, (title, body, color) in enumerate(games):
        x = 130 + (idx % 2) * 850
        y = 245 + (idx // 2) * 300
        draw.rounded_rectangle((x, y, x + 720, y + 230), radius=38, fill=(255, 252, 242, 232), outline=color, width=5)
        draw.ellipse((x + 36, y + 44, x + 150, y + 158), fill=color)
        draw.text((x + 74, y + 72), str(idx + 1), font=bold_font(46), fill=(255, 248, 226))
        draw.text((x + 185, y + 48), title, font=bold_font(46), fill=color)
        draw_wrapped_text(draw, (x + 185, y + 112), body, 460, font(29), fill=(73, 68, 55), line_gap=10)
    draw.rounded_rectangle((395, 850, 1525, 955), radius=52, fill=(162, 38, 43, 232), outline=(238, 211, 157), width=4)
    draw.text((465, 881), "积分挑战  ·  现场引导  ·  100%中奖  ·  惊喜好礼承载诚意与祝福", font=font(38), fill=(255, 244, 218))
    draw_page_marker(draw, 19)
    return image.convert("RGB")


def make_video_slide(slide_no: int, title: str, subtitle: str, accent: tuple[int, int, int]) -> Image.Image:
    image = parchment_background(accent).convert("RGBA")
    draw = ImageDraw.Draw(image)
    draw_header(draw, title, subtitle, slide_no)
    draw.rounded_rectangle((235, 245, 1685, 875), radius=58, fill=(255, 252, 240, 160), outline=(*accent, 150), width=6)
    for inset in range(0, 24, 8):
        draw.rounded_rectangle((255 + inset, 265 + inset, 1665 - inset, 855 - inset), radius=48, outline=(220, 190, 130, 70), width=2)
    draw.text((760, 505), "VIDEO", font=bold_font(92), fill=(*accent, 86))
    draw.text((692, 620), "预留视频插入区域", font=font(38), fill=(118, 106, 82))
    draw_page_marker(draw, slide_no)
    return image.convert("RGB")


def make_additional_slide(slide_no: int) -> Image.Image:
    if slide_no == 16:
        return make_slide_16()
    if slide_no == 17:
        return make_slide_17()
    if slide_no == 18:
        return make_slide_18()
    if slide_no == 19:
        return make_slide_19()
    if slide_no == 20:
        return make_video_slide(20, "视频背景 01", "开场氛围", GOLD)
    if slide_no == 21:
        return make_video_slide(21, "视频背景 02", "嘉年华互动", GREEN)
    if slide_no == 22:
        return make_video_slide(22, "视频背景 03", "共同成长", RED)
    raise ValueError(f"no additional slide template for {slide_no}")


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
    for slide_no in range(1, len(SLIDE_TEXT) + 1):
        slide_dir = LAYERS / f"slide_{slide_no:02d}"
        slide_dir.mkdir(parents=True, exist_ok=True)
        full_path = FULL / f"slide_{slide_no:02d}.png"
        if not full_path.exists():
            raise FileNotFoundError(f"missing full slide artwork: {full_path}")
        full = Image.open(full_path).convert("RGB")
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
    slide_count = len(all_layers)
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
        + "".join(f'<Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>' for i in range(1, slide_count + 1))
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
        + "".join(f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>' for i in range(1, slide_count + 1))
        + "</Relationships>",
        encoding="utf-8",
    )
    (tmp / "ppt" / "presentation.xml").write_text(
        f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>{''.join(f'<p:sldId id="{256 + i}" r:id="rId{i}"/>' for i in range(1, slide_count + 1))}</p:sldIdLst>
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
        f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Codex</Application><Slides>{slide_count}</Slides></Properties>',
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
    cols = 3
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (384 * cols, 246 * rows), "white")
    draw = ImageDraw.Draw(sheet)
    for i, thumb in enumerate(thumbs, 1):
        x = ((i - 1) % cols) * 384
        y = ((i - 1) // cols) * 246
        sheet.paste(thumb, (x, y + 24))
        draw.text((x + 8, y + 2), f"{i:02d}", fill=(30, 30, 30))
    sheet.save(OUT / "preview_contact_sheet.png")


def write_pdf(previews: list[Path]) -> None:
    images = [Image.open(p).convert("RGB") for p in previews]
    images[0].save(OUT / PDF_NAME, save_all=True, append_images=images[1:], resolution=120)


def write_script() -> None:
    lines = ["# 光药医路 5分钟答辩讲稿 v4", "", "目标时长：5分钟左右。v4 PPTX 可见内容均为图片层，完整讲稿保存在此 Markdown。", ""]
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
    pptx_path = OUT / PPTX_NAME
    write_pptx(all_layers, pptx_path)
    validate_pptx(pptx_path, expected_slides=len(SLIDE_TEXT))
    print(f"generated: {OUT}")
    print(f"slides: {len(SLIDE_TEXT)}")
    print(f"pptx: {pptx_path}")


if __name__ == "__main__":
    main()
