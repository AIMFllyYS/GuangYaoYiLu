#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
from datetime import datetime
from pathlib import Path


DEFAULT_DIRS = [
    "00_input/requirements",
    "00_input/source-docs",
    "00_input/source-images",
    "00_input/logos",
    "00_input/brand",
    "01_brief",
    "02_generation/image_prompts",
    "02_generation/generated_full_slides",
    "02_generation/generated_layers",
    "03_assembly/manifests",
    "03_assembly/scripts",
    "03_assembly/single_slides",
    "03_assembly/previews",
    "04_final/pptx",
    "04_final/pdf",
    "04_final/rendered",
    "05_qa",
]


def write_text_if_missing(path: Path, text: str, force: bool) -> None:
    if path.exists() and not force:
        return
    path.write_text(text, encoding="utf-8", newline="\n")


def create_slide_plan(path: Path, slide_count: int, force: bool) -> None:
    if path.exists() and not force:
        return
    fields = [
        "slide",
        "title",
        "narrative_role",
        "core_message",
        "evidence_files",
        "visual_type",
        "needs_generated_master",
        "needs_real_photos",
        "needs_logo",
        "qa_notes",
    ]
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for i in range(1, slide_count + 1):
            writer.writerow(
                {
                    "slide": f"{i:02d}",
                    "title": "",
                    "narrative_role": "",
                    "core_message": "",
                    "evidence_files": "",
                    "visual_type": "",
                    "needs_generated_master": "yes",
                    "needs_real_photos": "",
                    "needs_logo": "yes",
                    "qa_notes": "",
                }
            )


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a premium PPTX production workspace.")
    parser.add_argument("output_dir", help="Workspace directory to create")
    parser.add_argument("--title", default="Untitled Deck", help="Deck title")
    parser.add_argument("--slides", type=int, default=12, help="Initial slide count for slide_plan.csv")
    parser.add_argument("--ratio", default="16:9", help="Deck aspect ratio, for example 16:9 or 4:3")
    parser.add_argument("--force", action="store_true", help="Overwrite starter files if they already exist")
    args = parser.parse_args()

    root = Path(args.output_dir).resolve()
    root.mkdir(parents=True, exist_ok=True)
    for rel in DEFAULT_DIRS:
        (root / rel).mkdir(parents=True, exist_ok=True)

    created_at = datetime.now().isoformat(timespec="seconds")
    brief = f"""# Deck Brief

Title: {args.title}
Created: {created_at}
Ratio: {args.ratio}

## User Request

Paste or summarize the user's requirement here.

## Audience And Purpose

- Audience:
- Occasion:
- Desired outcome:

## Non-Negotiable Facts

- Keep every factual claim traceable to source files or explicit user instruction.

## Visual Direction

- Overall style:
- Brand colors:
- Logo handling:
- Real-photo handling:
- Generated-image role:

## Delivery Targets

- PPTX:
- Preview/PDF:
- Deadline:
"""
    qa = f"""# QA Report

Title: {args.title}
Created: {created_at}

## Package Validation

- Not run yet.

## Visual Validation

- Not run yet.

## UTF-8 Validation

- Not run yet.

## Application-Level Validation

- Not run yet.

## Known Gaps

- None recorded yet.
"""
    inventory = {
        "title": args.title,
        "created": created_at,
        "assets": [],
        "notes": "Add source files here with role, path, rights/source, and whether they must stay real.",
    }

    write_text_if_missing(root / "01_brief/deck_brief.md", brief, args.force)
    create_slide_plan(root / "01_brief/slide_plan.csv", args.slides, args.force)
    write_text_if_missing(root / "05_qa/qa_report.md", qa, args.force)
    if args.force or not (root / "05_qa/asset_inventory.json").exists():
        (root / "05_qa/asset_inventory.json").write_text(
            json.dumps(inventory, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    print(json.dumps({"workspace": str(root), "slides": args.slides, "created": created_at}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
