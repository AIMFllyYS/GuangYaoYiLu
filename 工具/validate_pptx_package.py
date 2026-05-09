from __future__ import annotations

import argparse
import posixpath
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from PIL import Image


REL_NS = "{http://schemas.openxmlformats.org/package/2006/relationships}"
APP_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/extended-properties}"


def _relationship_base(rel_path: str) -> str:
    if rel_path == "_rels/.rels":
        return ""
    if rel_path.endswith("/_rels/presentation.xml.rels"):
        return "ppt"
    if "/_rels/" in rel_path:
        return rel_path.split("/_rels/", 1)[0]
    return posixpath.dirname(rel_path)


def validate_pptx(pptx_path: Path, expected_slides: int | None = None) -> None:
    if not pptx_path.exists():
        raise FileNotFoundError(pptx_path)

    errors: list[str] = []
    with zipfile.ZipFile(pptx_path) as zf:
        bad = zf.testzip()
        if bad:
            errors.append(f"zip CRC failed at {bad}")

        names = set(zf.namelist())
        required = {
            "[Content_Types].xml",
            "_rels/.rels",
            "ppt/presentation.xml",
            "ppt/_rels/presentation.xml.rels",
            "docProps/app.xml",
        }
        for name in sorted(required - names):
            errors.append(f"missing required package part: {name}")

        slide_names = sorted(
            [name for name in names if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)],
            key=lambda value: int(re.search(r"(\d+)", value).group(1)),
        )
        slide_count = len(slide_names)
        if expected_slides is not None and slide_count != expected_slides:
            errors.append(f"expected {expected_slides} slide parts, found {slide_count}")

        if "[Content_Types].xml" in names:
            content_types = zf.read("[Content_Types].xml").decode("utf-8", errors="replace")
            if "presentationml.presentation.main+xml" not in content_types:
                errors.append("missing presentation content type")
            if '<Default Extension="png" ContentType="image/png"/>' not in content_types:
                errors.append("missing PNG default content type")
            for idx in range(1, slide_count + 1):
                part = f'/ppt/slides/slide{idx}.xml"'
                if part not in content_types:
                    errors.append(f"missing content type override for slide{idx}.xml")

        if "ppt/_rels/presentation.xml.rels" in names:
            rel_xml = ET.fromstring(zf.read("ppt/_rels/presentation.xml.rels"))
            presentation_slide_rels = [
                rel.attrib.get("Target")
                for rel in rel_xml.findall(REL_NS + "Relationship")
                if rel.attrib.get("Type", "").endswith("/slide")
            ]
            if len(presentation_slide_rels) != slide_count:
                errors.append(
                    f"presentation relationship slide count {len(presentation_slide_rels)} != slide parts {slide_count}"
                )

        for rel_path in [name for name in names if name.endswith(".rels")]:
            base = _relationship_base(rel_path)
            root = ET.fromstring(zf.read(rel_path))
            for rel in root.findall(REL_NS + "Relationship"):
                if rel.attrib.get("TargetMode") == "External":
                    errors.append(f"external relationship is not allowed: {rel_path} {rel.attrib.get('Target')}")
                    continue
                target = rel.attrib.get("Target", "")
                target_name = posixpath.normpath(posixpath.join(base, target)).lstrip("/")
                if target_name not in names:
                    errors.append(f"missing relationship target: {rel_path} -> {target} ({target_name})")

        if "docProps/app.xml" in names:
            app_xml = ET.fromstring(zf.read("docProps/app.xml"))
            slides = app_xml.find(APP_NS + "Slides")
            if slides is None:
                errors.append("docProps/app.xml missing Slides count")
            else:
                try:
                    app_slide_count = int(slides.text or "")
                    if app_slide_count != slide_count:
                        errors.append(f"docProps Slides {app_slide_count} != slide parts {slide_count}")
                except ValueError:
                    errors.append(f"docProps Slides is not an integer: {slides.text!r}")

        media_names = sorted(name for name in names if name.startswith("ppt/media/"))
        for media_name in media_names:
            with zf.open(media_name) as stream:
                try:
                    image = Image.open(stream)
                    image.verify()
                    if image.width <= 0 or image.height <= 0:
                        errors.append(f"invalid image dimensions: {media_name}")
                except Exception as exc:
                    errors.append(f"media image cannot be opened: {media_name}: {exc}")

    if errors:
        raise RuntimeError("\n".join(errors))

    print(f"validated: {pptx_path}")
    print(f"slides: {slide_count}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate a PPTX package without launching PowerPoint.")
    parser.add_argument("pptx", type=Path)
    parser.add_argument("--expected-slides", type=int)
    args = parser.parse_args()
    validate_pptx(args.pptx, args.expected_slides)


if __name__ == "__main__":
    main()
