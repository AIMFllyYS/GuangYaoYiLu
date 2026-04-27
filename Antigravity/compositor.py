"""
光药医路 · 总结书页面合成引擎
=================================
使用 Pillow 将 AI 生成的背景图与真实照片、文字合成为高清 A4 页面。

用法：
    python compositor.py              # 合成全部页面
    python compositor.py --chapter 7  # 只合成第7章
    python compositor.py --preview    # 预览模式（低分辨率快速查看）
"""

import json
import os
import sys
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# ============================================================
# 全局常量
# ============================================================

# A4 尺寸 @300dpi
A4_WIDTH = 2480
A4_HEIGHT = 3508

# 预览模式尺寸（1/3）
PREVIEW_WIDTH = 827
PREVIEW_HEIGHT = 1169

# 色彩体系
COLORS = {
    "warm_white": (245, 240, 235),    # #F5F0EB
    "chinese_red": (196, 30, 58),     # #C41E3A
    "ink_green": (45, 90, 39),        # #2D5A27
    "gold": (196, 163, 90),           # #C4A35A
    "text_black": (40, 40, 40),       # 正文色
    "text_gray": (100, 100, 100),     # 副标题色
    "note_bg": (255, 248, 235),       # 便签条底色
    "white": (255, 255, 255),
    "shadow": (0, 0, 0),
}

# 字体路径
FONTS = {
    "handwriting": "C:/Windows/Fonts/STXINGKA.TTF",  # 华文行楷（手写感悟）
    "kai": "C:/Windows/Fonts/simkai.ttf",             # 楷体（副标题）
    "song": "C:/Windows/Fonts/simsun.ttc",            # 宋体（正文）
    "hei": "C:/Windows/Fonts/simhei.ttf",             # 黑体（标题）
    "yahei": "C:/Windows/Fonts/msyh.ttc",             # 微软雅黑（数据）
    "fangsong": "C:/Windows/Fonts/simfang.ttf",       # 仿宋
}

# 项目路径
BASE_DIR = Path(__file__).parent.parent  # 总结书材料/
素材库 = BASE_DIR / "素材库"
ANTIGRAVITY = BASE_DIR / "Antigravity"
OUTPUT_DIR = BASE_DIR / "输出终稿"


# ============================================================
# 字体缓存
# ============================================================

_font_cache = {}

def get_font(font_key: str, size: int) -> ImageFont.FreeTypeFont:
    """获取字体，带缓存"""
    cache_key = (font_key, size)
    if cache_key not in _font_cache:
        font_path = FONTS.get(font_key, font_key)  # 也支持直接传路径
        _font_cache[cache_key] = ImageFont.truetype(font_path, size)
    return _font_cache[cache_key]


# ============================================================
# 核心合成函数
# ============================================================

def create_canvas(width=A4_WIDTH, height=A4_HEIGHT, bg_color=COLORS["warm_white"]):
    """创建空白画布"""
    return Image.new("RGBA", (width, height), bg_color + (255,))


def load_and_resize_bg(bg_path: str, width=A4_WIDTH, height=A4_HEIGHT) -> Image.Image:
    """加载背景图并缩放到 A4 尺寸"""
    bg = Image.open(bg_path).convert("RGBA")
    bg = bg.resize((width, height), Image.LANCZOS)
    return bg


