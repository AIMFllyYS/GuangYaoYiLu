from __future__ import annotations

"""
Build the v5 stable defense deck.

This script intentionally uses python-pptx instead of hand-written OOXML.
It keeps user-facing Chinese text in UTF-8 and avoids animation timing XML.
"""

import json
from pathlib import Path

from PIL import Image
from pptx import Presentation


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "答辩PPT_v5"
PPTX_NAME = "光药医路_5分钟稳定答辩PPT_v5.pptx"


def ensure_dependencies() -> None:
    """Import-time dependency check with a clear local remediation hint."""
    try:
        import pptx  # noqa: F401
    except ModuleNotFoundError as exc:
        raise SystemExit(
            "缺少 python-pptx。请运行：python -m pip install python-pptx"
        ) from exc


def main() -> None:
    ensure_dependencies()
    OUT.mkdir(parents=True, exist_ok=True)
    prs = Presentation()
    print(json.dumps({"status": "ready", "out": str(OUT / PPTX_NAME)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
