# Adding a Second Google Calendar to Claude Code (Self-Hosted MCP Server)

**Goal:** Make a second, *work* Google Calendar available in Claude Code **at the same time** as your personal calendar — just like the Gmail guide does for email.

**Audience:** Non-coders on the AI training cohort. Every step is one small action. Don't skip ahead; do them in order.

**Read this first:** This guide is the calendar twin of **`gmail-mcp-second-account-setup.md`**. If you've already followed that Gmail guide, the hardest part is **already done** — you reuse the very same Google account setup here. If you haven't, do the Gmail guide first; this one assumes that groundwork exists.

**Time:** ~5 minutes if you've done the Gmail guide. ~15 minutes if starting fresh.

---

## Why this is needed

The claude.ai built-in Calendar connector can only hold **one** Google account at a time — same limitation as Gmail. To see your **work** calendar *and* your **personal** calendar together, you run a small calendar server on your own machine for the work account. We use **`@cocal/google-calendar-mcp`**, the calendar partner to the Gmail server.

---

## The good news: you reuse the Gmail setup

If you followed the Gmail guide, you already have:

- ✅ A Google Cloud project (signed in as your **work** account)
- ✅ An OAuth "Desktop app" credential, saved as `~/.gmail-mcp/gcp-oauth.keys.json`
- ✅ Your work email added as a "Test user"

You will **reuse all three**. You only need to flip on one extra switch (the Calendar API) and run the calendar version of the commands.

> Haven't done the Gmail guide? Stop and do **Part A** of `gmail-mcp-second-account-setup.md` first (create the project, the OAuth credentials, and add your test user). Then come back here.

---

## Step 1 — Turn on the Calendar API (1 minute)

This is the only Google Cloud change. It's the same kind of click you did to turn on Gmail.

1. Go to <https://console.cloud.google.com/>.
2. Make sure you're signed in with your **work** Google account (top-right avatar).
3. Make sure the **same project** from the Gmail guide is selected (top bar, project dropdown — e.g. `google-mcp-server`).
4. Open the left menu: the navigation panel is hidden by default, so click the **☰ hamburger icon** (top-left, next to "Google Cloud"). Then go to **APIs & Services → Library**.
5. Search for **Google Calendar API**.
   - ⚠️ Just like Gmail, the search shows two results. Pick **"Google Calendar API" (Google Enterprise API)** — the classic one. **Do NOT** pick **"Google Calendar MCP API"**: that's Google's *own* managed MCP service (behind the claude.ai built-in connector), not what this self-hosted server uses. Choosing it will make the auth step fail later.
6. Open it → click **Enable**.

That's the entire console part. ✅

---

## Step 2 — Connect your work calendar (browser sign-in)

> 🤖 **Your AI agent can run this step for you** — it'll launch the sign-in and confirm the token saved. The command below is exactly what it runs, shown for transparency. The browser sign-in itself is the one bit only *you* can do (you're approving access to your own Google account).

If you are doing it manually yourself then:
Copy this line, paste it into your Terminal, press Enter:

```bash
GOOGLE_OAUTH_CREDENTIALS=~/.gmail-mcp/gcp-oauth.keys.json npx @cocal/google-calendar-mcp auth
```

What happens:
- Your browser opens.
- **Sign in with the work account.**
- You'll see a "**Google hasn't verified this app**" warning — this is expected because it's your own personal setup. Click **Advanced → Go to… (unsafe) → Continue/Allow**.
- The terminal confirms success. Your calendar access is now saved on your machine.

> This reuses the exact same `gcp-oauth.keys.json` file from the Gmail guide — you are not creating anything new here.

---

## Step 3 — Tell Claude Code about it (1 line)

> 🤖 **Your AI agent can run this step too** — and verify the server shows ✓ Connected. The command below is exactly what it runs, shown for transparency. Remember to **restart Claude Code once** afterwards so the new tools load.

If you are doing it manually yourself then:
Copy, paste, Enter:

```bash
claude mcp add gcal-work -e GOOGLE_OAUTH_CREDENTIALS=$HOME/.gmail-mcp/gcp-oauth.keys.json -- npx -y @cocal/google-calendar-mcp
```

Plain-English breakdown (same shape as the Gmail command):
- `gcal-work` — the name we're giving this calendar server (keeps it separate from your personal one).
- `-e GOOGLE_OAUTH_CREDENTIALS=...` — points it at the credentials file you reused.
- `--` — a divider; everything after it is the program to run. Keep it.
- ⚠️ Use **`$HOME`**, not `~`, here. A `~` buried inside `-e VAR=~/...` is **not** expanded by the shell, so the server would look for a literal `~` folder and fail to find your credentials. `$HOME` expands correctly. (If you prefer, type your full path instead, e.g. `/Users/yourname/.gmail-mcp/gcp-oauth.keys.json`.) Note this only bites in Step 3 — the Step 2 `auth` line keeps `~` and works fine, because there it's a real variable assignment that the shell *does* expand.

Want it available in **every** project, not just this folder? Add `-s user`:

```bash
claude mcp add gcal-work -s user -e GOOGLE_OAUTH_CREDENTIALS=$HOME/.gmail-mcp/gcp-oauth.keys.json -- npx -y @cocal/google-calendar-mcp
```

---

## Step 4 — Check it worked

Restart Claude Code (close and reopen), then check it's connected:
- **In your terminal** (not inside a Claude session): `claude mcp list`
- **Inside a running Claude session**: the `/mcp` slash command

```bash
claude mcp list
```

You should see **`gcal-work` ✓ Connected**, sitting next to your existing **`claude.ai Google Calendar`** (which stays on your personal account). (`claude mcp list` is a shell command; `/mcp` is its in-session equivalent — they're not interchangeable.)

✅ Done. You now have **both** calendars live.

---

## How the two calendars coexist

| | Personal calendar | Work calendar |
|---|---|---|
| Server | claude.ai built-in connector | self-hosted `gcal-work` |
| Auth | handled by claude.ai | your reused `~/.gmail-mcp/gcp-oauth.keys.json` |

The two never clash. When you ask Claude about your schedule, **name the calendar** — "what's on my **work** calendar tomorrow?" vs. "check my **personal** calendar" — so it looks in the right place.

---

## If something goes wrong

- **`access_denied` when signing in** → your work email isn't listed as a Test user. Fix it in Part A of the Gmail guide (OAuth consent screen → Test users), then re-run Step 2.
- **"credentials not found"** → the file isn't where we said. Check it exists: `ls -la ~/.gmail-mcp/gcp-oauth.keys.json`. If you never did the Gmail guide, do its Part A first.
- **"app isn't verified" warning** → normal and safe for your own setup; click through Advanced → Go to…
- **`gcal-work` not Connected** → re-run Step 2 (the `auth` line); the sign-in may not have completed.

---

## Removing it later

```bash
claude mcp remove gcal-work
```

(Your Gmail server and credentials are untouched — they share the keys file but are separate servers.)

---

*See also: `gmail-mcp-second-account-setup.md` (the email version of these exact steps) and `gmail-mcp-swap-connector.md` (the no-setup, one-at-a-time alternative — the same swap idea works for the calendar connector too).*
