#!/usr/bin/env python3
"""SessionStart hook: loads <vault>/identity/*.md + <vault>/MEMORY.md into the session context.

Deterministic, no LLM call. Runs once per session start.

Auto-detects the vault directory: looks for any folder named `vault`
or ending in `-vault` (e.g. `chiefofstaff-vault`, `jarvis-vault`).
This way participants can rename `vault/` -> `<their-agent-name>-vault/`
after cloning, and the hook still finds it.

Reads every .md file in <vault>/identity/, plus <vault>/MEMORY.md if
present (Phase 2 - curated long-term memory). Wraps them in a
<master-prompt>...</master-prompt> block, and hands the block to
Claude Code via the additionalContext channel.

To use this variant instead of the TypeScript one: edit
.claude/settings.json and set the command to
`python3 .claude/hooks/LoadMasterPrompt.py`.
"""

import json
import sys
from pathlib import Path

cwd = Path.cwd()

# Find the vault directory (any folder named `vault` or ending in `-vault`)
vault_dir = next(
    (
        d
        for d in sorted(cwd.iterdir())
        if d.is_dir() and (d.name == "vault" or d.name.endswith("-vault"))
    ),
    None,
)

if vault_dir is None:
    print(
        "[LoadMasterPrompt] No vault directory found (looking for `vault` or `*-vault`). Skipping.",
        file=sys.stderr,
    )
    sys.exit(0)

identity_dir = vault_dir / "identity"

if not identity_dir.exists():
    print(
        f"[LoadMasterPrompt] {vault_dir.name}/identity/ folder not found - skipping",
        file=sys.stderr,
    )
    sys.exit(0)

files = sorted(identity_dir.glob("*.md"))

parts = [
    "<master-prompt>",
    f"The following files (from {vault_dir.name}/identity/) describe the user. Load them into context for this session and tailor every response accordingly.",
    "",
]

for f in files:
    parts.append(f"--- {f.name} ---")
    parts.append(f.read_text())
    parts.append("")

# Phase 2: also load <vault>/MEMORY.md (curated long-term memory) if present
memory_path = vault_dir / "MEMORY.md"
if memory_path.exists():
    parts.append("--- MEMORY.md ---")
    parts.append(memory_path.read_text())
    parts.append("")

parts.append("</master-prompt>")

block = "\n".join(parts)

json.dump(
    {
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": block,
        },
    },
    sys.stdout,
)
