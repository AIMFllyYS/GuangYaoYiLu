#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


PML_NS = "http://schemas.openxmlformats.org/presentationml/2006/main"
AML_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
NS = {"p": PML_NS, "a": AML_NS, "rel": REL_NS}
TEXT_EXTS = {".md", ".json", ".csv", ".txt", ".xml", ".rels", ".py", ".yaml", ".yml"}
MOJIBAKE_PATTERNS = ["\ufffd", "\u00c3", "\u00c2", "\u00e5", "\u00e6", "\u00e7", "\u00e8", "\u00e9"]


def read_zip_xml(package: zipfile.ZipFile, name: str) -> ET.Element:
    return ET.fromstring(package.read(name))


def relationship_targets(package: zipfile.ZipFile, rel_name: str) -> list[str]:
    if rel_name not in package.namelist():
        return []
    root = read_zip_xml(package, rel_name)
    base = Path(rel_name).parent
    if base.name == "_rels":
        base = base.parent
    targets = []
    for rel in root.findall("rel:Relationship", NS):
        target = rel.attrib.get("Target", "")
        mode = rel.attrib.get("TargetMode", "")
        if mode == "External":
            targets.append(f"EXTERNAL:{target}")
            continue
        if target.startswith("/"):
            resolved = target.lstrip("/")
        else:
            resolved = str((base / target).as_posix())
        targets.append(resolved)
    return targets


def slide_stats(package: zipfile.ZipFile, slide_name: str) -> dict[str, int]:
    root = read_zip_xml(package, slide_name)
    text = "".join(node.text or "" for node in root.findall(".//a:t", NS))
    return {
        "pic": len(root.findall(".//p:pic", NS)),
        "sp": len(root.findall(".//p:sp", NS)),
        "graphicFrame": len(root.findall(".//p:graphicFrame", NS)),
        "text_chars": len(text),
    }


def check_images(package: zipfile.ZipFile, names: list[str]) -> list[str]:
    try:
        from PIL import Image
    except Exception:
        return ["Pillow not available; skipped media image decode"]
    errors = []
    for name in names:
        try:
            with package.open(name) as f:
                image = Image.open(f)
                image.verify()
        except Exception as exc:
            errors.append(f"{name}: {exc}")
    return errors


def scan_utf8(root: Path) -> list[str]:
    findings = []
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTS:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError as exc:
            findings.append(f"{path}: not valid UTF-8 ({exc})")
            continue
        for pattern in MOJIBAKE_PATTERNS:
            if pattern in text:
                findings.append(f"{path}: suspicious mojibake fragment {pattern!r}")
                break
    return findings


def validate(path: Path, expected_slides: int | None, scan_text_root: Path | None, strict_final: bool) -> dict:
    report: dict = {
        "pptx": str(path),
        "errors": [],
        "warnings": [],
        "strict_errors": [],
        "slides": [],
    }
    with zipfile.ZipFile(path) as package:
        bad = package.testzip()
        if bad:
            report["errors"].append(f"ZIP CRC failed at {bad}")
        names = set(package.namelist())
        required = ["[Content_Types].xml", "_rels/.rels", "ppt/presentation.xml", "ppt/_rels/presentation.xml.rels"]
        for name in required:
            if name not in names:
                report["errors"].append(f"Missing required part: {name}")

        preferred = ["ppt/presProps.xml", "ppt/theme/theme1.xml"]
        for name in preferred:
            if name not in names:
                message = f"Missing preferred part: {name}"
                report["warnings"].append(message)
                if strict_final:
                    report["strict_errors"].append(message)
        if not any(n.startswith("ppt/slideMasters/") for n in names):
            message = "No slide master part found"
            report["warnings"].append(message)
            if strict_final:
                report["strict_errors"].append(message)
        if not any(n.startswith("ppt/slideLayouts/") for n in names):
            message = "No slide layout part found"
            report["warnings"].append(message)
            if strict_final:
                report["strict_errors"].append(message)

        slide_names = sorted(
            [n for n in names if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)],
            key=lambda n: int(re.search(r"slide(\d+)\.xml", n).group(1)),  # type: ignore[union-attr]
        )
        report["slide_count"] = len(slide_names)
        if expected_slides is not None and len(slide_names) != expected_slides:
            report["errors"].append(f"Expected {expected_slides} slides, found {len(slide_names)}")

        targets = relationship_targets(package, "ppt/_rels/presentation.xml.rels")
        for target in targets:
            if target.startswith("EXTERNAL:"):
                message = f"External relationship: {target[9:]}"
                report["warnings"].append(message)
                if strict_final:
                    report["strict_errors"].append(message)
            elif target not in names:
                report["errors"].append(f"Broken relationship target: {target}")

        media_names = sorted(n for n in names if n.startswith("ppt/media/"))
        image_errors = check_images(package, media_names)
        report["media_count"] = len(media_names)
        for error in image_errors:
            report["warnings"].append(error)

        forbidden = ["校徽位置预留区", "页码", "XX/22", "第X页"]
        total_text_chars = 0
        total_sp = 0
        single_image_slides = []
        for slide_name in slide_names:
            stats = slide_stats(package, slide_name)
            total_text_chars += int(stats["text_chars"])
            total_sp += int(stats["sp"])
            if stats["pic"] == 1 and stats["sp"] == 0 and stats["graphicFrame"] == 0:
                single_image_slides.append(slide_name)
            root = read_zip_xml(package, slide_name)
            all_text = "".join(node.text or "" for node in root.findall(".//a:t", NS))
            for item in forbidden:
                if item in all_text:
                    report["errors"].append(f"{slide_name} contains forbidden text: {item}")
            report["slides"].append({"file": slide_name, **stats})

        report["shape_totals"] = {
            "pic": sum(int(item["pic"]) for item in report["slides"]),
            "sp": total_sp,
            "graphicFrame": sum(int(item["graphicFrame"]) for item in report["slides"]),
            "text_chars": total_text_chars,
            "single_image_slide_count": len(single_image_slides),
        }
        if strict_final and total_text_chars == 0:
            report["strict_errors"].append("No native text found in slide XML")
        if strict_final and single_image_slides:
            report["strict_errors"].append(f"Single-image slides found: {', '.join(single_image_slides)}")

    if scan_text_root:
        findings = scan_utf8(scan_text_root)
        report["utf8_findings"] = findings
        if findings:
            report["warnings"].extend(findings)

    report["baseline_ok"] = not report["errors"]
    report["strict_ok"] = report["baseline_ok"] and not report["strict_errors"] if strict_final else None
    report["ok"] = report["strict_ok"] if strict_final else report["baseline_ok"]
    return report


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Validate a PPTX artifact for baseline package and content health.")
    parser.add_argument("pptx", help="PPTX file to validate")
    parser.add_argument("--expected-slides", type=int)
    parser.add_argument("--scan-text-root", help="Optional directory to scan for UTF-8/mojibake issues")
    parser.add_argument("--strict-final", action="store_true", help="Promote final-delivery issues to strict errors")
    args = parser.parse_args()

    report = validate(
        Path(args.pptx).resolve(),
        args.expected_slides,
        Path(args.scan_text_root).resolve() if args.scan_text_root else None,
        args.strict_final,
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))
    raise SystemExit(0 if report["ok"] else 1)


if __name__ == "__main__":
    main()