def add_photo_with_frame(
    canvas: Image.Image,
    photo_path: str,
    x: int, y: int,
    w: int, h: int,
    rotation: float = 0,
    frame_style: str = "white_border",
    border_width: int = 12,
    shadow_offset: int = 8,
    shadow_blur: int = 15,
    corner_radius: int = 0,
):
    """
    在画布上贴入一张真实照片，带相框效果。
    
    frame_style:
        - "white_border": 简约白框 + 阴影
        - "polaroid": 拍立得（底部加宽留给图注）
        - "rounded": 圆角卡片
        - "no_frame": 无框直接贴
    """
    # 加载并裁切/缩放照片
    photo = Image.open(photo_path).convert("RGBA")
    photo = smart_crop_resize(photo, w, h)
    
    if frame_style == "no_frame":
        # 无框直接贴
        frame_img = photo
    elif frame_style == "polaroid":
        # 拍立得风格：上/左/右细边，底部宽边
        top_border = border_width
        side_border = border_width
        bottom_border = border_width * 5  # 底部加宽
        fw = w + side_border * 2
        fh = h + top_border + bottom_border
        frame_img = Image.new("RGBA", (fw, fh), COLORS["white"] + (255,))
        frame_img.paste(photo, (side_border, top_border))
    elif frame_style == "rounded":
        # 圆角卡片
        frame_img = _add_rounded_corners(photo, corner_radius or 20)
    else:  # white_border
        bw = border_width
        fw = w + bw * 2
        fh = h + bw * 2
        frame_img = Image.new("RGBA", (fw, fh), COLORS["white"] + (255,))
        frame_img.paste(photo, (bw, bw))
    
    # 旋转
    if rotation != 0:
        frame_img = frame_img.rotate(rotation, expand=True, resample=Image.BICUBIC,
                                      fillcolor=(0, 0, 0, 0))
    
    # 创建阴影
    if frame_style != "no_frame" and shadow_offset > 0:
        shadow = Image.new("RGBA", frame_img.size, (0, 0, 0, 0))
        shadow_layer = Image.new("RGBA", frame_img.size, (0, 0, 0, 60))
        # 使用 frame 的 alpha 作为 mask
        shadow.paste(shadow_layer, mask=frame_img.split()[3])
        shadow = shadow.filter(ImageFilter.GaussianBlur(shadow_blur))
        
        # 贴阴影
        canvas.paste(
            shadow,
            (x + shadow_offset, y + shadow_offset),
            mask=shadow.split()[3]
        )
    
    # 贴照片+框
    canvas.paste(frame_img, (x, y), mask=frame_img.split()[3])
    
    return canvas


def smart_crop_resize(img: Image.Image, target_w: int, target_h: int) -> Image.Image:
    """智能裁切+缩放：保持原图比例，中心裁切到目标尺寸"""
    orig_w, orig_h = img.size
    target_ratio = target_w / target_h
    orig_ratio = orig_w / orig_h
    
    if orig_ratio > target_ratio:
        # 原图更宽，按高度缩放后裁切两侧
        new_h = orig_h
        new_w = int(orig_h * target_ratio)
        left = (orig_w - new_w) // 2
        img = img.crop((left, 0, left + new_w, new_h))
    else:
        # 原图更高，按宽度缩放后裁切上下
        new_w = orig_w
        new_h = int(orig_w / target_ratio)
        top = (orig_h - new_h) // 2
        img = img.crop((0, top, new_w, top + new_h))
    
    return img.resize((target_w, target_h), Image.LANCZOS)


def _add_rounded_corners(img: Image.Image, radius: int) -> Image.Image:
    """给图片添加圆角"""
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), img.size], radius, fill=255)
    result = Image.new("RGBA", img.size, (0, 0, 0, 0))
    result.paste(img, mask=mask)
    return result


# ============================================================
# 文字渲染
# ============================================================

def draw_text_centered(
    canvas: Image.Image,
    text: str,
    y: int,
    font_key: str = "hei",
    font_size: int = 80,
    color: tuple = None,
    max_width: int = None,
):
    """在画布上水平居中绘制文字"""
    if color is None:
        color = COLORS["text_black"]
    draw = ImageDraw.Draw(canvas)
    font = get_font(font_key, font_size)
    bbox = font.getbbox(text)
    text_w = bbox[2] - bbox[0]
    x = (canvas.width - text_w) // 2
    draw.text((x, y), text, font=font, fill=color + (255,))
    return canvas


