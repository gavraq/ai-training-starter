#!/usr/bin/env python3
"""SessionEnd hook: write a final session summary to the vault's daily log.

Python equivalent of SessionEndSummary.ts. Same behaviour, same output.

Fires when Claude Code exits (manual /exit, timeout, window close).
Reads the full session transcript from jsonl and appends a structured
block to <vault>/daily/YYYY-MM-DD.md so the session is recoverable
next time.

Writes to <vault>/daily/YYYY-MM-DD.md - auto-detects the vault
directory the same way LoadMasterPrompt does (any folder named
`vault` or ending in `-vault`).

Deterministic - no LLM call.

To use this variant instead of the TypeScript one: edit
.claude/settings.json and change the SessionEnd hook command to
`python3 $CLAUDE_PROJECT_DIR/.claude/hooks/SessionEndSummary.py`.
"""

from __future__ import annotations

import json
import os
import sys
from datetime import date, datetime
from pathlib import Path

# Make the sibling `lib/` importable when this file is invoked directly.
sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.transcript import (  # noqa: E402
    append_to_daily_log,
    find_transcript,
    find_vault_dir,
    format_summary_markdown,
    read_transcript,
)


def hhmm(ts: str | None) -> str:
    if not ts:
        return "??:??"
    try:
        d = datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except ValueError:
        return "??:??"
    return f"{d.hour:02d}:{d.minute:02d}"


def main() -> None:
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            return
        data = json.loads(raw)
    except (json.JSONDecodeError, OSError):
        return

    session_id = data.get("session_id")
    if not session_id:
        return

    cwd = Path(data.get("cwd") or os.getcwd())
    vault_dir = find_vault_dir(cwd)
    if vault_dir is None:
        print(
            "[SessionEndSummary] No vault directory found (looking for `vault` or `*-vault`). Skipping.",
            file=sys.stderr,
        )
        return

    jsonl = find_transcript(session_id, cwd)
    if jsonl is None:
        return

    summary = read_transcript(jsonl)
    if not summary.user_prompts:
        return

    today = date.today().isoformat()
    daily_path = vault_dir / "daily" / f"{today}.md"
    short_id = session_id[:8]
    heading = (
        f"### Session {short_id} "
        f"({hhmm(summary.start_time)}–{hhmm(summary.end_time)})"
    )
    append_to_daily_log(daily_path, format_summary_markdown(summary, heading))


if __name__ == "__main__":
    try:
        main()
    except Exception as err:  # pragma: no cover - last-ditch safety net
        print(f"[SessionEndSummary] {err}", file=sys.stderr)
