import os

root = r"C:\Users\Lenovo\Downloads\总结书材料"
skip = {"rename.py", "rename.ps1", "README.md"}
lines = []

for dirpath, dirnames, filenames in sorted(os.walk(root)):
    dirnames.sort()
    level = dirpath.replace(root, "").count(os.sep)
    indent = "│   " * level
    basename = os.path.basename(dirpath) if level > 0 else os.path.basename(root)
    lines.append(f"{indent}├── {basename}/")
    sub_indent = "│   " * (level + 1)
    for f in sorted(filenames):
        if level == 0 and f in skip:
            continue
        lines.append(f"{sub_indent}├── {f}")

tree = "\n".join(lines)
readme = f"""# 总结书材料 - 文件目录结构

## 命名规则

所有文件已按 `{{一级文件夹}}-{{二级文件夹}}-...-{{原文件名}}` 格式重命名，通过文件名即可识别其所在的完整目录层级。

## 目录树

```
{tree}
```
"""

with open(os.path.join(root, "README.md"), "w", encoding="utf-8") as f:
    f.write(readme)

print("README.md generated.")
