# -*- coding: utf-8 -*-
import os
import shutil

root = r"c:\Users\Lenovo\Downloads\总结书材料"

chapters = [
    "CH01_封面",
    "CH02_目录",
    "CH03_主题介绍",
    "CH04_看板娘",
    "CH05_三个支部介绍",
    "CH06_人员分工",
    "CH07_初识白_破冰",
    "CH08_思政红_团课",
    "CH09_思政红_志愿服务",
    "CH10_药草绿_嘉年华路演",
    "CH11_药草绿_冬暖青日_宣讲",
    "CH12_药草绿_冬暖青日_家乡考察",
    "CH13_药草绿_叶开泰博物馆",
    "CH14_总结与展望",
    "CH15_封底",
]

# Step 1: 创建素材库并迁移原有文件夹
print("=== Step 1: 创建素材库并迁移 ===")
素材库 = os.path.join(root, "素材库")
os.makedirs(素材库, exist_ok=True)

source_folders = ["01通知文件","02总策划书","03破冰活动","04嘉年华","05冬暖青日","06三月活动","07四月活动","08总结书"]
for folder in source_folders:
    src = os.path.join(root, folder)
    dst = os.path.join(素材库, folder)
    if os.path.exists(src) and not os.path.exists(dst):
        shutil.move(src, dst)
        print(f"  [MOVED] {folder} -> 素材库/{folder}")
    elif os.path.exists(dst):
        print(f"  [SKIP]  {folder} already in 素材库/")
    else:
        print(f"  [MISS]  {folder} not found")

# Step 2: 重命名 08总结书 -> 08人员与合照
old_name = os.path.join(素材库, "08总结书")
new_name = os.path.join(素材库, "08人员与合照")
if os.path.exists(old_name):
    os.rename(old_name, new_name)
    print("  [RENAMED] 08总结书 -> 08人员与合照")

# Step 3: 创建三个渠道文件夹 x 15章
print("\n=== Step 2: 创建三个渠道文件夹 ===")
tools = ["Flow", "NotebookLM", "Antigravity"]
for tool in tools:
    for ch in chapters:
        dirpath = os.path.join(root, tool, ch)
        os.makedirs(dirpath, exist_ok=True)
    print(f"  [CREATED] {tool}/ (15 chapters)")

# Step 4: 创建输出终稿
print("\n=== Step 3: 创建输出终稿 ===")
os.makedirs(os.path.join(root, "输出终稿"), exist_ok=True)
print("  [CREATED] 输出终稿/")

# Step 5: 迁移工具脚本
print("\n=== Step 4: 迁移工具脚本 ===")
工具目录 = os.path.join(root, "工具")
os.makedirs(工具目录, exist_ok=True)
tool_files = ["tree.py", "rename_mapping.csv", "folder_refactor_log.csv", "refactor_folders.py", "restructure.ps1"]
for f in tool_files:
    src = os.path.join(root, f)
    dst = os.path.join(工具目录, f)
    if os.path.exists(src):
        shutil.move(src, dst)
        print(f"  [MOVED] {f} -> 工具/{f}")

# 打印最终结构
print("\n=== 重构完成！最终顶层目录 ===")
for item in sorted(os.listdir(root)):
    full = os.path.join(root, item)
    if os.path.isdir(full):
        sub_count = len(os.listdir(full))
        print(f"  📁 {item}/ ({sub_count} items)")
    else:
        print(f"  📄 {item}")
