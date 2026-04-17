#!/usr/bin/env python3
"""SessionStart hook: loads identity/*.md into the session context.

Deterministic, no LLM call. Runs once per session start.

Reads every .md file in the identity/ folder, wraps them in a
<master-prompt>...</master-prompt> block, and hands the block to
Claude Code via the additionalContext channel.

To use this variant instead of the TypeScript one: edit
.claude/settings.local.json and set the command to
`python3 .claude/hooks/LoadMasterPrompt.py`.
"""

import json
import sys
from pathlib import Path

identity_dir = Path.cwd() / "identity"

if not identity_dir.exists():
    print("[LoadMasterPrompt] identity/ folder not found — skipping", file=sys.stderr)
    sys.exit(0)

files = sorted(identity_dir.glob("*.md"))

parts = [
    "<master-prompt>",
    "The following files describe the user. Load them into context for this session and tailor every response accordingly.",
    "",
]

for f in files:
    parts.append(f"--- {f.name} ---")
    parts.append(f.read_text())
    parts.append("")

# Phase 2: also load MEMORY.md (curated long-term memory) if present
memory_path = Path.cwd() / "MEMORY.md"
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