def draw_text_block(
    canvas: Image.Image,
    text: str,
    x: int, y: int,
    max_width: int,
    font_key: str = "song",
    font_size: int = 42,
    color: tuple = None,
    line_spacing: float = 1.6,
):
    """绘制自动换行的文字块，支持简单的层级和Markdown语法，返回最终 y 坐标"""
    if color is None:
        color = COLORS["text_black"]
    draw = ImageDraw.Draw(canvas)
    
    font_body = get_font(font_key, font_size)
    font_h2 = get_font("hei", int(font_size * 1.3))
    font_bold = get_font("hei", font_size)
    font_toc_part = get_font("kai", int(font_size * 1.2))
    
    current_y = y
    
    for paragraph in text.split("\n"):
        if not paragraph.strip():
            current_y += int(font_size * line_spacing * 0.5)
            continue
            
        p_text = paragraph.strip()
        font = font_body
        text_color = color + (255,)
        
        # 简单层级解析
        if p_text.startswith("## "):
            font = font_h2
            p_text = p_text[3:]
            current_y += 20
        elif p_text.startswith("**") and p_text.endswith("**"):
            font = font_bold
            p_text = p_text[2:-2]
        elif p_text.startswith("第一篇") or p_text.startswith("第二篇") or p_text.startswith("第三篇"):
            font = font_toc_part
            text_color = COLORS["chinese_red"] + (255,)
            current_y += 40
        elif p_text.startswith("CH") and "  " in p_text: # 目录项
            font = font_bold
        elif " · " in p_text and len(p_text) < 20 and not p_text.endswith("。"): # 短标题
            font = font_h2
            current_y += 20
        elif p_text.startswith("· "):
            p_text = "  " + p_text # 缩进
            
        # 自动换行
        lines = []
        current_line = ""
        for char in p_text:
            test_line = current_line + char
            bbox = font.getbbox(test_line)
            if bbox[2] - bbox[0] > max_width:
                lines.append(current_line)
                current_line = char
            else:
                current_line = test_line
        if current_line:
            lines.append(current_line)
        
        line_height = int(font.size * line_spacing)
        for line in lines:
            draw.text((x, current_y), line, font=font, fill=text_color)
            current_y += line_height
            
        current_y += int(font.size * 0.5) # 段落间距
    
    return current_y


def draw_testimony_note(
    canvas: Image.Image,
    quote: str,
    author: str,
    x: int, y: int,
    width: int = 900,
    rotation: float = 0,
    note_color: tuple = None,
):
    """绘制手写体便签条"""
    if note_color is None:
        note_color = COLORS["note_bg"]
    
    font = get_font("handwriting", 44)
    
    # 计算所需高度
    lines = _wrap_text(quote, font, width - 80)
    line_height = int(44 * 1.8)
    text_height = len(lines) * line_height + 120  # 上下 padding
    
    # 创建便签条
    note = Image.new("RGBA", (width, text_height), note_color + (240,))
    note_draw = ImageDraw.Draw(note)
    
    # 左边装饰竖线
    note_draw.line([(30, 20), (30, text_height - 20)], fill=COLORS["gold"] + (180,), width=3)
    
    # 写入文字
    cy = 40
    for line in lines:
        note_draw.text((50, cy), line, font=font, fill=COLORS["text_black"] + (230,))
        cy += line_height
    
    # 签名
    author_font = get_font("kai", 38)
    note_draw.text((width - 50 - len(author) * 38, cy), author,
                   font=author_font, fill=COLORS["text_gray"] + (220,))
    
    # 旋转
    if rotation != 0:
        note = note.rotate(rotation, expand=True, resample=Image.BICUBIC,
                           fillcolor=(0, 0, 0, 0))
    
    # 添加阴影
    shadow = Image.new("RGBA", note.size, (0, 0, 0, 0))
    shadow_layer = Image.new("RGBA", note.size, (0, 0, 0, 40))
    shadow.paste(shadow_layer, mask=note.split()[3])
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    canvas.paste(shadow, (x + 6, y + 6), mask=shadow.split()[3])
    
    # 贴便签
    canvas.paste(note, (x, y), mask=note.split()[3])
    
    return y + note.height + 30


def _wrap_text(text: str, font, max_width: int) -> list:
    """文字按字符换行"""
    lines = []
    for paragraph in text.split("\n"):
        if not paragraph.strip():
            lines.append("")
            continue
        current = ""
        for char in paragraph:
            test = current + char
            bbox = font.getbbox(test)
            if bbox[2] - bbox[0] > max_width:
                lines.append(current)
                current = char
            else:
                current = test
        if current:
            lines.append(current)
    return lines


def draw_page_number(canvas: Image.Image, page_num: int, total_pages: int):
    """绘制右下角页码"""
    draw = ImageDraw.Draw(canvas)
    font = get_font("yahei", 32)
    text = f"{page_num}/{total_pages}"
    bbox = font.getbbox(text)
    text_w = bbox[2] - bbox[0]
    x = canvas.width - text_w - 80
    y = canvas.height - 80
    draw.text((x, y), text, font=font, fill=COLORS["text_gray"] + (180,))


# ============================================================
# 高级合成函数（按页面类型）
# ============================================================

