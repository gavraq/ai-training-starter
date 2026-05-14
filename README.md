# AI Training Starter — Phase 1

> Your personal AI agent. ~12 files, one hook, plus the meta-skill that lets you build your own. The thinnest useful outer harness on top of Claude Code.

This repo is the teaching template for the **AI Training** course (Session 4 — the build session). The simplest possible personal AI agent: a Claude Code project that auto-loads your identity at every session start, ships with `create-skill` so you can author your own skills, and gets out of your way.

**What it is**: a starting point you clone, fill in with your own identity (Master Prompt), and run Claude Code against. You end up with an agent that already knows who you are, every time you open a session — plus the framework to teach it new tricks.

**What it is not**: a fully-featured assistant. No memory across sessions yet. No tool integrations (Gmail, Calendar, etc.). The formal `WeeklyDigest` skill, memory hooks, and self-improvement slash command all ship in Phase 2.

## Quick start

> **First time through? Type the commands yourself.** Several steps use `git` (clone, mv, add, commit). For your first run, **type them yourself** so you see what each does and build intuition for what's going on. From day two onward, Claude can drive most git operations on your behalf — just ask *"commit this for me"* and it'll do the typing. But knowing the underlying commands first means you can read what Claude is doing and spot when something looks off.

1. **Pick a name for your agent, then clone**.

   First decide what to call your agent — this is the directory name and how you'll think of it day-to-day. Three common patterns:
   - **Functional**: `chiefofstaff`, `assistant`, `agent` — descriptive, neutral
   - **Personal**: `jarvis`, `frikkie`, `mister-banks` — gives the agent a felt presence (recommended — naming things makes you use them)
   - **Just `my-ai`** if you don't want to decide right now

   Then clone into a `~/projects/` parent directory (a single place where your AI-related work lives):

   ```
   mkdir -p ~/projects && cd ~/projects
   git clone https://github.com/gavraq/ai-training-starter.git <your-agent-name>
   cd <your-agent-name>
   ```

   The directory name is just the filesystem location — the agent's *identity* (including its friendly name) lives in `vault/identity/SOUL.md`, which you'll fill in next.

2. **Personalise your vault folder**. The starter ships with a `vault/` folder containing `identity/`, `inputs/`, and `outputs/` — this is the Obsidian-friendly knowledge area for your agent (separate from `.claude/` which holds the code/config). Rename `vault/` to `<your-agent-name>-vault/` to match the convention used in larger setups (e.g. `chiefofstaff-vault/`, `jarvis-vault/`):

   ```
   git mv vault <your-agent-name>-vault
   ```

   We use `git mv` rather than plain `mv` so git records this as a single rename operation rather than as five deletions plus a new folder — `git status` stays clean. The hook auto-detects any folder named `vault` or ending in `-vault`, so this rename doesn't break anything. (You can skip the rename if you prefer — `vault/` works fine.)

