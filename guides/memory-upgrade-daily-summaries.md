# Guide — Memory upgrade: a friendly daily summary (your dashboard's data source)

> **Session 8 prerequisite.** Do this *before* you build your Mission Control dashboard — the dashboard needs something readable to show, and right now your agent doesn't write it. This is also a perfect first "build by directing": small, safe, and it warms up the exact loop you'll use on the dashboard.

## Why this exists

Your **Phase 2** memory system (Session 5) already writes a trail of every session into `<vault>/daily/`. But those hooks are *deterministic* — they dump your prompts and the tools that ran, raw. Useful as a record; not something you'd want on a screen.

Your dashboard needs a **plain-English summary of what you got done each day**. This guide adds exactly that — one small hook — and it produces the file the dashboard will read.

It **sits alongside** your Phase 2 hooks; it doesn't replace them. The raw trail stays; this adds the human-readable layer on top.

## What you'll add

A `DailySummary` hook that runs when a session ends. It:
1. reads the session's transcript,
2. asks a small fast model (Haiku) to summarise what got done **in plain, friendly English**,
3. appends a one-line, dated entry under a `## Summary` heading in `<vault>/daily/YYYY-MM-DD.md` — **the same daily folder your Phase 2 hooks already write to.**

That `daily/` folder is the data source your dashboard's "recent activity" panel reads — one place, not a parallel feed.

## Recipe — direct your agent to build it

This is the point of Session 8: you don't write the hook, you *direct* it. Give your agent this verbatim:

```
I want to add a "daily summary" hook to my agent so it writes a short, friendly
summary of what we worked on each day — something readable I can later show on a
dashboard. Please:

1. Create a SessionEnd hook at .claude/hooks/DailySummary.ts (Bun/TypeScript). If
   I'm using the Python hooks, make it a .py to match my setup.

2. When a session ends, it should:
   - find THIS session's transcript (the .jsonl file under
     ~/.claude/projects/<project-slug>/),
   - pull out what I asked for and what you did today,
   - ask the small fast model (claude-haiku-4-5) to write a 1-3 sentence summary,
   - append it as a dated bullet under a "## Summary" heading in
     <vault>/daily/YYYY-MM-DD.md — the SAME daily folder my other hooks use
     (auto-detect my vault folder the same way LoadMasterPrompt does; create the
     daily folder, the file, and the "## Summary" heading if they don't exist),
     one entry per session.

3. The summary PROMPT is the important bit. Write it so the summary is in PLAIN,
   FRIENDLY English, as if telling a friend what we got done today. NO jargon, file
   paths, code, config values, or tool names. Describe the OUTCOME, not the
   mechanics. British English.

4. Register the hook under "SessionEnd" in .claude/settings.json, keeping my
   existing hooks. (My write permission for <vault>/outputs/** already covers the
   new file.)

5. Make it safe: if anything fails, exit quietly without blocking — the summary is
   a nice-to-have, never a blocker. And don't write a second entry for the same
   session if it's already there.

Walk me through it, and show me the hook and the settings change before you commit.
```

> **Shortcut:** a reference copy of this hook already ships in the starter at `.claude/hooks/DailySummary.ts` — you can ask your agent to *"copy and adapt the DailySummary hook from the starter"* instead of building it from scratch. But building it by directing is the better learning; do that if you have ten minutes.

## Verify it works

1. Restart your session so the new hook registers:
   ```
   /exit
   claude
   ```
2. Do a few minutes of real work, then end the session with `/exit` (this is what fires the hook).
3. Open a new session and ask:
   ```
   Did the DailySummary hook write today's entry under "## Summary" in
   <vault>/daily/? Show me the file.
   ```
   You should see a dated, plain-English one-liner. If it reads like an engineer's changelog rather than a note to a friend, your summary prompt needs softening — tell your agent to make it friendlier and try again. **The voice is the whole point.**

## The de-jargon point (don't skip this)

The default instinct — yours *and* the model's — is to write summaries that are precise and technical. Great for a private log; wrong for a dashboard a normal person reads. The single instruction that fixes it: *"imagine telling a friend what we got done — the outcome, not the mechanics."* That one line is the difference between *"Restructured vault into PARA (314 renames); added redactSecrets() scrubber"* and *"Tidied up how my notes are organised and made sure no passwords get saved by accident."*

## Optional — the deeper version (Phase 3+)

What you've added is the simple, dashboard-ready layer. If you later want what a fully-built agent has, there are two further steps (not needed for the dashboard, and heavier):

- **A per-session AI summary** baked into your existing `SessionEndSummary` hook (so each session block in `daily/` gets its own summary, not just the raw trail).
- **A next-morning "reflection" pass** — a scheduled job that reads the day's sessions and writes a consolidated `## Summary / Decisions / Learnings` at the top of the daily log. This is the "nightly reflection" we flagged as Phase 3+ in Session 5.

Skip both for now. One friendly daily summary is all the dashboard needs.