def compose_chapter_cover(
    bg_path: str,
    title: str,
    subtitle: str = "",
    quote: str = "",
    color_theme: tuple = None,
    page_num: int = 1,
    total_pages: int = 83,
) -> Image.Image:
    """合成章节封面页"""
    canvas = load_and_resize_bg(bg_path)
    
    title_color = color_theme or COLORS["text_black"]
    
    # 标题（大字居中）
    draw_text_centered(canvas, title, y=A4_HEIGHT // 3,
                       font_key="handwriting", font_size=140,
                       color=title_color)
    
    # 副标题
    if subtitle:
        draw_text_centered(canvas, subtitle, y=A4_HEIGHT // 3 + 200,
                           font_key="kai", font_size=60,
                           color=COLORS["text_gray"])
    
    # 引言
    if quote:
        draw_text_block(canvas, quote,
                        x=200, y=A4_HEIGHT * 2 // 3,
                        max_width=A4_WIDTH - 400,
                        font_key="fangsong", font_size=38,
                        color=COLORS["text_gray"])
    
    draw_page_number(canvas, page_num, total_pages)
    return canvas


def compose_photo_page(
    bg_path: str,
    photos: list,
    title: str = "",
    caption: str = "",
    page_num: int = 1,
    total_pages: int = 83,
) -> Image.Image:
    """
    合成照片展示页。
    
    photos: [{"path": str, "x": int, "y": int, "w": int, "h": int, 
              "rotation": float, "frame": str}, ...]
    """
    canvas = load_and_resize_bg(bg_path)
    
    # 页面标题（如果有）
    if title:
        draw_text_centered(canvas, title, y=80,
                           font_key="kai", font_size=56,
                           color=COLORS["text_black"])
    
    # 贴入每张照片
    for photo_cfg in photos:
        add_photo_with_frame(
            canvas,
            photo_path=photo_cfg["path"],
            x=photo_cfg.get("x", 100),
            y=photo_cfg.get("y", 200),
            w=photo_cfg.get("w", 1000),
            h=photo_cfg.get("h", 750),
            rotation=photo_cfg.get("rotation", 0),
            frame_style=photo_cfg.get("frame", "white_border"),
        )
    
    # 图注
    if caption:
        draw_text_block(canvas, caption,
                        x=150, y=A4_HEIGHT - 350,
                        max_width=A4_WIDTH - 300,
                        font_key="kai", font_size=36,
                        color=COLORS["text_gray"])
    
    draw_page_number(canvas, page_num, total_pages)
    return canvas


def compose_testimony_page(
    bg_path: str,
    title: str,
    testimonies: list,
    page_num: int = 1,
    total_pages: int = 83,
) -> Image.Image:
    """
    合成感悟页。
    
    testimonies: [{"quote": str, "author": str, "x": int, "y": int,
                   "rotation": float, "width": int}, ...]
    """
    canvas = load_and_resize_bg(bg_path)
    
    # 小标题
    if title:
        draw_text_centered(canvas, title, y=120,
                           font_key="kai", font_size=60,
                           color=COLORS["text_black"])
    
    # 绘制每个便签条
    for t in testimonies:
        draw_testimony_note(
            canvas,
            quote=t["quote"],
            author=t["author"],
            x=t.get("x", 150),
            y=t.get("y", 300),
            width=t.get("width", 1000),
            rotation=t.get("rotation", 0),
        )
    
    draw_page_number(canvas, page_num, total_pages)
    return canvas


# ============================================================
# 页面配置加载与批量合成
# ============================================================

def load_chapter_config(chapter_dir: Path) -> dict:
    """加载章节配置文件"""
    config_path = chapter_dir / "config.json"
    if not config_path.exists():
        return None
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