3. **Open your vault in Obsidian** (optional but recommended). [Obsidian](https://obsidian.md) is a free markdown editor that renders your identity files, inputs, and outputs nicely, and lets you link between notes with `[[double brackets]]`. After installing:
   - Open Obsidian → **Open folder as vault** → select `~/projects/<your-agent-name>/<your-agent-name>-vault/`
   - You'll see `identity/`, `inputs/`, `outputs/` in the left sidebar
   - Edit your identity files in Obsidian; Claude Code reads them on next session start

4. **Fill in your identity** — edit the three files in `<your-agent-name>-vault/identity/`:
   - `USER.md` — who you are (roles, background, what you work on)
   - `SOUL.md` — how you like to work (voice, style, rules, quality bar). **The first line of SOUL.md is where your agent's friendly name lives** — e.g. *"You are Jarvis, my personal assistant. ..."*
   - `GOALS.md` — what you're trying to do (short/mid/long-term)
   Treat the templates as prompts. Overwrite completely.

   *Stuck on a blank page?* See `homework-prompts.md` for the AI-interview alternative — paste each prompt into ChatGPT or Claude, let it interview you, paste the output back into the template.

5. **Commit your work** to bake in this baseline:

   ```
   git add -A
   git commit -m "Initial setup: rename vault, fill identity files"
   ```

   Now you have a clean starting point. If you experiment later and want to roll back, you've got something to roll back to. From here on, you can ask Claude to drive commits for you (*"commit this for me with a sensible message"*) — but having done it once yourself, you'll understand what's being committed and why.

6. **Install Claude Code** if you haven't:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
   (Or follow [claude.com/claude-code](https://claude.com/claude-code).)

7. **Trust the hook**. The first time you open this folder in Claude Code, it will ask if you want to enable the `SessionStart` hook. Say yes.

8. **Run it**:
   ```
   claude
   ```
   When the session opens, the hook fires and your identity files are loaded. You can test by asking: *"Who am I?"* — Claude should answer using what's in your vault's `identity/` folder.

9. **Generate your first weekly digest**:
   - Drop a week's worth of notes as a markdown file into `<your-agent-name>-vault/inputs/` (see the EXAMPLE file for shape)
   - In Claude Code, type: *"Generate this week's digest from my vault's inputs and save it to outputs"*
   - Claude reads the files, uses your identity context to tailor the output, and writes `<your-agent-name>-vault/outputs/digest-YYYY-MM-DD.md`

10. **Build your first custom skill** — use the `create-skill` skill that ships with the starter:
   - Pick something you do repeatedly that you'd like the agent to handle (a daily review, a meeting follow-up, an email draft pattern — anything with a clear trigger and a clear process)
   - In Claude Code, type: *"Use the create-skill skill to help me build a skill for [your idea]."*
   - `create-skill` interviews you on the trigger phrase, the process steps, the inputs and outputs, then generates a `SKILL.md` and places it under `.claude/skills/<your-skill-name>/`
   - Restart your Claude Code session and try the trigger phrase — your new skill should fire automatically

   This is the meta moment: AI authoring AI configuration. Your *second* skill takes a fraction of the time of your first — every skill you write the agent inherits. That's the compounding return.

## What's in this repo

```
<your-agent-name>/                   # cloned starter (Claude Code project root)
├── README.md                        # You are here
├── CLAUDE.md                        # Always-loaded by Claude Code — the entry point
├── homework-prompts.md              # AI-interview prompts for filling in identity files
├── <your-agent-name>-vault/         # Obsidian vault (renamed from `vault/`)
│   ├── identity/
│   │   ├── USER.md                  # Who you are (template to overwrite)
│   │   ├── SOUL.md                  # Voice, style, rules (template)
│   │   └── GOALS.md                 # What you're trying to do (template)
│   ├── inputs/
│   │   └── EXAMPLE-week.md          # One filled-in example so you see the shape
│   └── outputs/
│       └── .gitkeep                 # Where digests land
├── .claude/                         # Claude Code config — hooks, skills, settings
│   ├── hooks/
│   │   ├── LoadMasterPrompt.ts      # THE hook — auto-detects vault, loads identity. TypeScript / Bun
│   │   └── LoadMasterPrompt.py      # Python variant — same behaviour, same shape
│   ├── skills/
│   │   └── create-skill/            # Meta-skill: use this to author your own skills
│   │       └── SKILL.md             # Single-file skill (Anthropic-style)
│   └── settings.json                # Registers the hook (committed — shared default)
├── .gitignore
└── LICENSE                          # MIT
```

A dozen files, one hook, one meta-skill. You'll be shocked how small it is.

**Why a separate vault folder?** The `<your-agent-name>-vault/` subfolder is a clean Obsidian vault — open it directly in Obsidian for a knowledge-base experience while keeping `.claude/` (code + config) out of the way. This mirrors the convention used in larger personal AI setups (e.g. `life/` containing `life-vault/`).

## Picking TypeScript or Python for the hook

The hook ships in both languages — pick whichever you'd rather read. Same behaviour in both.

- **TypeScript / Bun** (`LoadMasterPrompt.ts`) — default, matches Claude Code's own internal style. Requires [Bun](https://bun.sh).
- **Python** (`LoadMasterPrompt.py`) — slightly shorter; any Python 3.11+ works.

To switch, edit `.claude/settings.json` — change the `command` field from `bun run .claude/hooks/LoadMasterPrompt.ts` to `python3 .claude/hooks/LoadMasterPrompt.py`. Nothing else changes.

## The hook in one paragraph

On `SessionStart`, the hook auto-detects your vault folder (any directory named `vault` or ending in `-vault`), reads every `.md` file in `<vault>/identity/`, wraps them in `<master-prompt>…</master-prompt>` tags, and hands the whole block to Claude Code via the `additionalContext` channel. Claude sees this at the top of every new session — it's as if you pasted your identity files into the first prompt yourself. Deterministic, no LLM call.

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
