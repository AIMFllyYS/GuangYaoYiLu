from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "交付物" / "宣传" / "宣传海报"
PREVIEW = OUT / "preview"

A4_W = 2480
A4_H = 3508
PREVIEW_W = 620
PREVIEW_H = 877

CREAM = (246, 239, 222)
INK = (44, 55, 36)
DEEP_GREEN = (39, 82, 46)
GREEN = (61, 118, 72)
LIGHT_GREEN = (220, 234, 206)
RED = (178, 40, 48)
DEEP_RED = (126, 34, 38)
GOLD = (188, 145, 72)
BROWN = (112, 84, 52)
WHITE = (255, 255, 255)

FONT_PATHS = {
    "title": [
        "C:/Windows/Fonts/STXINGKA.TTF",
        "C:/Windows/Fonts/simkai.ttf",
        "C:/Windows/Fonts/simhei.ttf",
    ],
    "kai": [
        "C:/Windows/Fonts/simkai.ttf",
        "C:/Windows/Fonts/STKAITI.TTF",
        "C:/Windows/Fonts/msyh.ttc",
    ],
    "hei": [
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf",
    ],
    "song": [
        "C:/Windows/Fonts/simsun.ttc",
        "C:/Windows/Fonts/simfang.ttf",
        "C:/Windows/Fonts/msyh.ttc",
    ],
}


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    for item in FONT_PATHS[name]:
        p = Path(item)
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default(size=size)


def cover(path: Path, size: tuple[int, int]) -> Image.Image:
    img = Image.open(path).convert("RGB")
    return ImageOps.fit(img, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5)).convert("RGBA")


def resize_keep(img: Image.Image, width: int | None = None, height: int | None = None) -> Image.Image:
    if width is None and height is None:
        return img
    w, h = img.size
    if width is not None:
        height = int(h * width / w)
    else:
        width = int(w * height / h)
    return img.resize((width, height), Image.Resampling.LANCZOS)


def paste_alpha(dst: Image.Image, src: Image.Image, xy: tuple[int, int], opacity: float = 1.0) -> None:
    src = src.convert("RGBA")
    if opacity < 1:
        alpha = src.getchannel("A").point(lambda p: int(p * opacity))
        src.putalpha(alpha)
    dst.alpha_composite(src, xy)