def compose_chapter(chapter_dir: Path, output_dir: Path, preview=False):
    """合成一个章节的所有页面"""
    config = load_chapter_config(chapter_dir)
    if not config:
        print(f"  ⚠️  跳过 {chapter_dir.name}：没有 config.json")
        return []
    
    output_dir.mkdir(parents=True, exist_ok=True)
    results = []
    
    for page_cfg in config.get("pages", []):
        page_num = page_cfg["page_num"]
        page_type = page_cfg["type"]
        bg_path = _resolve_path(chapter_dir, page_cfg["background"])
        
        print(f"  📄 正在合成第 {page_num} 页（{page_type}）...")
        
        if page_type == "cover":
            img = compose_chapter_cover(
                bg_path=bg_path,
                title=page_cfg.get("title", ""),
                subtitle=page_cfg.get("subtitle", ""),
                quote=page_cfg.get("quote", ""),
                color_theme=tuple(page_cfg["color_theme"]) if "color_theme" in page_cfg else None,
                page_num=page_num,
                total_pages=config.get("total_pages", 83),
            )
        elif page_type == "photo":
            # 解析照片路径（支持相对路径）
            photos = []
            for p in page_cfg.get("photos", []):
                photo = dict(p)
                photo["path"] = _resolve_path(chapter_dir, photo["path"])
                photos.append(photo)
            
            img = compose_photo_page(
                bg_path=bg_path,
                photos=photos,
                title=page_cfg.get("title", ""),
                caption=page_cfg.get("caption", ""),
                page_num=page_num,
                total_pages=config.get("total_pages", 83),
            )
        elif page_type == "testimony":
            img = compose_testimony_page(
                bg_path=bg_path,
                title=page_cfg.get("title", ""),
                testimonies=page_cfg.get("testimonies", []),
                page_num=page_num,
                total_pages=config.get("total_pages", 83),
            )
        elif page_type == "text":
            img = load_and_resize_bg(bg_path)
            
            # 针对不同背景图调整文字排版区域
            body_x = 300
            body_y = 450
            max_w = A4_WIDTH - 600
            title_y = 180
            title_size = 100
            
            if "timeline_bg" in bg_path:
                body_x = 850
                max_w = A4_WIDTH - 1050
                title_y = 120
                body_y = 350
            elif "character_bg" in bg_path or "data_infographic_bg" in bg_path:
                title_size = 80
            
            if page_cfg.get("title"):
                draw_text_centered(img, page_cfg["title"], y=title_y,
                                   font_key="handwriting", font_size=title_size,
                                   color=COLORS["text_black"])
            if page_cfg.get("body"):
                draw_text_block(img, page_cfg["body"],
                                x=body_x, y=body_y,
                                max_width=max_w,
                                font_key="song", font_size=42,
                                color=COLORS["text_black"])
            draw_page_number(img, page_num, config.get("total_pages", 83))
        else:
            print(f"  ⚠️  未知页面类型: {page_type}")
            continue
        
        # 预览模式缩小
        if preview:
            img = img.resize((PREVIEW_WIDTH, PREVIEW_HEIGHT), Image.LANCZOS)
        
        # 保存
        out_name = f"page_{page_num:03d}.png"
        out_path = output_dir / out_name
        img.convert("RGB").save(str(out_path), "PNG", quality=95)
        results.append(str(out_path))
        print(f"  ✅ 已保存: {out_path}")
    
    return results


def _resolve_path(chapter_dir: Path, rel_path: str) -> str:
    """解析路径：支持 素材库/、_shared/、绝对路径、相对于章节目录的路径"""
    if rel_path.startswith("素材库/"):
        return str(BASE_DIR / rel_path)
    elif rel_path.startswith("_shared/"):
        return str(ANTIGRAVITY / rel_path)
    elif os.path.isabs(rel_path):
        return rel_path
    else:
        return str(chapter_dir / rel_path)


# ============================================================
# 主入口
# ============================================================

def main():
    preview = "--preview" in sys.argv
    chapter_filter = None
    
    for i, arg in enumerate(sys.argv):
        if arg == "--chapter" and i + 1 < len(sys.argv):
            chapter_filter = int(sys.argv[i + 1])
    
    output_base = OUTPUT_DIR if not preview else (ANTIGRAVITY / "_preview")
    output_base.mkdir(parents=True, exist_ok=True)
    
    # 遍历所有章节目录
    chapter_dirs = sorted([d for d in ANTIGRAVITY.iterdir() if d.is_dir() and d.name.startswith("CH")])
    
    all_results = []
    for chapter_dir in chapter_dirs:
        ch_num = int(chapter_dir.name[2:4])
        if chapter_filter and ch_num != chapter_filter:
            continue
        
        print(f"\n📖 正在处理 {chapter_dir.name}...")
        chapter_output = output_base / chapter_dir.name
        results = compose_chapter(chapter_dir, chapter_output, preview=preview)
        all_results.extend(results)
    
    print(f"\n🎉 合成完成！共生成 {len(all_results)} 页")
    print(f"📁 输出目录: {output_base}")


if __name__ == "__main__":
    main()
