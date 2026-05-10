# 光药医路 v6 image2-first 分层 PPT QA

## 路线确认
- v6 01-07 使用新 image2 母图作为完整视觉母图。
- v6 08-22 直接复用 v4 full_ai_slides/slide_01.png 至 slide_15.png，不重新生成。
- PPTX 使用 python-pptx 生成，不手写完整 OOXML，不写动画 timing XML。
- 每页由多个图片 shape 组合，禁止单页整图拍扁。

## 已检查
- 22 张 full_ai_slides 齐全。
- preview_png/slide_01.png 至 slide_22.png 齐全。
- preview_contact_sheet.png 已生成：`preview_contact_sheet.png`。
- PIL 校验所有母图、层图、预览图可读。
- PIL 校验 PPTX 内 83 个媒体图片可读。
- validate_pptx_package.py 通过 22 页包结构检查。
- 解包检查每页 picture/shape 数量均大于 1。
- layer_manifest.json 覆盖 22 页，共 156 个图层对象。
- v6 05 视频框为独立 video_placeholder 层，bbox 为 x=64,y=72,w=1792,h=1008。
- 每页左上角叠加蓝色标准华中科技大学 LOGO。
- v6 08-22 页码覆盖为 08/22 至 22/22。
- UTF-8/mojibake 扫描检查 v6 文本文件，无命中。
- `git diff --check` 通过。

## 验证缺口
- 当前未执行 PowerPoint 桌面打开测试；如 PowerPoint 提示修复，应记录，不退回整页拍扁路线。

## shape 统计
```json
[
  {
    "slide": 1,
    "pic": 8,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 2,
    "pic": 8,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 3,
    "pic": 8,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 4,
    "pic": 9,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 5,
    "pic": 9,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 6,
    "pic": 8,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 7,
    "pic": 8,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 8,
    "pic": 5,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 9,
    "pic": 5,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 10,
    "pic": 5,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 11,
    "pic": 9,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 12,
    "pic": 7,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 13,
    "pic": 9,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 14,
    "pic": 6,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 15,
    "pic": 8,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 16,
    "pic": 5,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 17,
    "pic": 5,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 18,
    "pic": 7,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 19,
    "pic": 9,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 20,
    "pic": 8,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 21,
    "pic": 5,
    "sp": 0,
    "graphicFrame": 0
  },
  {
    "slide": 22,
    "pic": 5,
    "sp": 0,
    "graphicFrame": 0
  }
]
```
