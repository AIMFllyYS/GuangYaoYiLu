"""重新编号全书页码 + 统一背景路径"""
import json, os

base = r"c:\Users\Lenovo\Downloads\总结书材料\Antigravity"
chapters = sorted([d for d in os.listdir(base) if d.startswith("CH") and os.path.isdir(os.path.join(base, d))])

page_counter = 1
total_pages = 0

# First pass: count total pages
for ch in chapters:
    cfg_path = os.path.join(base, ch, "config.json")
    if not os.path.exists(cfg_path):
        continue
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    total_pages += len(cfg.get("pages", []))

print(f"Total pages: {total_pages}")

# Second pass: renumber and fix paths
page_counter = 1
for ch in chapters:
    cfg_path = os.path.join(base, ch, "config.json")
    if not os.path.exists(cfg_path):
        continue
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    
    cfg["total_pages"] = total_pages
    ch_start = page_counter
    for page in cfg.get("pages", []):
        page["page_num"] = page_counter
        page_counter += 1
        # Fix CH07 local paths to _shared/
        bg = page.get("background", "")
        if bg == "cover.png":
            page["background"] = "_shared/white_cover_bg.png"
        elif bg == "photo_bg.png":
            page["background"] = "_shared/white_photo_bg.png"
        elif bg == "testimony_bg.png":
            page["background"] = "_shared/white_testimony_bg.png"
    
    with open(cfg_path, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)
    
    print(f"  {ch}: pages {ch_start}-{page_counter-1} ({len(cfg['pages'])} pages)")

print(f"\nDone! {page_counter-1} pages total")
