# AI Training Starter — Phase 2

> **You're on the `phase-2` branch.** This adds memory, a pre-built skill, and a self-improvement slash command to the Phase 1 foundation.
>
> Phase 1 is on `main` — check it out first if you want to start simpler.

## What Phase 2 adds on top of Phase 1

- **`PreCompact` + `SessionEnd` hooks** — write session transcripts to `daily/YYYY-MM-DD.md` automatically. Deterministic, no LLM call.
- **`MEMORY.md`** — a curated long-term memory file. Loaded at every session start alongside your identity files.
- **`WeeklyDigest` skill** (in `.claude/skills/WeeklyDigest/`) — pre-built. When you ask for a weekly digest, it fires automatically (USE WHEN). Adapt step 4 to your personal angle (fitness / client work / research / family).
- **`/master-prompt` slash command** — reviews recent sessions and proposes updates to your identity files + MEMORY.md. Run every 2–4 weeks.

## What's the same as Phase 1

- Same identity files (`identity/USER.md`, `SOUL.md`, `GOALS.md`)
- Same `CLAUDE.md` entry point
- Same `LoadMasterPrompt` hook (now also loads `MEMORY.md` if present)
- Same Claude Code as harness

---

# AI Training Starter — Phase 1

> Your personal AI agent. ~6 files, one hook. The thinnest possible outer harness on top of Claude Code.

This repo is the teaching template for the **AI Training** course (Session 6). It's the simplest possible personal AI agent: a Claude Code project that auto-loads your identity at every session start. Nothing more.

**What it is**: a starting point you clone, fill in with your own identity (Master Prompt), and run Claude Code against. You end up with an agent that already knows who you are, every time you open a session.

**What it is not**: a fully-featured assistant. No memory across sessions yet. No skills. No tool integrations. That's Phase 2 and beyond.

## Quick start

1. **Clone this repo** to your machine:
   ```
   git clone https://github.com/gavraq/ai-training-starter.git my-ai
   cd my-ai
   ```

2. **Fill in your identity** — edit the three files in `identity/`:
   - `USER.md` — who you are (roles, background, what you work on)
   - `SOUL.md` — how you like to work (voice, style, rules, quality bar)
   - `GOALS.md` — what you're trying to do (short/mid/long-term)
   Treat the templates as prompts. Overwrite completely.

3. **Install Claude Code** if you haven't:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
   (Or follow [claude.com/claude-code](https://claude.com/claude-code).)

4. **Trust the hook**. The first time you open this folder in Claude Code, it will ask if you want to enable the `SessionStart` hook. Say yes.

5. **Run it**:
   ```
   claude
   ```
   When the session opens, the hook fires and your identity files are loaded. You can test by asking: *"Who am I?"* — Claude should answer using what's in `identity/`.

6. **Generate your first weekly digest**:
   - Drop a week's worth of notes as a markdown file into `inputs/` (see `inputs/EXAMPLE-week.md` for shape)
   - In Claude Code, type: *"Generate this week's digest from inputs/ and save it to outputs/"*
   - Claude reads the files, uses your identity context to tailor the output, and writes `outputs/digest-YYYY-MM-DD.md`

## What's in this repo

```
ai-training-starter/
├── README.md                      # You are here
├── CLAUDE.md                      # Always-loaded by Claude Code — the entry point
├── identity/
│   ├── USER.md                    # Who you are (template to overwrite)
│   ├── SOUL.md                    # Voice, style, rules (template)
│   └── GOALS.md                   # What you're trying to do (template)
├── inputs/
│   └── EXAMPLE-week.md            # One filled-in example so you see the shape
├── outputs/
│   └── .gitkeep                   # Where digests land (gitignored after the example)
├── .claude/
│   ├── hooks/
│   │   ├── LoadMasterPrompt.ts    # THE hook — ~30 lines. TypeScript / Bun
│   │   └── LoadMasterPrompt.py    # Python variant — same behaviour, same shape
│   └── settings.json              # Registers the hook (committed — shared default)
├── .gitignore
└── LICENSE                        # MIT
```

That's it. Six or so files and one hook. You'll be shocked how small it is.

## Picking TypeScript or Python for the hook

The hook ships in both languages — pick whichever you'd rather read. Same behaviour in both.

- **TypeScript / Bun** (`LoadMasterPrompt.ts`) — default, matches Claude Code's own internal style. Requires [Bun](https://bun.sh).
- **Python** (`LoadMasterPrompt.py`) — slightly shorter; any Python 3.11+ works.

To switch, edit `.claude/settings.json` — change the `command` field from `bun run .claude/hooks/LoadMasterPrompt.ts` to `python3 .claude/hooks/LoadMasterPrompt.py`. Nothing else changes.

## The hook in one paragraph

On `SessionStart`, the hook reads every `.md` file in `identity/`, wraps them in `<master-prompt>…</master-prompt>` tags, and hands the whole block to Claude Code via the `additionalContext` channel. Claude sees this at the top of every new session — it's as if you pasted your identity files into the first prompt yourself. Deterministic, no LLM call.

## What comes next — Phase 2 and beyond

Phase 1 loads your identity every session. That's the 60% solution.

**Phase 2** (Session 7 in the course — coming as a `phase-2` branch to this repo):
- `PreCompact` + `SessionEnd` hooks — automatic session memory to `daily/`
- A pre-built `WeeklyDigest` skill — the digest becomes automatic, no need to type the full prompt
- `MEMORY.md` — curated long-term memory (decisions, preferences, patterns) loaded alongside identity
- `/master-prompt` slash command — periodic review + self-update of your identity files

**Phases 3–6** (beyond the course):
- More slash commands (`/reflect`, `/end-of-day`)
- MCP connectors (Gmail, Calendar, GitHub)
- Subagents
- Scheduled execution (cron / launchd)

## License

MIT. Use it, fork it, rip it apart, share what you learn.
