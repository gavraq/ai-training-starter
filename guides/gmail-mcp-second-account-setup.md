# Adding a Second Gmail Account to Claude Code (Self-Hosted MCP Server)

**Goal:** Run a second, self-hosted Gmail MCP server for a *work* Google account, **alongside** the existing claude.ai managed connector that serves your *personal* account — so both inboxes are queryable at the same time.

**Audience:** Anyone on the AI training cohort who already has one Gmail connected via the claude.ai connector and wants to add a second account. This is a teach-others reference — follow it top to bottom.

**Time:** ~10–15 minutes, most of it clicking in the Google Cloud Console.

---

## Why this is needed

The claude.ai managed Gmail connector (tools named `mcp__claude_ai_Gmail__*`) is **OAuth-bound to a single Google account**. You cannot attach a second account to it — reconnecting just *swaps* which account it points at. To have **both** inboxes available simultaneously you run a separate, locally-hosted Gmail MCP server for the second account. The two coexist; their tools are namespaced separately so they never collide.

We use the **`@gongrzhe/server-gmail-autoauth-mcp`** server — the most established standalone option, with a built-in browser OAuth flow.

---

## Prerequisites

- Node.js installed (`node --version` — any recent LTS is fine; `npx` comes with it).
- Claude Code CLI installed and working.
- Access to the Google account you want to add (here: the **work** account).
- A web browser signed in to that work Google account.

---

## Part A — Create Google OAuth credentials (you must do this yourself)

This is the only part nobody can do for you: you are granting an app access to *your* Google account, so the OAuth client must be created under your own Google Cloud project.

### A1. Create a Google Cloud project
1. Go to <https://console.cloud.google.com/>.
2. Sign in **with the work Google account** you're adding.
3. Top bar → project dropdown (or select project button) → **New Project**.
4. Name it something obvious, e.g. `google-mcp-server`. Click **Create**, then select it (should show up either in notification or use select project button).

### A2. Enable the Gmail API
1. Open the left menu: it's hidden by default, so click the **☰ hamburger icon** (top-left, next to "Google Cloud") to reveal it. Then go to **APIs & Services → Library**. *(This applies every time these steps say "Left menu".)*
2. Search **Gmail API** → open it → **Enable**.
   - ⚠️ The search shows two results. Pick **"Gmail API" (Google Enterprise API)** — the classic one. **Do NOT** pick **"Gmail MCP API"**: that's Google's *own* managed MCP service (the one powering the claude.ai built-in connector), not what this self-hosted server uses. Choosing it will make the auth step fail later.

### A3. Configure the consent screen (Google Auth Platform wizard)
> Google replaced the old multi-page "OAuth consent screen" with a single **Google Auth Platform** wizard. If you land on a page that says *"Google auth platform not configured yet"*, click **Get started** and follow this:

1. Left menu → **APIs & Services → OAuth consent screen** (or **Google Auth Platform**). Click **Get started**.
2. **App Information:**
   - **App name:** `Google MCP` (anything)
   - **User support email:** pick your work email from the dropdown → **Next**
3. **Audience:** choose **External** (a plain Gmail account *cannot* use *Internal* — that's Workspace-org only) → **Next**
4. **Contact Information:** enter your work email → **Next**
5. **Finish:** tick to agree to the policy → **Create**. You'll see *"OAuth configuration created."*

⚠️ **The new wizard does NOT ask for Test users.** You must add yourself separately (next step) or sign-in later fails with `access_denied`.

### A3b. Add yourself as a Test user
1. Left menu → **Audience**.
2. Under **Test users** → **+ Add users**.
3. Type the **work Gmail address** → press Enter, then click **Save**.
   - 🐛 Quirk: you may need to click **Save twice** — once to register the address into the box, once to actually save it.

### A4. Create the OAuth client (Desktop app)
1. From the **Overview** page click **Create OAuth client** (or left menu → **Clients → + Create client**).
2. **Application type:** **Desktop app**.
3. **Name:** `google-mcp-desktop` → **Create**.
4. In the dialog, click **Download JSON**. This is your `gcp-oauth.keys.json`.
   - The file downloads with a long name like `client_secret_<numbers>-<hash>.apps.googleusercontent.com.json`. That's the right file — you'll rename it in Part B.
   - 💡 If you ever lose the file but kept the **Client ID** and **Client Secret**, you can rebuild `gcp-oauth.keys.json` by hand — see "Rebuilding the keys file" at the end.

---

## Part B — Authenticate the server with the work account

> 🤖 **Your AI agent can do Part B for you.** Just say *"I've downloaded the JSON"* (or paste the Client ID + Secret) and it will create the folder, place the keys file, launch the browser sign-in, and confirm the token saved. **The steps below are exactly what it runs in the background** — they're here so you have full transparency and can do it by hand if you prefer. The **one** thing only *you* can do is the browser sign-in itself (Step B2), since you're approving access to your own Google account.

### B1. Put the credentials where the server looks for them
The server reads keys from `~/.gmail-mcp/`. Create it and move the downloaded file in, renaming it exactly:

```bash
mkdir -p ~/.gmail-mcp
mv ~/Downloads/client_secret_*.json ~/.gmail-mcp/gcp-oauth.keys.json
```

(Adjust the source filename to match what Google downloaded.)

### B2. Run the one-time OAuth flow
```bash
npx -y @gongrzhe/server-gmail-autoauth-mcp auth
```

- The terminal prints **"Please visit this URL to authenticate: …"** and usually opens your browser automatically. If it doesn't open, copy the printed URL into your browser yourself.
- **Sign in with the work account.**
- You'll see a "**Google hasn't verified this app**" warning (expected — it's your own testing app). Click **Advanced → Go to Google MCP (unsafe)** → **Continue/Allow** the requested Gmail permissions (`gmail.modify`, `gmail.settings.basic`).
- The terminal prints **"Authentication completed successfully"** and credentials are saved to `~/.gmail-mcp/credentials.json`.

> The local helper listens on `http://localhost:3000/oauth2callback` during this step — that's normal and only runs for the few seconds the flow takes. (Because this is a *Desktop* OAuth client, Google permits the localhost redirect automatically; you don't need to register it anywhere.)
>
> The token is stored on your machine in `~/.gmail-mcp/`. Treat that folder like a password.

