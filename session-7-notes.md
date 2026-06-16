# Session 7 — Power Tools: Custom Commands, Sub-Agents & Scheduled Jobs

Companion notes to the video. Everything we covered, every command, every gotcha worth knowing.

This is the single reference file for the week. The detailed step-by-step guides live in [`guides/`](./guides/) — this file is the map; the guides are the territory.

---

## The one thing to take from today

Every session so far has been about *adding* capability — an identity, a memory, connectors. Today is **power tools**: your own commands, sub-agents, and scheduled jobs. All genuinely useful. But this is also the one session where I can do you *harm* — because the easiest mistake from here is to build something far too clever, then sit there at 11pm wondering why it's broken and unfixable.

So the spine of today isn't "more power." It's **keep it simple** — and the single most important thing is knowing **when *not* to reach for these tools**. Power with restraint.

---

## The frame — inner vs outer harness

Hold this mental model for everything below:

- **Inner harness** — the Claude Code loop itself: the model, its tools, its context window, running in a loop to reach a goal. It's already *enormously* powerful, and **you didn't build it — Anthropic did.**
- **Outer harness** — the bit *you* build on top: your identity files, skills, commands, structure. Everything good you've made so far lives here, and it works **because it's simple**.

Today's tools all bolt onto the outer harness. The warning that comes with them: the moment you add funky steps and clever loops — agents calling agents calling agents — it starts doing funny things and you can't debug it. The LLM (the inner harness) is so capable that your outer harness genuinely doesn't need much complexity in it at all.

> **Don't fear the refactor.** I'm on about my third rebuild of my own setup. Stripping something back and rebuilding it simpler isn't failure — it's normal. (This is exactly what I did with Nathan this week: two hours spent doing the *opposite* of building, and then it worked.)

---

## Power tool 1 — Custom slash commands

### The built-ins first

You've been using slash commands all along (`/clear`, `/model`, `/mcp` …). There are a lot of them — `/help` shows the full list any time. The handful actually worth knowing, grouped and annotated, are in the dedicated guide:

→ **[`guides/claude-code-slash-commands.md`](./guides/claude-code-slash-commands.md)**

Don't memorise them. Remember `/help` (or just type `/` to browse), and keep the guide as a reference.

### The trick: write your own

A slash command is **just a markdown file with an instruction inside.** In your project there's a `.claude` folder, and inside it a `commands` folder. A file at `.claude/commands/standup.md` *is* the command `/standup` — the slash is shorthand for "go read that file and do what it says." Which means you can write your own for **any workflow you do more than twice.**

That `.claude` folder is where your power lives. Three sub-folders:
- **`hooks`** — code that runs automatically (your memory hooks).
- **`skills`** — capabilities the agent reaches for on its own.
- **`commands`** — the slash commands you fire on demand.