def remove_white_bg(img: Image.Image, threshold: int = 236) -> Image.Image:
    rgba = img.convert("RGBA")
    pix = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = pix[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pix[x, y] = (r, g, b, 0)
    return rgba


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def draw_center(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    stroke_fill: tuple[int, int, int] | None = None,
    stroke_width: int = 0,
) -> None:
    tw, _ = text_size(draw, text, fnt)
    draw.text(
        ((A4_W - tw) // 2, y),
        text,
        font=fnt,
        fill=fill,
        stroke_fill=stroke_fill,
        stroke_width=stroke_width,
    )


def wrap_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    fnt: ImageFont.FreeTypeFont,
    max_width: int,
) -> list[str]:
    lines: list[str] = []
    for para in text.split("\n"):
        current = ""
        for ch in para:
            trial = current + ch
            if text_size(draw, trial, fnt)[0] <= max_width or not current:
                current = trial
            else:
                lines.append(current)
                current = ch
        if current:
            lines.append(current)
    return lines


def draw_multiline(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: tuple[int, int],
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    max_width: int,
    line_gap: int = 16,
) -> int:
    x, y = xy
    for line in wrap_text(draw, text, fnt, max_width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += fnt.size + line_gap
    return y


def rounded_panel(
    base: Image.Image,
    box: tuple[int, int, int, int],
    fill: tuple[int, int, int, int],
    outline: tuple[int, int, int, int],
    radius: int = 42,
    width: int = 5,
) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    shadow = tuple([0, 0, 0, 42])
    sx1, sy1, sx2, sy2 = box[0] + 12, box[1] + 18, box[2] + 12, box[3] + 18
    d.rounded_rectangle((sx1, sy1, sx2, sy2), radius=radius, fill=shadow)
    layer = layer.filter(ImageFilter.GaussianBlur(14))
    base.alpha_composite(layer)
    d = ImageDraw.Draw(base)
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def load_logo() -> Image.Image:
    logo = Image.open(ROOT / "交付物" / "答辩PPT" / "答辩PPT_v4" / "source_assets" / "hust_logo_official_layer.png").convert("RGBA")
    return resize_keep(logo, width=470)


def load_yaoguang(width: int) -> Image.Image:
    candidates = [
        ROOT / "总结书流水线" / "Antigravity" / "CH04_看板娘" / "yaoguang_fullbody.png",
        ROOT / "总结书流水线" / "Antigravity" / "_shared" / "yaoguang.png",
    ]
    for p in candidates:
        if p.exists():
            return resize_keep(remove_white_bg(Image.open(p), threshold=242), width=width)
    return Image.new("RGBA", (1, 1), (0, 0, 0, 0))


def add_texture(canvas: Image.Image) -> None:
    d = ImageDraw.Draw(canvas, "RGBA")
    for y in range(0, A4_H, 58):
        alpha = 12 if y % 116 == 0 else 7
        d.line((0, y, A4_W, y + 14), fill=(130, 105, 72, alpha), width=2)
    for x in range(-A4_H, A4_W, 170):
        d.line((x, 0, x + A4_H, A4_H), fill=(150, 125, 86, 7), width=2)


def add_header(canvas: Image.Image, title: str, subtitle: str, accent: tuple[int, int, int]) -> None:
    d = ImageDraw.Draw(canvas)
    paste_alpha(canvas, load_logo(), (94, 70), opacity=0.94)
    draw_center(d, title, 292, font("title", 212), accent, stroke_fill=(249, 244, 231), stroke_width=5)
    draw_center(d, subtitle, 558, font("kai", 72), DEEP_RED if accent == DEEP_GREEN else DEEP_GREEN)
    tw, _ = text_size(d, subtitle, font("kai", 72))
    y = 673
    d.line(((A4_W - tw) // 2 - 120, y, (A4_W - tw) // 2 - 24, y), fill=GOLD, width=5)
    d.line(((A4_W + tw) // 2 + 24, y, (A4_W + tw) // 2 + 120, y), fill=GOLD, width=5)
    d.ellipse(((A4_W - 16) // 2, y - 8, (A4_W + 16) // 2, y + 8), fill=GOLD)


def draw_branch_footer(canvas: Image.Image) -> None:
    d = ImageDraw.Draw(canvas)
    box = (150, 3216, A4_W - 150, 3350)
    rounded_panel(canvas, box, (255, 252, 241, 226), GOLD + (255,), radius=44, width=4)
    text = "药学（中外）2503、光电2506、基医（强基）2501班团支部联合举办"
    draw_center(d, text, 3253, font("hei", 48), INK)
    d.text((A4_W - 330, 3406), "活动前宣传", font=font("kai", 34), fill=(120, 98, 68))


def draw_tag(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fill: tuple[int, int, int]) -> None:
    x, y = xy
    fnt = font("hei", 40)
    tw, th = text_size(draw, text, fnt)
    draw.rounded_rectangle((x, y, x + tw + 56, y + 70), radius=35, fill=fill, outline=GOLD, width=3)
    draw.text((x + 28, y + 15), text, font=fnt, fill=WHITE)


def draw_activity_card(
    canvas: Image.Image,
    box: tuple[int, int, int, int],
    label: str,
    title: str,
    body: str,
    icon: str,
    accent: tuple[int, int, int],
) -> None:
    rounded_panel(canvas, box, (255, 252, 242, 232), accent + (255,), radius=54, width=5)
    d = ImageDraw.Draw(canvas)
    x1, y1, x2, _ = box
    d.rounded_rectangle((x1 + 44, y1 + 44, x1 + 214, y1 + 138), radius=40, fill=accent)
    d.text((x1 + 82, y1 + 54), label, font=font("hei", 46), fill=WHITE)
    d.text((x1 + 252, y1 + 44), title, font=font("hei", 66), fill=accent)
    d.text((x2 - 150, y1 + 38), icon, font=font("song", 86), fill=GOLD)
    draw_multiline(d, body, (x1 + 76, y1 + 178), font("song", 46), INK, x2 - x1 - 152, line_gap=20)


def draw_mountains(canvas: Image.Image, greenish: bool = True) -> None:
    d = ImageDraw.Draw(canvas, "RGBA")
    colors = [(54, 91, 58, 86), (95, 111, 77, 64), (182, 145, 88, 62)]
    if not greenish:
        colors = [(128, 44, 42, 66), (54, 91, 58, 58), (182, 145, 88, 58)]
    for i, color in enumerate(colors):
        y = 2760 + i * 96
        pts = [(-80, A4_H), (0, y)]
        for x in range(0, A4_W + 300, 250):
            pts.append((x, y - ((x // 250 + i) % 3) * 90 + (i * 42)))
        pts.extend([(A4_W + 80, A4_H), (-80, A4_H)])
        d.polygon(pts, fill=color)


def make_winter_poster() -> Image.Image:
    bg = cover(ROOT / "总结书流水线" / "Antigravity" / "_shared" / "hometown_cover_bg.png", (A4_W, A4_H))
    canvas = Image.new("RGBA", (A4_W, A4_H), CREAM + (255,))
    canvas.alpha_composite(bg)
    wash = Image.new("RGBA", (A4_W, A4_H), (251, 246, 232, 166))
    canvas.alpha_composite(wash)
    add_texture(canvas)
    draw_mountains(canvas, greenish=True)
    d = ImageDraw.Draw(canvas, "RGBA")
    d.arc((102, 96, 2378, 1860), 200, 342, fill=(190, 35, 43, 150), width=18)
    d.arc((60, 176, 2300, 1920), 202, 340, fill=(47, 103, 58, 142), width=26)
    add_header(canvas, "光药医路 · 冬暖青日", "本草寻踪，从校园到家乡", DEEP_GREEN)

    draw_activity_card(
        canvas,
        (162, 820, 1188, 1450),
        "壹",
        "回母校宣讲中草药知识",
        "以朋辈之声走进熟悉校园，把中草药识别、药食同源与中医药文化讲给学弟学妹听。",
        "讲",
        DEEP_GREEN,
    )
    draw_activity_card(
        canvas,
        (1292, 820, 2318, 1450),
        "贰",
        "探寻家乡中药相关基地",
        "走访中医药博物馆、中草药种植园、老药铺等家乡资源，记录一方水土里的本草故事。",
        "寻",
        GREEN,
    )

    rounded_panel(canvas, (190, 1602, 2290, 2520), (255, 252, 242, 218), GOLD + (255,), radius=58, width=5)
    d.text((268, 1676), "家乡特色示例", font=font("hei", 72), fill=DEEP_GREEN)
    d.text((276, 1778), "以地域本草串联冬日返乡实践", font=font("kai", 48), fill=BROWN)
    d.rounded_rectangle((1240, 1644, 2208, 2388), radius=44, fill=(220, 234, 206, 158), outline=(63, 109, 68, 210), width=5)
    d.text((1544, 1816), "本草地图", font=font("title", 96), fill=(50, 94, 50, 178))
    province_points = [
        (1518, 2068, "湖北省", "蕲艾 · 茯苓"),
        (1782, 1908, "东北三省", "人参 · 刺五加"),
        (1732, 2204, "安徽省", "霍山石斛 · 白芍"),
        (1404, 2246, "浙江省", "胡庆余堂 · 浙贝母"),
    ]
    for x, y, name, herb in province_points:
        d.line((1548, 2022, x, y), fill=(60, 103, 64, 180), width=4)
        d.ellipse((x - 14, y - 14, x + 14, y + 14), fill=RED, outline=WHITE, width=4)
        d.text((x + 26, y - 28), name, font=font("hei", 36), fill=DEEP_GREEN)
        d.text((x + 26, y + 20), herb, font=font("kai", 32), fill=BROWN)
    for i, (tag, x, y) in enumerate([
        ("湖北省", 294, 1920),
        ("东北三省", 576, 1920),
        ("安徽省", 922, 1920),
        ("中医药博物馆", 294, 2042),
        ("中草药种植园", 654, 2042),
        ("家乡老药铺", 1062, 2042),
    ]):
        draw_tag(d, (x, y), tag, DEEP_GREEN if i < 3 else GREEN)
    d.text((294, 2228), "寒假返乡期间 / 活动预告", font=font("hei", 56), fill=RED)
    draw_multiline(
        d,
        "从校园讲台到家乡山河，把传统医药文化带回青春来处，也把各地本草故事带回光药医路。",
        (294, 2320),
        font("song", 46),
        INK,
        820,
        line_gap=18,
    )

    y = 2622
    for text in ["冬日暖阳", "返乡宣讲", "本草寻踪", "文化传承"]:
        draw_tag(d, (300 + (text_size(d, text, font("hei", 40))[0] + 108) * ["冬日暖阳", "返乡宣讲", "本草寻踪", "文化传承"].index(text), y), text, RED if text == "冬日暖阳" else DEEP_GREEN)
    paste_alpha(canvas, load_yaoguang(520), (1780, 2478), opacity=0.86)
    draw_branch_footer(canvas)
    return canvas


def make_yekaitai_poster() -> Image.Image:
    bg_left = cover(ROOT / "总结书流水线" / "Antigravity" / "_shared" / "volunteer_cover_bg.png", (A4_W, A4_H))
    bg_right = cover(ROOT / "总结书流水线" / "Antigravity" / "_shared" / "yekaitai_cover_bg.png", (A4_W, A4_H))
    mask = Image.new("L", (A4_W, A4_H), 0)
    md = ImageDraw.Draw(mask)
    md.rectangle((A4_W // 2 - 40, 0, A4_W, A4_H), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(120))
    canvas = Image.composite(bg_right, bg_left, mask).convert("RGBA")
    canvas.alpha_composite(Image.new("RGBA", (A4_W, A4_H), (250, 245, 232, 150)))
    add_texture(canvas)
    draw_mountains(canvas, greenish=False)
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rectangle((0, 760, A4_W // 2, 2740), fill=(178, 40, 48, 34))
    d.rectangle((A4_W // 2, 760, A4_W, 2740), fill=(39, 82, 46, 42))
    d.line((A4_W // 2, 780, A4_W // 2, 2708), fill=GOLD, width=8)
    d.arc((80, 130, 2360, 1860), 205, 338, fill=(178, 40, 48, 145), width=22)
    d.arc((160, 228, 2330, 1910), 204, 340, fill=(39, 82, 46, 150), width=18)
    add_header(canvas, "光药医路 · 叶开泰之行", "青春志愿行，共护社区 · 共赏国药", DEEP_RED)

    rounded_panel(canvas, (142, 860, 1174, 2450), (255, 250, 239, 230), RED + (255,), radius=58, width=5)
    rounded_panel(canvas, (1306, 860, 2338, 2450), (255, 250, 239, 230), DEEP_GREEN + (255,), radius=58, width=5)
    d.text((260, 950), "红建社区", font=font("title", 108), fill=RED)
    d.text((336, 1074), "清除牛皮癣志愿服务活动", font=font("hei", 58), fill=DEEP_RED)
    d.text((1454, 950), "叶开泰", font=font("title", 118), fill=DEEP_GREEN)
    d.text((1456, 1074), "中医药博物馆参观活动", font=font("hei", 58), fill=DEEP_GREEN)

    left_items = [
        ("集合出发", "佩戴团徽与志愿标识，走进社区服务现场"),
        ("清理小广告", "铲除墙面、门框、公告栏等处城市牛皮癣"),
        ("共护社区", "以实际行动美化公共环境，践行青年担当"),
    ]
    right_items = [
        ("走进药号", "了解叶开泰药号历史与中医药文化脉络"),
        ("参观展陈", "观看药材标本、传统药铺、历史展板"),
        ("沉浸体验", "在闻香、互动桌等环节中感受本草传承"),
    ]
    for i, (head, body) in enumerate(left_items):
        y = 1268 + i * 300
        d.ellipse((238, y, 330, y + 92), fill=RED)
        d.text((269, y + 20), str(i + 1), font=font("hei", 42), fill=WHITE)
        d.text((370, y - 4), head, font=font("hei", 58), fill=DEEP_RED)
        draw_multiline(d, body, (370, y + 72), font("song", 42), INK, 650, line_gap=14)
    for i, (head, body) in enumerate(right_items):
        y = 1268 + i * 300
        d.ellipse((1400, y, 1492, y + 92), fill=DEEP_GREEN)
        d.text((1431, y + 20), str(i + 1), font=font("hei", 42), fill=WHITE)
        d.text((1532, y - 4), head, font=font("hei", 58), fill=DEEP_GREEN)
        draw_multiline(d, body, (1532, y + 72), font("song", 42), INK, 650, line_gap=14)

    d.rounded_rectangle((360, 2216, 956, 2358), radius=44, fill=(178, 40, 48, 230), outline=GOLD, width=4)
    d.text((440, 2253), "志愿服务", font=font("hei", 56), fill=WHITE)
    d.rounded_rectangle((1524, 2216, 2120, 2358), radius=44, fill=(39, 82, 46, 230), outline=GOLD, width=4)
    d.text((1604, 2253), "文化研学", font=font("hei", 56), fill=WHITE)
    rounded_panel(canvas, (442, 2526, 2038, 2824), (255, 252, 242, 225), GOLD + (255,), radius=46, width=4)
    d.text((758, 2576), "活动前宣传 / 集合安排以通知为准", font=font("hei", 56), fill=DEEP_RED)
    draw_multiline(
        d,
        "从社区巷道到本草展厅，在服务中理解责任，在研学中亲近国药。",
        (554, 2674),
        font("kai", 54),
        INK,
        1370,
        line_gap=18,
    )
    paste_alpha(canvas, load_yaoguang(390), (110, 2776), opacity=0.80)
    draw_branch_footer(canvas)
    return canvas


def save_outputs(name: str, img: Image.Image) -> None:
    OUT.mkdir(exist_ok=True)
    PREVIEW.mkdir(exist_ok=True)
    png = OUT / f"{name}.png"
    pdf = OUT / f"{name}.pdf"
    preview = PREVIEW / f"{name}_preview.png"
    img.convert("RGB").save(png, "PNG", dpi=(300, 300))
    img.convert("RGB").save(pdf, "PDF", resolution=300.0)
    img.resize((PREVIEW_W, PREVIEW_H), Image.Resampling.LANCZOS).convert("RGB").save(preview, "PNG")


def make_contact_sheet(items: Iterable[Path]) -> None:
    imgs = [Image.open(p).convert("RGB").resize((PREVIEW_W, PREVIEW_H), Image.Resampling.LANCZOS) for p in items]
    sheet = Image.new("RGB", (PREVIEW_W * len(imgs) + 36 * (len(imgs) + 1), PREVIEW_H + 72), (245, 240, 232))
    x = 36
    for img in imgs:
        sheet.paste(img, (x, 36))
        x += PREVIEW_W + 36
    sheet.save(PREVIEW / "contact_sheet.png", "PNG")


def main() -> None:
    winter = make_winter_poster()
    yekaitai = make_yekaitai_poster()
    save_outputs("光药医路_冬暖青日_宣传海报_A4", winter)
    save_outputs("光药医路_叶开泰之行_宣传海报_A4", yekaitai)
    make_contact_sheet(
        [
            OUT / "光药医路_冬暖青日_宣传海报_A4.png",
            OUT / "光药医路_叶开泰之行_宣传海报_A4.png",
        ]
    )


if __name__ == "__main__":
    main()
