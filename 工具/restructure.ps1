# 总结书项目重构脚本
$root = "c:\Users\Lenovo\Downloads\总结书材料"
Set-Location $root

# 章节列表
$chapters = @(
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
    "CH15_封底"
)

# 1. 创建素材库
Write-Host "=== Step 1: 创建素材库并迁移原始文件夹 ==="
New-Item -ItemType Directory -Force -Path "素材库" | Out-Null

$sourceFolders = @("01通知文件","02总策划书","03破冰活动","04嘉年华","05冬暖青日","06三月活动","07四月活动","08总结书")
foreach ($folder in $sourceFolders) {
    $srcPath = Join-Path $root $folder
    if (Test-Path $srcPath) {
        Move-Item -Path $srcPath -Destination (Join-Path $root "素材库") -Force
        Write-Host "  [MOVED] $folder -> 素材库/$folder"
    }
}

# 2. 重命名 08总结书 -> 08人员与合照
$oldName = Join-Path $root "素材库\08总结书"
if (Test-Path $oldName) {
    Rename-Item -Path $oldName -NewName "08人员与合照"
    Write-Host "  [RENAMED] 08总结书 -> 08人员与合照"
}

# 3. 创建三个渠道文件夹，每个包含 CH01~CH15
Write-Host "`n=== Step 2: 创建三个渠道文件夹 ==="
$tools = @("Flow", "NotebookLM", "Antigravity")
foreach ($tool in $tools) {
    foreach ($ch in $chapters) {
        $dirPath = Join-Path $root (Join-Path $tool $ch)
        New-Item -ItemType Directory -Force -Path $dirPath | Out-Null
    }
    Write-Host "  [CREATED] $tool/ (15 chapters)"
}

# 4. 创建输出终稿文件夹
Write-Host "`n=== Step 3: 创建输出终稿 ==="
New-Item -ItemType Directory -Force -Path (Join-Path $root "输出终稿") | Out-Null
Write-Host "  [CREATED] 输出终稿/"

# 5. 创建工具文件夹并移入脚本
Write-Host "`n=== Step 4: 迁移工具脚本 ==="
New-Item -ItemType Directory -Force -Path (Join-Path $root "工具") | Out-Null
$toolFiles = @("tree.py", "rename_mapping.csv", "folder_refactor_log.csv")
foreach ($file in $toolFiles) {
    $filePath = Join-Path $root $file
    if (Test-Path $filePath) {
        Move-Item -Path $filePath -Destination (Join-Path $root "工具") -Force
        Write-Host "  [MOVED] $file -> 工具/$file"
    }
}

Write-Host "`n=== 重构完成！ ==="
Write-Host "新目录结构："
Get-ChildItem $root -Directory | ForEach-Object { Write-Host "  $($_.Name)/" }