(On a Mac that folder's hidden — reveal it with **Command-Shift-full-stop**, or just `ls .claude` in the terminal.)

### How to actually build one — let the agent do it

You *could* hand-write the markdown. In practice, just ask your agent — it knows the format and where to put it. Live, I built my post-session retrospective command:

```
Help me build a custom slash command for the retrospective I run after each
session. It should review this session's transcript and write a retrospective —
what actually worked, what didn't, what surprised me, what to change next time.
Be brutally honest. I want the flaws, not flattery — no praise unless it's earned.
```

It looks at an existing command (e.g. `master-prompt.md`) for the format, and writes the new file into `.claude/commands/`. Then `/session-retro` is live.

The real value isn't the keystrokes saved — it's that you **bake in *how* you want the job done, once**, so you never re-explain it. (Note that "be brutally honest" line — left to itself it'll tell me I'm wonderful; I'd rather it told me the truth.)

> **Heads up:** recent Claude Code versions merged custom commands into **skills** — so it may start building a *skill* instead. That's fine; a `.claude/commands/x.md` and a `.claude/skills/x/SKILL.md` both give you `/x`. If you specifically want a command, say so.

### Skill or command — which?

Simple rule:
- A **command** is something *you* fire deliberately, by name, when you want it.
- A **skill** is something the agent picks up *on its own* when the conversation calls for it — you never type its name.

Deliberate and on demand → **command.** Automatic and context-triggered → **skill.**

**Rule of thumb on whether to build one at all:** typed roughly the same instruction three times? Make it a command. Done it once? Don't — that's the over-engineering trap. Simple beats clever.

---

## Power tool 2 — Sub-agents

A sub-agent is a **helper your main agent spins up for a bounded job** — and the key win is that it gets its **own clean context window**.

Remember the desk analogy: your context window is working memory, and a cluttered desk gives worse answers. A sub-agent is like handing a colleague a single, well-defined task on a *separate* desk. They go off, do the one job in their own clean space, and hand you back **just the answer** — not all their mess. Your main agent's desk stays clean, so it keeps giving you good answers.

### The two honest use cases

1. **Keep the main context clean** — a big, messy job (read thirty files to find one thing; trawl fifty websites for a piece of research) happens *over there*, and only the summarised result comes back. You don't want forty irrelevant pages cluttering the main desk.
2. **Explore options in parallel** — fire off several sub-agents at once to evaluate different approaches. "What would three different approaches look like?" — one helper per approach, side by side, then compare. (I use exactly this in my risk-management platform for stress-testing scenarios — one agent on climate, one on geopolitics, one on macroeconomics.)

You don't always have to spin one up yourself — your main agent will sometimes recognise a sub-agent would be more efficient and do it on its own, often during the planning phase of a big task.

### Temp, not a new hire

Careful with the "first employee" metaphor. A sub-agent **isn't a new employee — it's a temp.** Your Chief of Staff brings one in for the afternoon and lets them go: no memory, no identity, gone when the job's done. A genuinely *separate* core agent (its own identity, memory, desk) is a real second hire — and you only want one when you've got a genuinely separate world (a locked-down work agent kept apart from your personal one, say). For almost everyone, the right answer for a long time is **one Chief of Staff who brings in temps as needed.**

### When *not* to

This is where people hurt themselves. Sub-agents *feel* clever, so you reach for them for everything — agents spawning agents spawning agents — and then something's wrong three layers down and you cannot debug it. **Default to a single loop.** Reach for a sub-agent only when the job is genuinely big, or genuinely parallel. Most days you won't need one — I use them quite sparingly myself.

`/agents` manages them.

---

## Power tool 3 — Scheduled jobs

A scheduled job makes the agent work for you **on a timer** — everything so far happens only when you're at the keyboard.

### Get this right first — local, not cloud

There are **two flavours** of scheduling, and the difference matters:

| | Cloud (`/schedule`) | Local (cron / launchd) |
|---|---|---|
| Runs on | Anthropic's servers | **Your own machine** |
| Can reach | GitHub, your connectors (email/calendar) | Your connectors **and your local vault/files** |
| Can read/write your vault? | ❌ No | ✅ Yes |
| Needs your machine awake? | No | **Yes** |

The `/schedule` command sets up the **cloud** kind — fine for GitHub/connector-only jobs, but it **cannot see your vault.** For anything touching your notes, your files, your `/master-prompt` — you want the **local** route.

**You don't write cron syntax.** Just ask your agent, in plain English:

```
I have a custom slash command called master-prompt which I currently run manually.
Please set up a schedule to run it automatically at 10pm each Sunday evening.
```

It'll ask which approach you want — choose **local**. The full recipe (what it sets up, how it survives a reboot, how to check it ran) is in the dedicated guide:

→ **[`guides/local-scheduled-tasks.md`](./guides/local-scheduled-tasks.md)**

The concept only (you don't need the plumbing): a **cron job** is just a small program set to run on a schedule. **launchd** (macOS) — or **systemd** (Linux) — is the bit that makes sure it *survives a restart*: when you reboot, it brings the job back at the right time. Your agent knows how to wire all of that.

### The best thing to schedule: the agent improving itself

I scheduled `/master-prompt` to run weekly. Every Sunday at 10pm a headless Claude session reviews my recent sessions and writes a **proposal** into the vault — updates to `user.md`, `soul.md`, `goals.md`, `claude.md`. That word matters: it **proposes**; it doesn't just change things. I read the suggestions, keep the ones I like, discard the rest. I stay in the driving seat. **It prepares; I decide.**

### Reactive → proactive

This is the real shift: scheduling turns your agent from something that *waits* for you into something that *nudges* you. My accountability task runs three times a day (10am, midday, 4pm) and checks in on what I said I'd do. Some people run a job every half hour that scans their inbox and pings them only if something genuinely important has landed. A heartbeat that keeps the thing ticking along on its own.

### Same guardrail as everything today

Start with **one** simple scheduled job that obviously helps. Don't build a cron empire on day one — a single timer you understand beats ten you don't. And because a scheduled job acts while you're *not* watching, **start it read-only**: let it *prepare* things for you to approve, not send or spend, until it's earned the trust. You wouldn't hand a new assistant your bank card on day one.

---

## A timely aside — models and `/model`

Two days before this session a new model, **Fable**, was released. `/model` lets you switch:

- **Haiku** — cheap and fast, for simple jobs.
- **Sonnet** — the everyday middle ground.
- **Opus** — the heavy model for complex tasks.
- **Fable** — reserved for the hardest, long-running work; ~2× faster than Opus, but it gets through your usage limits quicker.

Match the model to the task. (Alison put Fable to work this week and built a contract-risk register in Excel that would have taken her a month — though she hit her credit limit by six in the evening. That's the trade-off with the heavy model.)

---

## Useful commands shown live

| Command | Where | What it does |
|---------|-------|--------------|
| `/help` | in a session | The full, always-current list of slash commands |
| `/context` → `/clear` → `/context` | in a session | See the desk, wipe it, confirm — identity stays loaded |
| `/resume` | in a session | Pick up an earlier session from a list |
| `/model` | in a session | Switch model (Haiku / Sonnet / Opus / Fable) |
| `/mcp` | in a session | Your connected MCP servers |
| `/usage` (`/cost`, `/stats`) | in a session | Session cost, plan usage, streak/tokens |
| `/agents` | in a session | Manage sub-agents |
| `/session-retro` (example custom command) | in a session | A command *you* author — fires a saved instruction |
| `/schedule` | in a session | Cloud routines — **can't see your vault** (use local instead) |

---

## Gotchas — things that bite, listed so they don't bite you

### Gotcha 1 — `/schedule` is the *cloud* one
It's the most natural command to reach for, and it's the wrong one for anything that touches your vault. Cloud routines run on Anthropic's servers and can't see your local files. For vault work, set up a **local** task (ask your agent; choose "local"). See the scheduling guide.

### Gotcha 2 — A local job needs the machine awake
A cron/launchd job only runs while your computer is on. Same three options as the connectors week: leave the laptop on, a ~£60 Raspberry Pi, or a small cloud box. If the machine's asleep at the scheduled time, the job doesn't run.

### Gotcha 3 — Sub-agents are a debugging trap
Agents spawning agents spawning agents is almost impossible to debug when it goes wrong three layers down. Default to a single loop; reach for a sub-agent only when the job is genuinely big or parallel.

### Gotcha 4 — Custom command might build as a skill
Recent versions merge commands into skills. If you asked for a command and it made a skill, that's fine — both give you `/name`. Say "make it a custom command, not a skill" if you specifically want the command form.

### Gotcha 5 — Schedule it read-only first
A job that can *send* or *spend* unattended is how you get a nasty surprise. Have it write proposals for you to approve until you trust it.

---

## Homework for Session 8 — in priority order (and the order *is* the lesson)

1. **Author one custom command** for something you actually repeat. One is plenty.
2. **Schedule one job** — a daily digest, or `/master-prompt` weekly, is the obvious start. Local, read-only.
3. **Only if a real job needs it, try one sub-agent.** If nothing this week needs one — *don't*. That's the whole point.
4. **Do a simplify pass** on your agent — look at anything you've over-built and cut it back to a simple loop. (Tied yourself in a knot? Ask me for a quick "simplify" session.)

**Email any issue** to `gavin@slaters.uk.com`, subject `S7 issue: <one-liner>`. Don't sit on blockers.

---

## What's next — Session 8: from runners to builders (the last one)

Next week we get ambitious: the basic building blocks of **building your own applications**. Nothing too complicated — the *process* steps, so you build muscle memory on a simple app. Remember: you don't need to know how to code — your agent already has those skills; you need to know how to **direct** it. (This is where the "what's my MCP server?" thread pays off — an application is how you eventually expose something valuable, like Richard's co-create method, to the outside world.)

It's also our **Show & Tell** — please **bring a short demo (5 minutes is plenty)** of something you've built or wired up across the course. Rough and working beats slick and imaginary.

---

## Links

- **Starter repo**: https://github.com/gavraq/ai-training-starter
- **The guides** (detailed step-by-step): [`guides/`](./guides/)
  - [Slash commands worth knowing](./guides/claude-code-slash-commands.md) — the built-ins reference
  - [Local scheduled tasks](./guides/local-scheduled-tasks.md) — cron/launchd the agent sets up for you
  - …plus the Session 6 connector guides (Telegram, Gmail/Calendar, the notes server)
- **AI Training Notes server**: https://aitraining.gavinslater.co.uk — point your *agent* at it, not your browser (now includes the Session 7 notes)
- **Session 6 notes** (Phase 3 — connectors): https://github.com/gavraq/ai-training-starter/blob/main/session-6-notes.md
- **Session 5 notes** (Phase 2 — memory): https://github.com/gavraq/ai-training-starter/blob/main/session-5-notes.md

---

*Recorded 2026-06-12. ~90 minutes. Power tools — commands, sub-agents, scheduled jobs. Keep it simple.*
