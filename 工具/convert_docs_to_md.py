from markitdown import MarkItDown
import os

md = MarkItDown()

def convert_to_md(filepath):
    try:
        result = md.convert(filepath)
        output_path = os.path.splitext(filepath)[0] + ".md"
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(result.text_content)
        print(f"[OK] Converted: {filepath}")
    except Exception as e:
        print(f"[FAILED] Failed to convert {filepath}: {e}")

if __name__ == "__main__":
    # Get absolute path to '素材库'
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "素材库"))
    files_to_convert = []
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.lower().endswith(('.docx', '.pdf')):
                files_to_convert.append(os.path.join(root, file))
                
    print(f"Found {len(files_to_convert)} files to convert.")
    
    for i, f in enumerate(files_to_convert):
        print(f"[{i+1}/{len(files_to_convert)}] Processing...")
        convert_to_md(f)
        
    print("All conversions completed!")
