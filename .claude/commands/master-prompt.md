---
description: Review recent sessions and propose updates to identity files + MEMORY.md. Self-improvement loop for your Master Prompt.
---

# Update Master Prompt

Thiago Forte's self-improvement workflow, wired to one keystroke.

## What this does

Reads your current identity files and MEMORY.md, then reads recent session logs from `<vault>/daily/`, and proposes concrete updates to keep your Master Prompt current with how you're actually working.

## Steps

1. **Find the vault**. Look in the project root for a folder named `vault` or ending in `-vault` (e.g. `bob-vault/`, `jarvis-vault/`). That's the vault root for the rest of these steps.

2. **Read the current state**:
   - `<vault>/identity/USER.md`
   - `<vault>/identity/SOUL.md`
   - `<vault>/identity/GOALS.md`
   - `<vault>/identity/MEMORY.md`
   - `CLAUDE.md` (at the project root — the agent's operating manual)

3. **Read recent sessions** — the 5 most recent files in `<vault>/daily/` (or all of them if there are fewer than 5). If `<vault>/daily/` doesn't exist yet or is empty, say so and stop — there's nothing to review.

4. **Analyse**. Look for:
   - **New preferences** revealed by how the user corrected, pushed back, or praised responses — material for SOUL.md
   - **New projects / goals / areas** the user has started working on — material for GOALS.md (and possibly new files under `<vault>/projects/` or `<vault>/areas/`)
   - **Changes in professional context** (role, responsibilities, tools) — material for USER.md
   - **Changes to the organisational structure** the agent should know about — material for CLAUDE.md
   - **Durable decisions or cross-session patterns** — material for MEMORY.md
   - **Stale content** in the current files that no longer matches recent sessions

5. **Produce a proposal**:
   - A short summary (≤5 bullets) of what you noticed about the user from recent sessions that isn't already captured
   - Concrete proposed updates to each file that needs changing, shown as **diff-style** (current text → proposed text) so the user can see exactly what's changing
   - Flag anything you're uncertain about with a `?` — better to ask than overwrite

6. **Wait for approval**. Do NOT write any changes yet. Ask:
   > *"Apply these changes? Say 'yes', 'yes but skip X', or specify which to apply."*

7. **On approval**, write the approved changes. Confirm what was written.

## Rules

- **Never** invent content the user didn't actually express. If you're filling in a blank template section, make that clear (`"section was empty — proposing this based on X"`).
- **Never** overwrite the user's own specific wording with a generic paraphrase. Their voice matters.
- **Prefer adding** to existing sections over rewriting them, unless there's a clear contradiction.
- **Keep MEMORY.md concise**. If a pattern has appeared only once, it's probably not durable. Wait for it to recur before adding.
- **Touch CLAUDE.md only when the structure itself has changed** — new top-level folder, new file convention, etc. Not for content changes that belong inside vault files.

## Expected cadence

- **First month**: weekly. Lots of signal as the user discovers how they want to work with Claude.
- **Steady state**: every 2–4 weeks. Most updates are small.

If it's been more than 2 months since the last run and `<vault>/daily/` has 20+ files, summarise what you see more aggressively — the user's identity may have drifted meaningfully.
