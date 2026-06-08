# Connecting the AI Training MCP Server to Claude Code

**Goal:** Give your Claude Code agent access to the **course teaching notes** — the curated "Script Notes" for the *Build Your Own AI Agent* cohort — so you can ask it what the course says about any topic and get authoritative answers, not guesses.

**Audience:** Everyone on the AI training cohort. Same *teach-others* style as the Gmail, Calendar and Telegram guides — follow it top to bottom.

**Read this first:** This is the **easiest** of the four setups. Unlike the Gmail/Calendar connectors (OAuth) or Telegram (BotFather + local server), the AI Training server is a **remote, hosted HTTP server** that someone else runs for you. You don't install or run anything locally — you just point Claude Code at a URL and paste in your personal access token. **One command, ~2 minutes.**

---

## What this does

The server lives at `https://aitraining.gavinslater.co.uk/mcp` and exposes three tools to your agent:

| Tool              | What it does                                                     |
| ----------------- | ---------------------------------------------------------------- |
| `search_teaching` | Search the teaching notes for what the course says about a topic |
| `get_session`     | Read a whole session's notes end to end                          |
| `list_sessions`   | See which sessions exist                                         |

Once connected, you can just ask in plain English — *"what does session 4 say about hooks?"*, *"search the course notes for MCP setup"* — and Claude pulls the answer straight from the source material.

---

## Prerequisites

- **Claude Code** installed and signed in to your Anthropic account.
- **Your personal access token** for the server. This is a long string that looks like:
  ```
  d0473b20581ebc2e966ce4bf8869b0de8...
  ```
  You'll be **given your own token** by the course host (it identifies you to the server). Treat it like a password — don't share it or paste it into anything that gets committed to git.
- An internet connection (the server is remote — nothing runs on your machine).

> 🔑 **Don't have a token yet?** Ask Gavin. Each cohort member gets their own; there's no self-signup.

---

## Part A — Add the server (the whole setup)

> 🤖 **Your AI agent can do this for you** — paste it your token and ask it to add the AI Training server. The command below is exactly what it runs, shown for transparency.

In a terminal, run this — **substitute your own token** for `YOUR_TOKEN_HERE`:

```bash
claude mcp add aitraining \
  --transport http \
  https://aitraining.gavinslater.co.uk/mcp \
  --header "Authorization: Bearer YOUR_TOKEN_HERE"
```

What each part means:
- `aitraining` — the name the server shows up under. Keep it; the course tools are named `mcp__aitraining__*`.
- `--transport http` — tells Claude Code this is a remote HTTP server, not a local command.
- the URL — where the server lives.
- `--header "Authorization: Bearer …"` — your token, sent on every request so the server knows it's you.

> 💡 **Make it available everywhere.** By default the server is added only for the *current* project. To use it in **every** project, add `-s user`:
> ```bash
> claude mcp add aitraining -s user \
>   --transport http \
>   https://aitraining.gavinslater.co.uk/mcp \
>   --header "Authorization: Bearer YOUR_TOKEN_HERE"
> ```

---

## Part B — Verify it connected

Restart Claude Code (or start a fresh session so the new tools load), then check it's connected. There are two ways, depending on where you are:

- **In your terminal** (not inside a Claude session) — run:
  ```bash
  claude mcp list
  ```
  You should see:
  ```
  aitraining: https://aitraining.gavinslater.co.uk/mcp (HTTP) - ✓ Connected
  ```
- **Inside a running Claude Code session** — type the slash command:
  ```
  /mcp
  ```
  This opens an in-session panel listing your MCP servers and their status. (`claude mcp list` is a *shell* command and won't work as a slash command, and vice-versa.)

If it shows **✓ Connected**, you're done. Try asking your agent:

> *"Use the aitraining server — list the course sessions."*

---

## Equivalent manual config (if you prefer editing JSON)

The `claude mcp add` command just writes an entry like this. You can add it by hand instead (in `~/.claude.json` for user scope, or a project's `.mcp.json`):

```json
{
  "mcpServers": {
    "aitraining": {
      "type": "http",
      "url": "https://aitraining.gavinslater.co.uk/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

> ⚠️ **Never commit your token to a git repo.** If you put it in a project `.mcp.json` that's tracked by git, your token leaks to anyone who can see the repo. Prefer **user scope** (`~/.claude.json`, outside any repo) — that's what `-s user` does for you. If you must use a project file, add it to `.gitignore` first.

---

## Troubleshooting

- **`aitraining` shows "Failed to connect"** → most often a bad or missing token. Re-run Part A with the exact token you were given (check for stray spaces or a missing `Bearer ` prefix).
- **`401 Unauthorized` / `403 Forbidden`** → your token is wrong, expired, or revoked. Ask Gavin for a fresh one and re-add the server.
- **Tools don't appear after adding** → you need to **restart Claude Code** once so it loads the new server. Then re-check with `claude mcp list`.
- **Connects but returns nothing** → confirm you're actually invoking it: ask explicitly, e.g. *"search the **aitraining** teaching notes for hooks."*
- **Works in one project but not another** → you added it at project scope. Re-add with `-s user` to make it global (Part A tip).

---

## Removing the server

```bash
claude mcp remove aitraining
```

If you added it at user scope:

```bash
claude mcp remove aitraining -s user
```

---

## How this differs from the other connectors

| | AI Training | Gmail / Calendar (self-hosted) | Telegram |
|---|---|---|---|
| Where it runs | **Remote** (hosted for you) | Local on your machine | Local on your machine |
| Auth | A token you're handed | Google OAuth (you grant) | BotFather token + pairing |
| You install anything? | **No** | Node + a server package | Bun + plugin |
| Setup effort | **One command** | ~15 min, Google Cloud Console | ~10 min, BotFather |

It's the simplest because you're a *client* of a server someone else maintains — all you supply is the URL and your token.

---

*See also: `gmail-mcp-second-account-setup.md`, `gcal-mcp-second-account-setup.md`, and `telegram-channel-setup.md` — the other connector guides for this cohort.*
