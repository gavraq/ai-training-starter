# Session 6 — Phase 3: Connecting Your Agent to the World

Companion notes to the video. Everything we covered, every command we ran, every gotcha worth knowing.

This is the single reference file for the week. Refer back to it as you do the homework. The detailed step-by-step connector guides live in [`guides/`](./guides/) — this file is the map; the guides are the territory.

---

## What we covered

Phase 1 (Sessions 4 + 4b) gave your agent an **identity**. Phase 2 (Session 5) gave it a **memory** and a self-improvement loop. Phase 3 connects it to the outside world.

The mindset shift for this phase: you do **not** need to become an expert in authentication (you'll see your agent mention "OAuth"), tokens, or transports — your agent handles the plumbing. Your job is to know **what you're trying to achieve** and how to **direct** the agent to make it real. You've effectively hired your first employee; the skill now is giving good direction — and having somewhere structured for the work to land.

We worked through three **lenses**:

1. **Consume** — your agent reaches *out* to services (email, calendar, the web).
2. **Reach** — *you* reach your agent from anywhere (text it from your phone).
3. **Provide** — *you* expose your own data for *other people's* agents.

The third is the one to sit with all week.

---

## No branch merge this week

Unlike Session 5, **there is nothing to `git merge`**. Connectors are added with **commands** (`claude mcp add`) and **slash commands** (`/mcp`, `/telegram:configure`), not by pulling new files into your repo. That removes the single biggest source of last week's home-friction. Nothing in your repo changes — you're configuring your agent, not re-coding it.

---

## First, one distinction that trips everyone up: terminal vs agent

This came up live (Tiffany's GitHub setup, Nathan's `cd` question) and it matters all session:

- A **terminal shell** is the plain command line you opened (a "basic" profile window). Setup commands like `claude mcp add …` go **here**.
- A **Claude session** is what starts when you type `claude` in that terminal — now you're *talking to your agent*. Your questions and requests go **here**.

They look similar (both in a terminal window) but they're different. **Setup commands → a plain terminal. Conversation → your agent.**

> One nuance: inside a Claude session you can run a shell command by prefixing it with `!` — e.g. `!git status`. That runs the terminal command from within the agent session. Ask your agent: *"Explain how the `!` prefix runs shell commands from here, with one simple example."*

---

## What MCP actually is

**MCP** (Model Context Protocol) is a *standard way* of handing a service to an agent — a consistent set of tools (read these emails, list these events, search this) without hand-wiring each one. The analogy: MCP is the **USB-C of AI tools** — one shape, lots of devices. Email, calendar, a database, a notes server — if it has an MCP server, your agent plugs in the same way every time.

A **server** is just a computer somewhere that answers ("serves") requests. A normal web server answers your *browser* and hands back a page for a human to read. An **MCP server** answers your *agent* and hands back data the agent can use.

---

## LENS 1 — Consume: your agent reaches out

### The easy path — your main Gmail + Calendar (one login)

The claude.ai **managed connectors** (the toggles you've seen in the Claude desktop/web app) **also work in Claude Code**. For your *main* account it really is one login:

Inside a Claude session:

```
/mcp
```

Pick the Gmail / Calendar connector, log in once with your Google account, done. **No Google Cloud setup.** This is the path most of you want.

Then just ask, e.g.:

```
Check my inbox for any update on the Copenhagen Marathon, and tell me what
runs I have planned this week. Make any necessary project updates.
```

Push it to *act*, not just read:

```
Draft an email to Roger in my voice about the marathon update.
```

Notice what it does and doesn't do: it **drafts**, it does **not send**. Reading your inbox is one permission; sending as you is a completely different one. **You stay in control.** And remember the structure point — when the agent brings things back, tell it where to file them (*"put that draft under my Copenhagen Marathon project"*). A connected agent with nowhere to file things just makes a bigger heap.

### The friction *is* the lesson

Connecting your **main** account is easy. The bit of one-time setup only shows up in two cases:

1. A **second** account you want live *alongside* the first.
2. A service with **no ready-made connector**.

That friction isn't a flaw — it's the point. Anything reaching into *your* private data should make you prove it's you. The things you can plug in with zero setup are public data, not your life.

### A second Gmail / Calendar account

The managed connector holds **one** Google account at a time. Two ways to get a second:

- **Swap** the connector between accounts via `/mcp` — zero setup, one inbox live at a time. → [`guides/gmail-mcp-swap-connector.md`](./guides/gmail-mcp-swap-connector.md)
- **Self-host** a second small MCP server so both run at once — a ~10–15 min one-time Google Cloud OAuth setup. → [`guides/gmail-mcp-second-account-setup.md`](./guides/gmail-mcp-second-account-setup.md) and the calendar twin [`guides/gcal-mcp-second-account-setup.md`](./guides/gcal-mcp-second-account-setup.md)

The self-host route is the "friction" walkthrough from the video: Part A creates Google OAuth credentials (you must do this yourself in the Google Cloud Console), Part B authenticates the server (your agent can do most of it; only the browser sign-in is yours), Part C registers it with Claude Code. The calendar version reuses the exact same Google project — you only flip on the Calendar API.

### Web search — the "no ready-made connector" case

Your agent can already search the web a little (built in, no setup). But many sites **block** automated visitors, so built-in search comes back thin. When it matters, a **specialist search connector** like **Firecrawl** gets through and returns cleaner results — sign up, get an API key, connect it once. Same lesson: even "search the web, but properly" is a connector with a one-time setup.

### Google Keep (Richard's question)

On a **personal** Google account there's no clean way in — the proper Keep API is **Workspace-only**. On a **corporate Workspace** you have a path the rest don't, but you may need your IT admin to enable it. Once enabled, it's the same pattern as Gmail/Calendar. The general lesson: **check for an official API first** — when there is one (Gmail, Calendar, Tasks, Notion) it's clean; when there isn't (consumer Keep), you're into hacks.

---

## LENS 2 — Reach: text your agent from your phone

### The menu — ways to reach your agent

| Option | What it is | What you need |
|--------|------------|---------------|
| **`/remote-control`** (alias `/rc`) | Drive a session you've *already got open*, from the claude.ai app | Nothing extra — built in; laptop on |
| **Telegram** (native channel) ⭐ | Text a bot → arrives in a running session, two-way | A BotFather token (free, 2 min) + Bun + machine on |
| **iMessage** (native channel) | Text from Messages, two-way | **macOS only**; grant Full Disk Access; uses your personal iMessage; machine on |
| **WhatsApp** (not native) | Community plugin or Twilio/Meta Business API | More setup; really only if you already have a business WhatsApp |
| **DIY bot** (`claude -p --resume`) | Your own responder, full control | You write/host it |

Telegram is where most of you should start.

### The Telegram setup — five steps

Full step-by-step (with every click): → [`guides/telegram-channel-setup.md`](./guides/telegram-channel-setup.md)

**Prerequisites**: Bun installed (`bun --version`; if missing `curl -fsSL https://bun.sh/install | bash`), the Telegram app on your phone, and the plugin installed:

```
/plugin install telegram@claude-plugins-official
/reload-plugins
```

Then, the shape of it — I've marked which steps are **yours** (terminal/phone) and which the **agent** can do:

1. **Create the bot in BotFather** *(you, in Telegram)* — message `@BotFather`, send `/newbot`, give it a name and a username ending in `bot`. It hands you a **token** (treat it like a password).
2. **Give your agent the token** *(agent or you)* — `/telegram:configure 123456789:AA…` writes it to `~/.claude/channels/telegram/.env`.
3. **Restart with the channel on** *(you, terminal)* — exit, then:
   ```
   claude --channels plugin:telegram@claude-plugins-official
   ```
   The bot only listens while a session is running with this flag.
4. **Pair yourself** *(you only)* — DM the bot any message; it replies with a 6-char pairing code; back in your session **you** type `/telegram:access pair a4f91c`. The safety classifier **blocks the agent** from doing this one — approving who can drive a shell-capable agent on your machine is always a human action.
5. **Lock it down** *(agent or you)* — `/telegram:access policy allowlist` so strangers get silently dropped.

That's it: make it, hand over the token, switch it on, say hello, approve yourself, lock it down.

### The live demo

Text the bot from your phone:

```
Add 'book the boiler service' to my tasks.
```

It confirms, and the task lands (tagged) in your `scratch.md` back at the desk. Then:

```
What's on my calendar tomorrow, and what did I say I'd follow up with Nathan about?
```

Calendar (the connector from Lens 1) **and** memory (the vault) — both answered from your pocket.

### The one bit of real infrastructure — always-on

For your agent to answer a text while you're out, **something has to be on and listening**. Three options, cheapest first:

1. **Leave your laptop on** — fine to start; set it not to sleep.
2. **A Raspberry Pi** — ~£60 once, sips power, sits in a drawer. (That's what runs the notes server in Lens 3.)
3. **A small cloud box** — e.g. ~£180 for two years on Hostinger, or AWS — someone else keeps it on.

You do **not** need a data centre. You need one machine that stays awake. If that's a step too far this week, do the consuming and come back to being reachable when you're ready.

### Guardrails

An agent acting on your behalf while you're not watching is powerful and occasionally wrong. **Start read-only.** Decide in advance what it may do unattended, and earn the trust before you let it send or spend. By default Claude Code pauses for permission when it hits something sensitive — that's a feature.

---

## LENS 3 — Provide: what's your MCP server?

The biggest shift coming isn't your agent reading the web — it's the web becoming **readable by agents**. "Here's my website" becomes "here's my MCP server." And you can be on the providing side.

### Connect to the AI Training Notes server

This is the one connector with **no per-account setup** — because it was built to be shared. It puts the whole course's teaching notes inside your agent, so you can ask it what the course says about anything.

Full guide: → [`guides/aitraining-mcp-setup.md`](./guides/aitraining-mcp-setup.md)

In a **terminal** (substitute the personal token emailed to you):

```bash
claude mcp add aitraining -s user \
  --transport http \
  https://aitraining.gavinslater.co.uk/mcp \
  --header "Authorization: Bearer YOUR_TOKEN_HERE"
```

What each part means:
- `claude mcp add` — tell my agent about a new connector.
- `-s user` — make it available in **every** project, not just this folder (recommended).
- `--transport http` — this server lives out on the internet.
- `aitraining` — a nickname; the tools appear as `mcp__aitraining__*`.
- the URL — the address of the server (a web address, but for agents).
- `--header "Authorization: Bearer …"` — your token, proving you're allowed in.

> 🔑 **Your token is personal and was sent to you by email** — ask Gavin if you don't have one. Treat it like a password. **Never commit it to a git repo.** User scope (`-s user`, which writes to `~/.claude.json` outside any repo) keeps it out of your tracked files.

**Restart Claude Code** so the new tools load, then verify — `/mcp` inside a session, or `claude mcp list` in a terminal. You should see `aitraining … ✓ Connected`. Then ask:

```
Use the aitraining tools — what did Session 5 teach about hooks?
```

Your own agent answers from the course material.

### The point — it's about *providing*

Notice that just *worked* — no login, no setup, no proving who you are. Why? Because it was **built to be shared**, open with one key. That was a choice, by the provider. Your Gmail needs a login because it's *yours*; the notes server didn't, because it was *opened*. So the real question of the whole session isn't what you can consume — it's **what would you provide?**

### Your data is a latent MCP server

Everyone is sitting on something an agent would want to ask:
- A dietitian → a nutrition-rules server a client's agent consults.
- An accountant → a deadlines-and-rules server.
- A personal trainer → an exercise-and-programming server.
- A lawyer → a compliance / precedent server.

Instead of a website a client visits, an MCP server their agent asks. A genuinely new channel, and almost nobody's doing it yet. (Channel Maxim's point: build the thing that **adds value**, not the thing that's merely possible.)

### Who gets in — the openness spectrum

Providing isn't all-or-nothing:
- **Fully open** — no key, anyone's agent can ask (a public reference, your published work, a price list).
- **Restricted** — a shared key for clients or a cohort (like the notes server today).
- **Private** — just you.

The skill is choosing the right door for each thing.

---

## Useful commands shown live

| Command | Where | What it does |
|---------|-------|--------------|
| `claude mcp add <name> …` | terminal | Register a new MCP server/connector |
| `claude mcp list` | terminal | List connectors and their status (✓ Connected / Failed) |
| `claude mcp remove <name>` | terminal | Remove a connector (add `-s user` if you added it at user scope) |
| `/mcp` | in a session | In-session panel of your connectors + log in to managed ones |
| `/plugin install telegram@claude-plugins-official` | in a session | Install the Telegram channel plugin |
| `/telegram:configure <token>` | in a session | Save your bot token |
| `/telegram:access pair <code>` | in a session | Pair your phone (you-only; agent is blocked from this) |
| `/telegram:access policy allowlist` | in a session | Lock the bot to paired users only |
| `claude --channels plugin:telegram@claude-plugins-official` | terminal | Launch a session with the Telegram channel listening |
| `/remote-control` (`/rc`) | in a session | Make this session drivable from the claude.ai app |

`claude mcp list` is a **shell** command; `/mcp` is its **in-session** equivalent — they are not interchangeable.

---

## Gotchas — things that bite, listed so they don't bite you

### Gotcha 1 — Tools don't appear after `claude mcp add`
You must **restart Claude Code once** so it loads the new server. Then re-check with `/mcp` or `claude mcp list`. (In the video: `/mcp` showed nothing for `aitraining` until after an exit/restart.)

### Gotcha 2 — One Telegram bot token allows only ONE listener
If you've got an old DIY responder *and* the native channel polling the **same** bot, they fight — Telegram returns errors and messages get dropped or split. **Fix**: stop the old responder, or create a second bot in BotFather for the channel. Also: while pairing, **don't run `claude mcp list`** (or anything that pokes the bot) — it briefly starts a second listener and eats the pairing reply.

### Gotcha 3 — Telegram only works while a `--channels` session is running
Close the terminal and the bot goes quiet; messages sent while it's offline are **lost** (Telegram doesn't queue them). For always-on, keep the session in a persistent terminal (tmux/screen) on an always-on machine.

### Gotcha 4 — `401 / 403` from the notes server
Bad, missing, expired, or revoked token. Re-add with the exact token you were emailed (watch for stray spaces or a missing `Bearer ` prefix). Ask Gavin for a fresh one if needed.

### Gotcha 5 — `$HOME`, not `~`, inside `-e VAR=…`
When self-hosting the calendar server, a `~` buried inside `-e GOOGLE_OAUTH_CREDENTIALS=~/…` is **not** expanded by the shell and the server won't find your credentials. Use `$HOME` (or the full path). See the calendar guide.

### Gotcha 6 — Pick the *Enterprise* API, not the *MCP* API
In the Google Cloud Library, searching "Gmail API" / "Google Calendar API" shows two results. Pick the classic **"… (Google Enterprise API)"**. **Do not** pick "Gmail MCP API" / "Google Calendar MCP API" — those are Google's own managed service (behind the claude.ai connector), and choosing them makes the self-host auth step fail.

### Gotcha 7 — Never commit tokens or OAuth secrets
Bot tokens, bearer tokens, Client ID/Secret, and `~/.gmail-mcp/` credentials all belong **outside** your tracked repo. Prefer user scope (`-s user`). If you must use a project `.mcp.json`, add it to `.gitignore` first.

---

## Homework for Session 7

In priority order:

1. **Use the notes server this week.** You connected live — now actually ask it things as you revise. (Command + your token are above / in the email.)
2. **Set up a way to reach your agent from your phone** — Telegram for most, iMessage if you're all-Apple. Start **read-only**. The always-on caveat is real — fine to defer if it's a step too far this week.
3. **The big one — sketch your MCP server.** One paragraph: what data or expertise do you hold that someone else's agent would want? What would it expose? Who would you open it to? Bring it to Session 7. This is a **value** question, not a can-you question.
4. **(Owed)** build at least one custom skill via `create-skill` if you haven't.
5. **Keep a gaps log** — anything that breaks or confuses. It drives Session 7.

**Email any issue** to `gavin@slaters.uk.com`, subject `S6 issue: <one-liner>`. Don't sit on blockers.

---

## What's next — Session 7: the power-user session

Still being finalised, but the plan is:
- **Sub-agents** — your agent spinning up its own helpers.
- **Scheduled jobs** — so it works for you on a timer.
- **A deep dive on the Claude Code commands** that make all of this smoother.
- Tying these connectors back into the self-improvement loop.

Bring your "what's my MCP server?" sketch. And the message to carry in: **keep it simple.** The inner harness is the Claude Code loop; the outer harness is what you build on top — a simple loop, a handful of skills, some custom commands, and a structure the agent understands. The moment you bolt on funky steps, it does funny things and you can't debug it.

---

## Links

- **Starter repo**: https://github.com/gavraq/ai-training-starter
- **The connector guides** (detailed step-by-step): [`guides/`](./guides/)
  - [AI Training Notes server](./guides/aitraining-mcp-setup.md) — the one-command, no-setup connect
  - [Telegram channel setup](./guides/telegram-channel-setup.md) — text your agent
  - [Second Gmail account (self-hosted)](./guides/gmail-mcp-second-account-setup.md)
  - [Second Google Calendar (self-hosted)](./guides/gcal-mcp-second-account-setup.md)
  - [Swap the Gmail connector (no-setup alternative)](./guides/gmail-mcp-swap-connector.md)
- **AI Training Notes server**: https://aitraining.gavinslater.co.uk — open it in a browser; it tells your *agent* what to do, not you
- **Session 5 notes** (Phase 2 — memory + self-improvement): https://github.com/gavraq/ai-training-starter/blob/main/session-5-notes.md
- **Session 4a notes** (installation + Phase 1 setup): https://github.com/gavraq/ai-training-starter/blob/main/session-4a-notes.md

---

*Recorded 2026-06-05. ~90 minutes. Phase 3 — Connectors.*
