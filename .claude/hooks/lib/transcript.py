"""Transcript Reader - shared helper for the Python variants of
PreCompactFlush + SessionEndSummary hooks.

Mirrors the TypeScript version in transcript.ts. Reads Claude Code's
per-session jsonl transcript (at ~/.claude/projects/<slug>/<session-id>.jsonl)
and extracts a structured summary: user prompts, assistant text, tool-call
counts.

Deterministic - no LLM call.

Simplified version of the helper used in gavraq/life. For Phase 2 of the
AI Training starter, this is all you need. You'll see production-grade
versions (with day-scoping, idempotency, etc.) in Gavin's full system.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class TranscriptSummary:
    session_id: str = ""
    start_time: str | None = None
    end_time: str | None = None
    user_prompts: list[str] = field(default_factory=list)
    assistant_texts: list[str] = field(default_factory=list)
    tool_calls: dict[str, int] = field(default_factory=dict)


def find_vault_dir(cwd: Path) -> Path | None:
    """Auto-detect the vault directory inside cwd.

    Looks for any folder named `vault` or ending in `-vault` - matches the
    convention used by LoadMasterPrompt. Returns None if no vault found.
    """
    try:
        for d in sorted(cwd.iterdir()):
            if d.is_dir() and (d.name == "vault" or d.name.endswith("-vault")):
                return d
    except OSError:
        return None
    return None


def find_transcript(session_id: str, cwd: Path) -> Path | None:
    """Find the jsonl transcript for a session.

    Tries the project-slug path first; falls back to scanning
    ~/.claude/projects/* if the hook was invoked from a subdir.
    """
    home = Path.home()
    slug = str(cwd).replace("/", "-")
    direct = home / ".claude" / "projects" / slug / f"{session_id}.jsonl"
    if direct.exists():
        return direct

    root = home / ".claude" / "projects"
    if not root.exists():
        return None
    for sub in root.iterdir():
        candidate = sub / f"{session_id}.jsonl"
        if candidate.exists():
            return candidate
    return None


def _is_real_prompt(content) -> bool:
    """Filter out command / system-reminder noise that shouldn't show in summaries."""
    if not isinstance(content, str):
        return False
    t = content.lstrip()
    if t.startswith(("<local-command", "<command-name>", "<command-message>", "<system-reminder>")):
        return False
    return len(t) >= 2


def read_transcript(jsonl_path: Path) -> TranscriptSummary:
    """Parse a session jsonl into a structured summary."""
    summary = TranscriptSummary()
    try:
        lines = jsonl_path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return summary

    for line in lines:
        if not line.strip():
            continue
        try:
            entry = json.loads(line)
        except (json.JSONDecodeError, ValueError):
            continue

        if entry.get("sessionId") and not summary.session_id:
            summary.session_id = entry["sessionId"]
        ts = entry.get("timestamp")
        if ts:
            if summary.start_time is None:
                summary.start_time = ts
            summary.end_time = ts

        etype = entry.get("type")
        message = entry.get("message", {}) or {}
        content = message.get("content")

        if etype == "user" and _is_real_prompt(content):
            summary.user_prompts.append(content)
        elif etype == "assistant" and isinstance(content, list):
            for block in content:
                if not isinstance(block, dict):
                    continue
                btype = block.get("type")
                if btype == "text" and isinstance(block.get("text"), str) and block["text"].strip():
                    summary.assistant_texts.append(block["text"].strip())
                elif btype == "tool_use":
                    name = block.get("name") or "unknown"
                    summary.tool_calls[name] = summary.tool_calls.get(name, 0) + 1

    return summary


def format_summary_markdown(summary: TranscriptSummary, heading: str) -> str:
    """Render the summary as a markdown block ready to append to a daily log."""
    import re

    lines: list[str] = ["", heading, ""]

    if summary.user_prompts:
        lines.append("**Prompts:**")
        for p in summary.user_prompts:
            collapsed = re.sub(r"\s+", " ", p).strip()
            lines.append(f"- {collapsed}")
        lines.append("")

    if summary.assistant_texts:
        lines.append("**Assistant responses:**")
        for a in summary.assistant_texts:
            collapsed = re.sub(r"\s+", " ", a).strip()
            lines.append(f"- {collapsed}")
        lines.append("")

    tool_names = sorted(summary.tool_calls.keys())
    if tool_names:
        parts = [f"{n}×{summary.tool_calls[n]}" for n in tool_names]
        lines.append("**Tools:** " + ", ".join(parts))
        lines.append("")

    return "\n".join(lines)


def append_to_daily_log(daily_path: Path, block: str) -> None:
    """Append a block to a daily log. Creates the file (and parent dirs)
    if missing. Idempotent on heading - skips if the heading is already present.
    """
    daily_path.parent.mkdir(parents=True, exist_ok=True)
    existing = daily_path.read_text(encoding="utf-8") if daily_path.exists() else ""

    heading_line = next(
        (line for line in block.split("\n") if line.startswith("### ")),
        None,
    )
    if heading_line and heading_line in existing:
        return

    date = daily_path.stem
    header = existing if existing else f"# {date}\n"
    daily_path.write_text(header + block + "\n", encoding="utf-8")
