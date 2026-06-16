# Claude Code Slash Commands — The Ones Worth Knowing

**Goal:** Get comfortable with the **built-in** slash commands that ship with Claude Code — the shortcuts you type with a `/` to control your session — and know where the full list lives.

**Audience:** Everyone on the AI training cohort. Same teach-others style as the connector guides — read it top to bottom, then keep it as a reference.

**Read this first:** A slash command is just a shortcut. You type `/` followed by a name (like `/clear`) at the **start** of a message, and Claude Code does something — switches model, clears context, shows you settings, and so on. They ship *with* Claude Code; you don't install them. Later in the course you'll learn to write your **own** commands too (see *"Built-in vs your own"* at the end) — but this guide is about the ones that are already there.

> 💡 **The single most useful thing to remember:** type `/` in any Claude Code session to see every command available to you, or `/` plus a few letters to filter. And `/help` shows the lot. You never have to memorise this guide — `/help` is always the current, complete truth.

---

## How to use them

- A command only works at the **start** of your message. `/clear` works; "please /clear" does not.
- Anything you type after the command name is passed to it. `/model opus` switches straight to Opus; `/rename Marathon Planning` names the session.
- Many have **aliases** (e.g. `/cost` is the same as `/usage`). Use whichever you remember.
- Type these in your **Claude agent session** (where you talk to your agent), not a plain terminal shell.

---

## The commands worth knowing

You'll use a small handful daily. Here they are, grouped by what they're for.

### Keep the session tidy (manage the "desk")

Your context window is the agent's working memory — its desk. These keep it clean.

| Command | What it does |
| ------- | ------------ |
| `/context` | Show how full the desk is right now — a coloured grid of what's using your context window. |
| `/clear` | Start a **fresh** conversation with an empty desk — but your identity files stay loaded. Use it when you switch to a new task. (Aliases: `/reset`, `/new`.) |
| `/compact` | Summarise the conversation so far to free up space, **without** losing the thread. Optionally tell it what to focus the summary on. |
| `/rewind` | Roll the conversation (and any code changes) back to an earlier point — an "undo" for the session. (Aliases: `/checkpoint`, `/undo`.) |
| `/recap` | Get a one-line summary of what this session has been about. |

> 💡 **Rule of thumb:** new task → `/clear`. Same task but the desk's getting cluttered → `/compact`. Went down the wrong path → `/rewind`.

### Steer the agent

| Command | What it does |
| ------- | ------------ |
| `/model` | Switch which Claude model you're using (and save it as your default). Run it with no argument for a picker. |
| `/agents` | Manage **sub-agents** — focused helpers your agent can hand bounded jobs to. |
| `/mcp` | Manage your **connectors** (MCP servers) — log in, reconnect, enable/disable. This is what you used to connect Gmail, Calendar and the notes server. |
| `/permissions` | Decide what your agent is allowed to do without asking each time (allow / ask / deny rules). Worth knowing before you let it run unattended. |
| `/plan` | Switch into **plan mode** — the agent thinks through a big change and shows you the plan before doing anything. |

### Move around your sessions

Once you have several sessions on the go, these are gold.

| Command | What it does |
| ------- | ------------ |
| `/rename` | Name the current session (shown on the prompt bar). "My last session" doesn't cut it once you have four open. |
| `/color` | Colour the prompt bar for this session — a visual marker (e.g. marathon green, work orange). |
| `/resume` | Pick up an earlier conversation by name or from a picker. (Alias: `/continue`.) |
| `/branch` | Fork the current conversation so you can try a different direction without losing where you are. |
| `/exit` | Exit cleanly — this fires the session-end hook that writes your day into memory, so use it rather than just closing the window. (Alias: `/quit`.) |

### Reach your session from elsewhere

| Command | What it does |
| ------- | ------------ |
| `/remote-control` | Make this session controllable from claude.ai (e.g. your phone), while it keeps running on your machine. (Alias: `/rc`.) |
| `/teleport` | Pull a session you started on the web into your terminal. (Alias: `/tp`.) |
| `/desktop` | Continue the current session in the Claude Code **desktop app**. (Alias: `/app`.) |
| `/mobile` | Show a QR code to get the Claude mobile app. |

### Set up & find your way

| Command | What it does |
| ------- | ------------ |
| `/help` | Show help and the full command list. **Your starting point.** |
| `/init` | Create a starter `CLAUDE.md` for a project (tells Claude what the project is). |
| `/memory` | Edit your `CLAUDE.md` memory files and view auto-memory. |
| `/config` | Open Settings — theme, default model, preferences. (Alias: `/settings`.) |
| `/skills` | List the skills your agent has available. |
| `/hooks` | View your configured hooks (the code that runs automatically). |
| `/usage` | Show your session cost and plan usage. (Aliases: `/cost`, `/stats`.) |
| `/status` | Show version, model, account and connectivity. |
| `/doctor` | Diagnose your Claude Code install if something's off. |

---

## Scheduling — one important caveat

| Command | What it does |
| ------- | ------------ |
| `/loop` | Repeat a prompt on a timer **while your session stays open** (e.g. `/loop 5m check if the deploy finished`). |
| `/schedule` | Create scheduled **routines** — but read the warning. (Alias: `/routines`.) |

> ⚠️ **`/schedule` runs in the cloud, not on your machine.** It creates routines on Anthropic-managed infrastructure, which means **they cannot see your local vault** — they only reach GitHub repos and your connectors. For anything that needs your vault (your weekly digest, your notes, running `/master-prompt`), **don't use `/schedule`** — use a *local* scheduled task instead (covered in the Session 7 notes). `/schedule` is fine for GitHub/connector-only jobs.

---

## Built-in vs your own

Everything above ships with Claude Code. But you can also **write your own** commands — that's exactly what `/master-prompt` is.

A command is just a markdown file with an instruction inside. Drop a file at `.claude/commands/standup.md` and you've created `/standup`. Recent Claude Code versions have **merged custom commands into skills** — so a file at `.claude/commands/standup.md` and a skill at `.claude/skills/standup/SKILL.md` both create `/standup` and work the same way. Your existing `.claude/commands/` files keep working exactly as before.

The difference, in plain terms:
- A **command** is something *you* fire deliberately, by name (`/standup`, `/master-prompt`).
- A **skill** is something your agent reaches for *on its own* when the conversation calls for it.

Deliberate and on-demand → a command. Automatic and context-triggered → a skill. When in doubt, start with a command — it's simpler and you stay in control. (The Session 7 notes have a full recipe for authoring your own.)

---

## This isn't every command

Claude Code ships with **a lot** of commands — including developer, enterprise and diagnostic ones you'll almost certainly never need (cloud-provider setup, heap dumps, sandboxing, and so on). This guide covers the ones that matter for using your agent day to day.

**For the complete, always-current list, type `/help` in your session** (or just `/` to browse). The official reference is here: <https://code.claude.com/docs/en/commands>. The set changes between releases, so the live list is the source of truth — not any written guide.

---

*See also: `aitraining-mcp-setup.md`, `telegram-channel-setup.md`, and the Gmail/Calendar guides — the connector setups for this cohort. And the Session 7 notes for authoring your own commands and scheduling local tasks.*
