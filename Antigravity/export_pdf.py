import os
from pathlib import Path
from PIL import Image

def export_to_pdf(output_base_dir: str, pdf_filename: str):
    print(f"正在扫描 {output_base_dir} 下的所有生成的页面...")
    base_path = Path(output_base_dir)
    
    # 收集所有的页面图片
    all_pages = []
    for root, _, files in os.walk(base_path):
        for f in files:
            if f.endswith(".png") and f.startswith("page_"):
                all_pages.append(Path(root) / f)
                
    if not all_pages:
        print("未找到任何页面！请先运行 compositor.py (不要带 --preview)")
        return
        
    # 按页码排序
    all_pages.sort(key=lambda p: p.name)
    print(f"找到 {len(all_pages)} 页，准备合成 PDF...")
    
    images = []
    first_image = None
    
    for i, p in enumerate(all_pages):
        img = Image.open(p).convert("RGB")
        if i == 0:
            first_image = img
        else:
            images.append(img)
        print(f"  合并: {p.name}")
        
    print(f"\n正在导出为 {pdf_filename} ... (这可能需要一分钟左右)")
    first_image.save(
        pdf_filename,
        "PDF",
        resolution=100.0,
        save_all=True,
        append_images=images
    )
    print("✅ 导出成功！")

if __name__ == "__main__":
    export_to_pdf(
        r"c:\Users\Lenovo\Downloads\总结书材料\输出终稿",
        r"c:\Users\Lenovo\Downloads\总结书材料\光药医路_最终版_76P.pdf"
    )
