# Alternative: Swapping the claude.ai Gmail Connector Between Accounts

**Goal:** Use **one** Gmail account at a time through the existing claude.ai managed connector, switching it between your *personal* and *work* Google accounts as needed — with **zero extra setup**.

**Audience:** Anyone who wants a second Gmail reachable from Claude but doesn't want to stand up a self-hosted server. This is the low-effort path; the trade-off is that only one inbox is live at any moment.

**When to choose this over the self-hosted server:**
- You only occasionally need the second account.
- You don't want to touch the Google Cloud Console or manage OAuth credentials.
- You're fine with a ~30-second re-auth each time you switch.

If you need **both** inboxes available simultaneously, use `gmail-mcp-second-account-setup.md` instead.

---

## How it works

The claude.ai managed Gmail connector (`mcp__claude_ai_Gmail__*`) is bound to a **single Google account** at a time. "Adding" the work account really means **re-authenticating the same connector** against the other account. Doing so replaces the current connection — it does not run them in parallel.

---

## Switching accounts

### Via the `/mcp` command in Claude Code
1. In a Claude Code session, run:
   ```
   /mcp
   ```
2. Select **claude.ai Gmail** from the list.
3. Choose to **reconnect / re-authenticate** (disconnect first if prompted).
4. A browser window opens → **sign in with the account you now want** (work or personal).
5. Approve access. The connector is now pointed at that account.
6. Confirm with `claude mcp list` (in your terminal) — or the `/mcp` slash command if you're inside a running Claude session:
   ```
   claude mcp list
   ```
   `claude.ai Gmail` should show **✓ Connected** — now serving the newly chosen account.

> Tip: the connector doesn't display *which* account it's on. After switching, do a quick sanity check — ask Claude to read the most recent email and confirm it's the inbox you expect before relying on it.

---

## Day-to-day pattern

```
Morning (personal):   connector → personal account → triage personal inbox
Switch to work:       /mcp → reconnect Gmail → sign in as work → work tasks
End of day:           /mcp → reconnect Gmail → sign in as personal (if you want it back)
```

Keep a mental (or written) note of which account is currently live, since there's no visual indicator.

---

## Pros and cons

| | Swap the connector (this doc) | Self-hosted second server |
|---|---|---|
| Setup effort | None | ~10–15 min, one-time Google Cloud OAuth |
| Both inboxes at once | ❌ one at a time | ✅ simultaneous |
| Friction per use | Re-auth each switch (~30s) | None after setup |
| Credentials to manage | None (claude.ai handles it) | `~/.gmail-mcp/` on your machine |
| Risk of acting on wrong inbox | Higher (no indicator) | Lower (named servers) |
| Good for | Occasional access to a 2nd account | Regular use of both accounts |

---

## Gotchas

- **No account indicator** — always verify which inbox is live after switching (read the latest message).
- **Re-auth friction** — switching several times a day gets tedious; that's the signal to graduate to the self-hosted approach.
- **In-flight work** — finish what you're doing on one account before switching; the swap changes the data source mid-session.

---

*See also: `gmail-mcp-second-account-setup.md` to run both accounts at once.*
