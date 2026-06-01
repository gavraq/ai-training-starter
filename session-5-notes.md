# Session 5 — Phase 2: Memory + Self-Improvement Loop

Companion notes to the video. Everything we covered, every command we ran, every gotcha worth knowing.

This is the single reference file for the week. Refer back to it as you do the homework.

---

## What we covered

Phase 1 (Session 4 + 4b) gave your agent **identity** — three markdown files in `<vault>/identity/` that get loaded into every session.

Phase 2 adds two new capabilities on top:

1. **Memory** — every session you have leaves a deterministic trail in `<vault>/daily/YYYY-MM-DD.md`. Two new hooks (PreCompactFlush + SessionEndSummary) write the trail automatically. A curated `MEMORY.md` in your `identity/` folder gets loaded alongside SOUL/USER/GOALS at every session start.

2. **Self-improvement loop** — a new `/master-prompt` slash command. Reads your identity files, MEMORY.md, CLAUDE.md, and recent daily logs. Proposes specific updates as a diff. You approve or skip each one. Run every 2–4 weeks to keep your Master Prompt fresh as how you actually work evolves.

Connectors (Gmail, Calendar, Slack, Telegram, etc.) come in **Session 6**.

---

## What's added in the `phase-2` branch (vs `main`)

| What | Where | What it does |
|------|-------|--------------|
| `PreCompactFlush.ts` + `.py` | `.claude/hooks/` | Writes a session summary to `<vault>/daily/YYYY-MM-DD.md` *before* Claude Code compacts the conversation. Both TypeScript and Python variants ship — same behaviour, pick the language you can run. |
| `SessionEndSummary.ts` + `.py` | `.claude/hooks/` | Writes the final session summary to `<vault>/daily/` when the session ends (`/exit`, timeout, window close). Both TS and Py variants. |
| `lib/transcript.ts` + `.py` | `.claude/hooks/lib/` | Shared helper both hooks use to parse the session JSONL transcript and format markdown. ~130 lines, deterministic, no LLM call. |
| `MEMORY.md` template | `vault/identity/MEMORY.md` | Curated long-term memory — decisions, preferences, patterns. The 5% of `daily/` content worth re-reading every session. Lives in `identity/` alongside SOUL/USER/GOALS so the existing `identity/*.md` loop loads it — no special-case code. |
| `/master-prompt` slash command | `.claude/commands/` | Reads identity files + MEMORY.md + CLAUDE.md + recent daily logs. Proposes concrete updates as a diff. Waits for your approval before writing anything. |
| `settings.json` updates | `.claude/` | Registers the two new hooks. Adds write permissions for `vault/daily/**` and `vault/identity/MEMORY.md`. |

**What's NOT in Phase 2**: MCP connectors (Session 6), cron-driven nightly reflection (Phase 3+), subagents (Session 7).

---

## RECIPE 1 — GitHub Repo Setup (prerequisite for the merge)

**Skip this section if you already pushed your agent to a private GitHub repo last week.** Otherwise, do this *before* the merge recipe.

If you skip the repo setup and try to merge, your `origin` still points at my starter repo (`gavraq/ai-training-starter`) and the merge prompt below produces confusing results. The order matters.

Give your agent this verbatim:

```
I want to create my own private GitHub repository for my agent and push my
local repo to it. Please:

1. Create an empty private repository under my GitHub account named
   <your-agent-name> (replace with the actual name — e.g. bob, jarvis,
   frikkie). Use the gh CLI: `gh repo create <your-account>/<your-agent-name>
   --private --description "My personal AI agent"`. Don't pass --source
   or --push at this step.

2. Rename my current origin remote to upstream — because the starter
   repository should be upstream from now on, not origin:
       git remote rename origin upstream

3. Add my new private repository as the new origin:
       git remote add origin <URL-of-the-private-repo-you-just-created>
   (Use the SSH URL if I have SSH set up, otherwise the HTTPS URL.
   Check `git remote -v` for the existing format.)

4. Push the main branch with -u so future pushes are simple:
       git push -u origin main

5. Show me `git remote -v` afterwards so I can verify the layout. Expected:
   - origin    points at my private repo (gavraq/<my-agent-name>)
   - upstream  points at gavraq/ai-training-starter

6. Show me a brief confirmation message.

Stop and confirm with me at the end of each step. Don't bundle them.
```

After this, your `origin` is your own private repo, and the starter repo is `upstream` — exactly the layout the merge recipe assumes.

---

## RECIPE 2 — The Phase 2 Merge (with vault-name adaptation)

**Prerequisite**: you've completed Recipe 1. Your `origin` points at your own private repo; `upstream` points at the starter.

**Why this prompt is longer than you might expect**: Phase 2 ships its new files (`vault/identity/MEMORY.md` and `vault/daily/.gitkeep`) at default `vault/` paths. Most of you renamed your vault folder in Session 4 (to `bob-vault/`, `jarvis-vault/`, etc.). Without an adaptation step, the new files would land at the literal `vault/` path — creating a parallel orphaned folder next to your real renamed vault, and the SessionStart hook would never find MEMORY.md. **The adaptation is the `git mv` step embedded in the prompt below**. Your agent handles it automatically; you don't have to think about it.