---

## Part C — Register the server with Claude Code

> 🤖 **Your AI agent can do Part C for you too** — it will run the `claude mcp add` command and verify the server shows ✓ Connected. **The commands below are exactly what it runs**, shown for transparency. After this step you'll need to **restart Claude Code once** so the new tools load.

Add it with a **distinct name** so it never gets confused with the personal connector:

```bash
claude mcp add gmail-work -- npx @gongrzhe/server-gmail-autoauth-mcp
```

Notes:
- The `--` separates Claude's own flags from the command to run. Keep it.
- Default scope is the current project. To make it available in **every** project, add `-s user`:
  ```bash
  claude mcp add gmail-work -s user -- npx @gongrzhe/server-gmail-autoauth-mcp
  ```
- Equivalent manual config (if you prefer editing JSON, e.g. `~/.claude.json` or a project `.mcp.json`):
  ```json
  {
    "mcpServers": {
      "gmail-work": {
        "command": "npx",
        "args": ["@gongrzhe/server-gmail-autoauth-mcp"]
      }
    }
  }
  ```

### C1. Verify
Restart Claude Code (or reload), then check it's connected:
- **In your terminal** (not inside a Claude session): `claude mcp list`
- **Inside a running Claude session**: the `/mcp` slash command

  ```bash
  claude mcp list
  ```
You should see `gmail-work` reporting **✓ Connected**, alongside the existing `claude.ai Gmail`. (`claude mcp list` is a shell command; `/mcp` is its in-session equivalent — they're not interchangeable.)

---

## How the two accounts coexist

| | Personal account | Work account |
|---|---|---|
| Server | claude.ai managed connector | self-hosted `gmail-work` |
| Tool prefix | `mcp__claude_ai_Gmail__*` | `mcp__gmail-work__*` (varies by server) |
| Auth store | claude.ai | `~/.gmail-mcp/credentials.json` |

Because the tool names are prefixed by server, there is **no collision**. When you ask Claude to act on email, name the account ("check my **work** inbox", "search my **personal** Gmail") so it routes to the right server.

---

## Troubleshooting

- **`access_denied` during auth** → the work address wasn't added as a Test user (Part A3.5). Add it and re-run the auth command.
- **`gcp-oauth.keys.json not found`** → file isn't at `~/.gmail-mcp/gcp-oauth.keys.json`, or is misnamed. Check with `ls -la ~/.gmail-mcp/`.
- **Browser warning "app isn't verified"** → expected for a personal testing app; click through Advanced → Go to… It only appears because you haven't gone through Google's verification (unnecessary for personal use).
- **`gmail-work` shows "Needs authentication" or fails** → re-run `npx @gongrzhe/server-gmail-autoauth-mcp auth`; the token may have expired or never completed.
- **Want to revoke access later** → delete `~/.gmail-mcp/credentials.json`, and remove the app's access at <https://myaccount.google.com/permissions> under the work account.

---

## Removing the server

```bash
claude mcp remove gmail-work
rm -rf ~/.gmail-mcp        # also deletes stored credentials
```

---

## Rebuilding the keys file (if you only have the Client ID + Secret)

If you didn't keep the downloaded JSON but you *do* have the **Client ID** and **Client Secret** (e.g. you noted them down), create `~/.gmail-mcp/gcp-oauth.keys.json` by hand with exactly this shape — substitute your two values:

```json
{
  "installed": {
    "client_id": "PASTE-CLIENT-ID.apps.googleusercontent.com",
    "client_secret": "PASTE-CLIENT-SECRET",
    "redirect_uris": ["http://localhost:4100/code"],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
```

Then run the auth flow (Part B2). Note: the `redirect_uris` value here is cosmetic — this server actually uses `localhost:3000/oauth2callback` at runtime regardless.

> ⚠️ **Never commit Client ID/Secret to a git repo.** If you jot them in a note inside your vault, delete the note once the keys file exists, or add it to `.gitignore`. The working copy belongs only in `~/.gmail-mcp/` (outside the repo).

---

## Doing the same for Google Calendar

The Calendar equivalent reuses this exact Google Cloud project — see **`gcal-mcp-second-account-setup.md`**.

---

*See also: `gmail-mcp-swap-connector.md` for the lower-setup alternative (one account at a time).*
