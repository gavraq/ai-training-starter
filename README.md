# AI Training Starter — Phase 1

> Your personal AI agent. ~12 files, one hook, plus the meta-skill that lets you build your own. The thinnest useful outer harness on top of Claude Code.

This repo is the teaching template for the **AI Training** course (Session 4 — the build session). The simplest possible personal AI agent: a Claude Code project that auto-loads your identity at every session start, ships with `create-skill` so you can author your own skills, and gets out of your way.

**What it is**: a starting point you clone, fill in with your own identity (Master Prompt), and run Claude Code against. You end up with an agent that already knows who you are, every time you open a session — plus the framework to teach it new tricks.

**What it is not**: a fully-featured assistant. No memory across sessions yet. No tool integrations (Gmail, Calendar, etc.). The formal `WeeklyDigest` skill, memory hooks, and self-improvement slash command all ship in Phase 2.

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

   *Stuck on a blank page?* See `homework-prompts.md` for the AI-interview alternative — paste each prompt into ChatGPT or Claude, let it interview you, paste the output back into the template.

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

7. **Build your first custom skill** — use the `create-skill` skill that ships with the starter:
   - Pick something you do repeatedly that you'd like the agent to handle (a daily review, a meeting follow-up, an email draft pattern — anything with a clear trigger and a clear process)
   - In Claude Code, type: *"Use the create-skill skill to help me build a skill for [your idea]."*
   - `create-skill` interviews you on the trigger phrase, the process steps, the inputs and outputs, then generates a `SKILL.md` and places it under `.claude/skills/<your-skill-name>/`
   - Restart your Claude Code session and try the trigger phrase — your new skill should fire automatically

   This is the meta moment: AI authoring AI configuration. Your *second* skill takes a fraction of the time of your first — every skill you write the agent inherits. That's the compounding return.

## What's in this repo

```
ai-training-starter/
├── README.md                      # You are here
├── CLAUDE.md                      # Always-loaded by Claude Code — the entry point
├── homework-prompts.md            # AI-interview prompts for filling in identity files
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
│   ├── skills/
│   │   └── create-skill/          # Meta-skill: use this to author your own skills
│   │       └── SKILL.md           # Single-file skill (Anthropic-style)
│   └── settings.json              # Registers the hook (committed — shared default)
├── .gitignore
└── LICENSE                        # MIT
```

A dozen files, one hook, one meta-skill. You'll be shocked how small it is.

## Picking TypeScript or Python for the hook

The hook ships in both languages — pick whichever you'd rather read. Same behaviour in both.

- **TypeScript / Bun** (`LoadMasterPrompt.ts`) — default, matches Claude Code's own internal style. Requires [Bun](https://bun.sh).
- **Python** (`LoadMasterPrompt.py`) — slightly shorter; any Python 3.11+ works.

To switch, edit `.claude/settings.json` — change the `command` field from `bun run .claude/hooks/LoadMasterPrompt.ts` to `python3 .claude/hooks/LoadMasterPrompt.py`. Nothing else changes.

## The hook in one paragraph

On `SessionStart`, the hook reads every `.md` file in `identity/`, wraps them in `<master-prompt>…</master-prompt>` tags, and hands the whole block to Claude Code via the `additionalContext` channel. Claude sees this at the top of every new session — it's as if you pasted your identity files into the first prompt yourself. Deterministic, no LLM call.

## What comes next — Phase 2 and beyond

Phase 1 loads your identity every session and lets you author skills. That's already useful. But the agent forgets between sessions, and you have to type the full digest prompt each time.

**Phase 2** (Session 5 in the course — on the `phase-2` branch of this repo):
- `PreCompact` + `SessionEnd` hooks — automatic session memory to `daily/`
- A pre-built `WeeklyDigest` skill — the digest fires automatically when you ask for one, no need to type the full prompt
- `MEMORY.md` — curated long-term memory (decisions, preferences, patterns) loaded alongside identity
- `/master-prompt` slash command — periodic review + self-update of your identity files

To get Phase 2 once you've used Phase 1 for a week or two:

```
git fetch origin
git merge origin/phase-2
```

Your custom skills from Phase 1 (anything you built with `create-skill`) survive the merge — they live in their own folders under `.claude/skills/`.

**Phases 3–6** (beyond the course):
- More slash commands (`/reflect`, `/end-of-day`)
- MCP connectors (Gmail, Calendar, GitHub)
- Subagents
- Scheduled execution (cron / launchd)

## License

MIT. Use it, fork it, rip it apart, share what you learn.