Verbatim prompt — paste this into your Claude session:

```
Fetch the upstream remote and merge the Phase 2 additions from upstream/phase-2
into our current branch. Walk me through any conflicts before committing.

IMPORTANT — vault-name adaptation: upstream phase-2 adds two files at default
vault/ paths (vault/identity/MEMORY.md and vault/daily/.gitkeep). Since I
renamed my vault folder (it's now <my-vault-name>, NOT just "vault"), those
files will land at the wrong path and be orphaned — the SessionStart hook
won't load MEMORY.md and the daily-log hooks will fail to write. So as part
of the merge, BEFORE committing:

  1. git mv vault/identity/MEMORY.md <my-vault-name>/identity/MEMORY.md
  2. git mv vault/daily/.gitkeep <my-vault-name>/daily/.gitkeep
  3. Confirm the empty vault/ directory is gone.

Then commit everything as one merge commit with a message that explains both
the phase-2 pull AND the vault-name adaptation.

If .claude/settings.json or LoadMasterPrompt.ts have conflicts, propose how
to reconcile them keeping my customisations plus the new phase-2 additions.

After the commit succeeds, push to my origin so my private repo has Phase 2.

Stop and confirm with me before any push.
```

After this completes, restart your Claude session (so the new hooks register at session start):

```
/exit
```

Then:

```
claude
```

Verify the merge worked:

```
Confirm: did the SessionStart hook just load MEMORY.md alongside my identity
files? And are the PreCompact and SessionEnd hooks registered in
.claude/settings.json?
```

Your agent should confirm both. If it says anything is wrong, that's an `S5 issue:` email.

---

## RECIPE 3 — Run the `/master-prompt` Self-Improvement Loop

Once Phase 2 is merged and your session is restarted, type:

```
/master-prompt
```

Your agent will:

1. Find the vault directory
2. Read SOUL.md, USER.md, GOALS.md, MEMORY.md, and CLAUDE.md
3. Read the 5 most recent files in `<vault>/daily/`
4. Analyse — look for new preferences, new projects/goals, changed context, durable patterns, stale content
5. Produce a proposal — a short summary plus diff-style proposed updates. Flag uncertainty with a `?`
6. **Wait for your approval.** The agent will ask: *"Apply these changes? Yes, yes but skip X, or specify which to apply."*

**This is the most important moment of Phase 2.** The discipline is: the agent proposes, **you decide**. Don't accept everything blindly — that's how identity files go bad and start nagging you in directions that aren't actually yours.

When you reply, you can say:

- `yes` (apply everything)
- `yes, but skip the one about X` (apply most, skip specific ones)
- `apply only the SOUL and MEMORY changes` (be specific about which files)
- `no — these don't feel right` (reject and discuss)

Run `/master-prompt` every 2–4 weeks. Your Master Prompt stays current with how you're actually working instead of going stale.

---

## Bun vs Python — choosing the hook variant

Phase 2 ships both TypeScript (Bun) and Python variants of all three hooks. The default `settings.json` registers the TypeScript versions. If Bun isn't installed on your machine, swap to Python.

Give your agent this verbatim:

```
The TypeScript hooks need Bun, which I don't have installed. Please update
.claude/settings.json to use the Python variants of all three hooks
(LoadMasterPrompt, PreCompactFlush, SessionEndSummary). The .py versions
ship in phase-2. Then commit, and confirm the swap by reading settings.json
back to me.
```

Same behaviour either way. Three lines change in `settings.json`.

---

## Useful Claude Code commands shown live

Five commands worth knowing — they come up daily once you're using the agent properly.

| Command | What it does |
|---------|--------------|
| `/rename <name>` | Renames the current Claude session. Once you have three or four terminals open, "my last session" doesn't cut it. Name them. |
| `/color <colour>` | Sets the prompt-bar colour for this terminal. Visual marker — *"marathon green, AI training orange."* Cheap, transformative when you have many sessions open. |
| `/resume [name]` | Picks up a previous session by name or date. Combined with `/rename`, you can find specific sessions months later. |
| `/clear` | Drops the context window — fresh start, same session. When the conversation has muddled, `/clear` gets you to a clean slate without losing the loaded identity files. |
| `/exit` | Exits cleanly. **Triggers the SessionEndSummary hook we just installed** — your session writes itself into `daily/` as you walk away. Use this instead of just closing the window. |

Plus three more worth knowing:

- `/help` — full command list
- `/model` — switch model mid-session
- `/compact` — manually trigger compaction (now fires `PreCompactFlush`)

---

## Mobile and remote access — three options

For when you want to use your agent while away from your laptop.

### Option 1 — `/remote-control` (alias `/rc`)

Makes your current terminal session available for remote control from claude.ai (browser or mobile Claude Code app). **Your laptop must be on** — the session keeps running on your machine; your phone is just a control surface.

