# Messaging Your Claude Code Agent from Telegram (Channels)

**Goal:** Talk to your Claude Code agent from your phone via **Telegram** — send it a message anywhere, get replies back in the chat — using the official **Telegram channel** plugin.

**Audience:** Non-coders on the AI training cohort. Every step is one small action; do them in order.

**Read this first:** This is the same *teach-others* style as the Gmail and Calendar guides, but the mechanics are different — Telegram is a **"channel"** (a live messaging bridge), not an MCP data connector. The setup is mostly Claude Code slash-commands plus one trip to Telegram's BotFather.

**Time:** ~10 minutes.

---

## What this does (and doesn't)

**Does:** You create a private Telegram bot. While your Claude Code session is running, any message you send the bot is forwarded into that session; Claude's replies come back to you in Telegram. Claude is using your **real local machine** (files, git, tools) — Telegram is just the remote control.

**Doesn't:**
- ❌ **Work when Claude Code is closed.** The bot only listens while a session is running with the channel flag (see Part C). Messages sent while it's offline are **lost** (Telegram doesn't queue them).
- ❌ **See past messages.** Telegram's bot API exposes no history or search — Claude only sees messages as they arrive.
- ❌ **Run fully unattended by default.** If Claude hits a permission prompt, the session pauses until you approve it at the terminal.

---

## Prerequisites

- **Bun** — this plugin's server runs on Bun (not Node). Check in a terminal: `bun --version`. If missing: `curl -fsSL https://bun.sh/install | bash`.
- **Claude Code** running and signed in to your Anthropic account.
- The **Telegram app** on your phone or desktop, signed in to your own account.
- The plugin installed (you may have done this already):
  ```
  /plugin install telegram@claude-plugins-official
  /reload-plugins
  ```

---

## Part A — Create the bot in BotFather (you must do this yourself)

This happens inside the Telegram app — only you can do it.

1. In Telegram, search for **`@BotFather`** (the official one has a blue verified tick) and open the chat.
2. Send **`/newbot`**.
3. BotFather asks two things:
   - **Name** — the display name shown in chat headers. Anything, can have spaces (e.g. `Gavin's Assistant`).
   - **Username** — a unique handle that **must end in `bot`** (e.g. `gavin_assistant_bot`). This becomes the bot's link `t.me/Bob2demo_bot`.
1. BotFather replies with a **token** that looks like:
   ```
   123456789:AAHfiqksKZ8...
   ```
   **Copy the whole thing**, including the leading number and the colon. Treat it like a password — anyone with this token controls the bot.

> 💡 Keep BotFather open — if you ever need to change bot settings (like group privacy, Part F) you'll come back here.

---

## Part B — Give Claude Code the token

> 🤖 **Your AI agent can do this for you** — paste it the token and ask it to run the configure step. The command below is exactly what runs, shown for transparency.

In your Claude Code session:
```
/telegram:configure 123456789:AAHfiqksKZ8...
```
This writes `TELEGRAM_BOT_TOKEN=...` to `~/.claude/channels/telegram/.env`.

> Security: the token lives only in that local `.env` file (outside any git repo). Don't paste it into notes you might commit.

---

## Part C — Launch a dedicated Claude Code session with the channel flag (you must do this yourself)

The bot **won't connect** until you start a session with the channel turned on. This is a terminal step — an agent can't relaunch itself.

1. Exit your current session (`/exit` or Ctrl-D).
2. Start a new one with the flag:
   ```sh
   claude --channels plugin:telegram@claude-plugins-official
   ```

> 🔎 How to tell it worked: run `claude mcp list` in your terminal (or the `/mcp` slash command inside a running Claude session) — `plugin:telegram:telegram` should now show **✓ Connected**. (Without `--channels` it shows "Failed to connect" — that's normal and just means the channel isn't active in this session.)

---

## Part D — Text you Bot to get the pairing code and use your agent to pair your Telegram account

Pairing tells the bot *which* Telegram user is allowed in, without you ever handling numeric IDs.

1. With the `--channels` session running, **DM your bot** in Telegram (open `t.me/your_bot` → send any message, e.g. "hello").
2. The bot replies with a **6-character pairing code** (e.g. `a4f91c`).
   - If it doesn't reply, your session isn't running with `--channels` (redo Part C).
