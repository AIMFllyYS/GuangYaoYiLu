# Layered PPTX assembly skill (`pptx-layer-merge`)

[**中文**](README.md)

This folder contains the author-maintained **Agent Skill: `pptx-layer-merge`** (renamed from an earlier working title—**this directory is canonical**). It targets **editable, native PPTX** under explicit UTF-8 rules, assembling decks from assets, briefs, layered PNGs, and manifests with package-level validation.

**License:** [`LICENSE`](LICENSE) — **Apache License 2.0**, **Copyright © 2026 AIMFllyYS（羽升）**.

**Relationship to branch materials in this repo:** files under `skills/` are licensed separately under Apache-2.0. This **does not** open-source or grant reuse of deliverables under `交付物/`, `输出终稿/`, etc. See the notice in the root [README.en.md](../README.en.md).

## Repository map

For subdirectory READMEs (deliverables, research, tooling), start at the cross-link tables in [README.md](../README.md) / [README.en.md](../README.en.md) and the [**调研报告**](../调研报告/README.en.md) index.

## Contents

| Path | Role |
|------|------|
| [`pptx-layer-merge/SKILL.md`](pptx-layer-merge/SKILL.md) | Primary skill entry (`name: pptx-layer-merge`) for Cursor / Codex loaders |
| [`pptx-layer-merge/scripts/`](pptx-layer-merge/scripts/) | Python helpers: scaffold, manifest build, PPTX validation |
| [`pptx-layer-merge/references/`](pptx-layer-merge/references/) | Workspace contract, QA gates, lessons learned |
| [`pptx-layer-merge/agents/`](pptx-layer-merge/agents/) | Example agent config (e.g. `openai.yaml`) |

## Installing

1. **Copy the folder** `pptx-layer-merge/` into your agent skills location (or a project `skills/` path) so `SKILL.md` sits at the skill root.
2. **Cursor:** place the folder per Cursor’s Agent Skills / `SKILL.md` layout, or reference [`pptx-layer-merge/SKILL.md`](pptx-layer-merge/SKILL.md) from this workspace.
3. **Codex / other CLIs:** point the tool’s skill discovery at the `pptx-layer-merge` root that contains `SKILL.md`.

Runtime: scripts generally expect **Python 3** and **`python-pptx`** (see script headers / in-repo deck READMEs).

## Redistribution

Ship [`LICENSE`](LICENSE) intact and preserve attribution when redistributing the `skills/` subtree.

## Links

- [SKILL.md](pptx-layer-merge/SKILL.md)
- [Apache-2.0 full text](LICENSE)
- [Root README (Chinese)](../README.md) · [English](../README.en.md)