Type `/remote-control` in any open Claude Code session. Follow the pairing flow. Then open the Claude Code app on your phone — your session appears under "Code" and you can send prompts to it.

Best for: short messages while you're out, "add this to scratch.md" type interactions.

### Option 2 — `/teleport` (alias `/tp`)

Pulls a session you started in claude.ai/code (the web UI) into your local terminal. Opens a picker, fetches the branch and conversation.

Best for: you started something quick on your phone via claude.ai, now want to continue it properly back at your desk.

### Option 3 — Telegram bot (S6 territory)

If you want to talk to your agent **without** your laptop being on, you wire up a Telegram bot that routes messages between your phone and a hosted agent. More setup — covered properly in Session 6.

---

## Gotchas — things that bit me during the build, listed so they don't bite you

### Gotcha 1 — `/init` prompt at session start

If you open Claude Code and it shows you a "Run /init to create a CLAUDE.md file" tip, that means you started `claude` in a folder it doesn't recognise. **You forgot to `cd` into your agent directory first.**

Fix:

```
/exit
cd ~/projects/<your-agent-name>
claude
```

The SessionStart hook fires, your identity loads, the `/init` prompt goes away.

(If you genuinely want to run `/init` — it explores the folder and creates a `CLAUDE.md` to tell Claude what's in there. Useful when you start a new project that isn't an agent. Just not for your agent folder.)

### Gotcha 2 — The vault-name adaptation (covered above in Recipe 2)

Phase 2 ships files at `vault/` paths. You renamed your vault. The merge prompt handles this — see Recipe 2.

### Gotcha 3 — MEMORY.md got persisted, agent can't quote it

If your MEMORY.md grows past about 50 lines, Claude Code may persist the SessionStart hook output to a temp file and only show the agent a preview. Your agent will be able to say *"MEMORY.md exists, I haven't opened it"* — which isn't what you want.

Fix: keep MEMORY.md concise. The whole point of the curated layer is the 5% that matters, not a dump. If it grows past 50 lines, prune.

### Gotcha 4 — daily-log file uses UTC date, not local date

The TypeScript variant of `PreCompactFlush.ts` and `SessionEndSummary.ts` uses `toISOString().slice(0, 10)` — which returns UTC. If you're in BST (or any non-UTC timezone) and your session ends late at night, it may write to the previous day's file. (The Python variants use local time correctly.)

Workaround for now: this is a known bug, will fix between S5 and S6. Functionally it doesn't matter — `/master-prompt` reads all recent files regardless of filename.

### Gotcha 5 — Bun isn't on PATH for hook execution

If your SessionStart hook fires the "bun not installed" error, see the Bun-vs-Python section above.

---

## Homework for Session 6

Seven items, in priority order. Items 1–4 are foundational; 5–7 are stretch.

1. **(Prerequisite for item 2 — DO NOT skip)** Create your own private GitHub repo and push your agent to it, if you haven't already. Recipe 1 above.

2. **Merge the phase-2 branch** into your own repo. Only do this once item 1 is in place. Recipe 2 above.

3. **Verify the new hooks register and MEMORY.md loads.** Restart your Claude session after the merge. Ask the agent to confirm both. The exact prompt is at the end of Recipe 2.

4. **Run `/master-prompt` at least once during the week.** Read the proposed updates. Apply what makes sense, skip what doesn't. **Don't accept everything blindly.** Recipe 3 explains the discipline.

5. **Use your agent every day this week.** The `daily/` folder needs material for `/master-prompt` to chew on next time. Even a 5-minute session a day is plenty.

6. **(If you didn't get there last week)** build at least one custom skill via `create-skill`. Two weeks owed by most of you now. Reply to the follow-up email if you want a 30-minute group skill-build clinic this week.

7. **Keep a gaps log** — anything that confuses, breaks, or feels missing. Drives the open of Session 6.


**Email any issue** to `gavin@slaters.uk.com` with subject `S5 issue: <one-liner>`. Don't sit on blockers.


---

## What's next — Session 6: Tuning + Connectors

Memory and self-improvement are the spine of Phase 2; **connectors are the headline of Session 6**. We'll wire up MCP servers so your agent reaches the systems you actually live in:

- Gmail (read your inbox, draft replies, label, archive)
- Google Calendar (read your week, schedule meetings, find conflicts)
- Google Tasks (read and update your to-do list — Richard, this is for you)
- Slack and Outlook for those who use them
- The Telegram bot path — so you can talk to your agent without your laptop being on (Lizl, Marius — your shared-account workflow is going to love this)

Bring your gaps log. S6 opens with your emails — every one.

---

## Links

- **Starter repo (main, Phase 1)**: https://github.com/gavraq/ai-training-starter
- **Phase 2 branch**: https://github.com/gavraq/ai-training-starter/tree/phase-2
- **Session 4a notes** (installation + commands): https://github.com/gavraq/ai-training-starter/blob/main/session-4a-notes.md

---

*Recorded 2026-05-29. ~90 minutes. Phase 2.*
