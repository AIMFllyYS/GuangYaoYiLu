"""
Detect photo placeholder frame positions in slides by finding
white/bright rectangular regions that match photo dimensions.

Correct mapping: layers/slide_NN → full-all-slides/new_(NN+7).png
Confirmed by photo count matching frame count in each slide.
"""
from PIL import Image
import numpy as np
import os, json
from pathlib import Path

_REPO = Path(__file__).resolve().parent
_QUICK = _REPO / "交付物" / "快速答辩"
SLIDES_DIR = str(_QUICK / "full-all-slides")
LAYERS_DIR = str(_QUICK / "layers")

# (layer_folder_num, new_slide_num) pairs for photo slides only
# offset = +7 (verified by photo count <-> frame count matching)
PHOTO_SLIDES = [
    ('04', '11'),   # 三支部总览: 3 frames ↔ 3 photos
    ('07', '14'),   # 初识白:     4 frames ↔ 4 photos
    ('08', '15'),   # 思政红团课: 2 frames ↔ 2 photos
    ('09', '16'),   # 思政红志愿: 4 frames ↔ 4 photos
    ('10', '17'),   # 药草绿嘉年华: 1 frame ↔ 1 photo
    ('11', '18'),   # to detect
    ('12', '19'),   # to detect
    ('13', '20'),   # to detect
    ('14', '21'),   # to detect
]

def get_photo_sizes(layer_num):
    d = os.path.join(LAYERS_DIR, f'slide_{layer_num}')
    photos = sorted([f for f in os.listdir(d) if 'photo' in f])
    sizes = []
    for p in photos:
        with Image.open(os.path.join(d, p)) as img:
            sizes.append((p, img.size))
    return sizes

def find_bright_blobs(arr, threshold_r=228, threshold_g=222, threshold_b=210):
    """Find pixels that are significantly brighter than the beige background."""
    r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
    mask = (r > threshold_r) & (g > threshold_g) & (b > threshold_b)
    return mask

def find_best_rect(mask, target_w, target_h, tolerance=30):
    """
    Scan the mask to find a rectangular region of approximately target_w x target_h
    with high bright-pixel density.
    """
    H, W = mask.shape
    # Compute integral image for fast area sums
    integral = np.cumsum(np.cumsum(mask.astype(np.int32), axis=0), axis=1)
    
    best_score = -1
    best_pos = (0, 0)
    
    step = 10  # scan step for speed
    tw, th = target_w, target_h
    
    for y in range(0, H - th, step):
        for x in range(0, W - tw, step):
            # Sum of bright pixels in this rect
            y2, x2 = y + th - 1, x + tw - 1
            if y2 >= H or x2 >= W:
                continue
            total = integral[y2, x2]
            if y > 0:
                total -= integral[y-1, x2]
            if x > 0:
                total -= integral[y2, x-1]
            if y > 0 and x > 0:
                total += integral[y-1, x-1]
            score = total / (tw * th)
            if score > best_score:
                best_score = score
                best_pos = (x, y)
    
    return best_pos, best_score

results = {}

for layer_num, new_num in PHOTO_SLIDES:
    img_path = os.path.join(SLIDES_DIR, f'new{new_num}.png')
    if not os.path.exists(img_path):
        print(f'SKIP: new{new_num}.png not found')
        continue
    
    photo_sizes = get_photo_sizes(layer_num)
    print(f'\n=== layer_{layer_num} -> new{new_num}.png (canvas 1672x941) ===')
    print(f'  photos: {[(p, s) for p, s in photo_sizes]}')
    
    img = Image.open(img_path).convert('RGB')
    arr = np.array(img)
    mask = find_bright_blobs(arr)
    bright_ratio = mask.mean()
    print(f'  bright pixel ratio: {bright_ratio:.3f}')
    
    slide_placements = []
    used_regions = np.zeros_like(mask, dtype=bool)
    
    for fname, (pw, ph) in photo_sizes:
        search_mask = mask & ~used_regions
        pos, score = find_best_rect(search_mask, pw, ph)
        x, y = pos
        print(f'  {fname} ({pw}x{ph}) -> best pos x={x}, y={y}, score={score:.3f}')
        used_regions[y:y+ph, x:x+pw] = True
        slide_placements.append({
            'file': fname,
            'x': x, 'y': y, 'w': pw, 'h': ph
        })
    
    results[layer_num] = slide_placements

print('\n\n=== FINAL PLACEMENTS JSON (key=layer_num) ===')
print(json.dumps(results, indent=2))