1. Back in Claude Code, **type this yourself** (see the ⚠️ below — the agent can't do this one for you unless you explicitly allow it):
   ```
   /telegram:access pair a4f91c
   ```
   If a permission prompt appears, approve it — that approval *is* you authorising the access grant.
2. Your next DM now reaches the assistant. 🎉

> ⚠️ **Pairing is a you-only step — the agent can't do it it for you in a fully automated way.** Approving a pairing grants the bot (and anyone who controls it) the ability to drive a shell-capable agent on your machine. Claude Code's safety classifier deliberately **blocks the agent** from editing the allowlist to approve a pairing — even at your spoken request — so that this specific grant is always an explicit human action. So *you* type `/telegram:access pair <code>` in your agent session so that claude knows it is a human doing it. (The agent reading the code out of the state file isn't enough; the command must be yours.)

---

## Part E — Lock it down (allowlist)

A Telegram bot is publicly addressable — anyone who guesses the username can DM it. By default the bot is in **`pairing`** mode (it replies to strangers with a pairing code). Once *you're* paired, switch to **`allowlist`** so strangers get silently dropped instead.

> 🤖 **Agent can do this.**
```
/telegram:access policy allowlist
```

That's the core setup done — you can now message your agent from your phone whenever a session is running.

---

## Part F — Access control reference

State lives in `~/.claude/channels/telegram/access.json`; the server re-reads it on every message, so changes apply without a restart.

**DM policy** — how DMs from non-allowlisted senders are handled:

| Policy              | Behaviour                                                |
| ------------------- | -------------------------------------------------------- |
| `pairing` (default) | Reply with a pairing code, drop the message.             |
| `allowlist`         | Drop silently, no reply. *(Recommended once you're in.)* |
| `disabled`          | Drop everything, even allowlisted users.                 |

**Add / remove people** (IDs are numeric; someone gets theirs by messaging [@userinfobot](https://t.me/userinfobot)):
```
/telegram:access allow 412587349
/telegram:access remove 412587349
```

**See current state** (policy, allowlist, pending pairings, groups):
```
/telegram:access
```

**Groups** (off by default — opt each one in):
```
/telegram:access group add -1001654782309
```
- Supergroup IDs are negative `-100…` numbers (find via [@RawDataBot](https://t.me/RawDataBot) added to the group).
- By default the bot only responds when **@mentioned or replied to**. To make it read every message, add `--no-mention` **and** disable privacy mode in BotFather: message `@BotFather` → `/setprivacy` → pick your bot → **Disable**.

---

## Keeping it running

The bot is only alive while a `claude --channels …` session is running. For always-on access, keep that session in a persistent terminal — e.g. a **tmux** or **screen** session you leave open, or a small background service. Close the terminal and the bot goes quiet until you relaunch - again using the specific channels flag - see below.

```
claude --channels plugin:telegram@claude-plugins-official
```

---

## Troubleshooting

- **`plugin:telegram:telegram` — "Failed to connect"** → you didn't launch with `--channels`, or no token is set. Do Part B then Part C.
- **Bot doesn't reply to my DM** → the `--channels` session isn't running (Part C), or the token is wrong (re-run Part B with the exact BotFather token).
- **I DM'd the bot but no pairing code appeared** → most likely a *second poller* swallowed the reply (see Part D's ⚠️ — usually caused by running `claude mcp list` while pairing). The code was still generated: open `~/.claude/channels/telegram/access.json` and look under `pending` for the 6-char code, then run `/telegram:access pair <code>` yourself. (Confirm the `senderId` there is your own Telegram ID before pairing.)
- **The agent says it "can't" complete the pairing / got a permission denial** → expected and correct. Approving a pairing is a human-only action by design; run `/telegram:access pair <code>` in your own terminal.
- **`bun: command not found`** → install Bun: `curl -fsSL https://bun.sh/install | bash`, then restart your terminal.
- **Strangers getting pairing-code replies** → switch to `allowlist` (Part E).
- **Stale/expired pairing code** → just DM the bot again for a fresh code; pairings expire after ~1 hour.
- **Bot silent in a group** → groups are opt-in (Part F), and privacy mode means it only sees @mentions/replies unless you disable it in BotFather.

---

## What the agent can vs. can't do for you

| Step                                    | Who                                               |
| --------------------------------------- | ------------------------------------------------- |
| A — Create bot in BotFather             | **You** (Telegram app)                            |
| B — `/telegram:configure <token>`       | Agent or you                                      |
| C — Relaunch with `--channels`          | **You** (terminal)                                |
| D — DM the bot for a code               | **You** (Telegram app)                            |
| D — `/telegram:access pair <code>`      | **You only** (safety classifier blocks the agent) |
| E — `/telegram:access policy allowlist` | Agent or you                                      |

---

*See also: `gmail-mcp-second-account-setup.md` and `gcal-mcp-second-account-setup.md` — the data-connector siblings to this messaging channel.*
