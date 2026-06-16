# Local Scheduled Tasks — Your Agent, On a Timer

**Goal:** Get a job running automatically on *your own machine* on a schedule — so your agent works for you while you're not at the keyboard, and can touch your **local vault and files** (which the cloud `/schedule` cannot).

**Audience:** Everyone on the AI training cohort. Same teach-others style as the other guides — read it top to bottom, then keep it as a reference.

**The key idea:** You do **not** write any cron syntax or edit system files. You ask your agent in plain English, it sets up the plumbing, and you check it worked. This guide is about *what* it sets up and *how to drive it*, not the internals.

---

## First — local vs cloud (get this right)

There are two ways to schedule, and picking the wrong one is the single most common mistake.

| | Cloud — `/schedule` | Local — cron / launchd |
|---|---|---|
| Runs on | Anthropic's servers | **Your own machine** |
| Can reach | GitHub, your connectors (email/calendar) | Connectors **and your local vault/files** |
| Sees your vault? | ❌ No | ✅ Yes |
| Machine must be awake? | No | **Yes** |
| Set up by | `/schedule` in a session | Just **ask your agent** (this guide) |

If the job needs your notes, your vault, your `/master-prompt`, your local scripts → **local**. If it only touches GitHub or a connector → cloud is fine.

> The words to know (concept only — your agent handles the rest):
> - **cron job** — a small program set to run on a schedule. The name is just old Unix shorthand (from *chronos*, Greek for time).
> - **launchd** (macOS) / **systemd** (Linux) — the bit that makes a scheduled job **survive a restart**: when you reboot, it brings the job back at the right time.

---

## The recipe — in three moves

### 1. Ask your agent *(you, in a Claude session)*

Tell it, in plain English, *what* to run and *when*. Examples:

```
I have a custom slash command called master-prompt which I currently run manually.
Please set up a schedule to run it automatically at 10pm each Sunday evening.
```

```
Every weekday at 7am, gather my calendar for the day and the next actions from my
vault into a short morning brief, and write it to my daily note.
```

### 2. Choose **local** *(you, when it asks)*

Your agent will ask which approach you want — **cloud** or **local**. Choose **local** for anything that touches your files. On a Mac it sets up a **launchd** job; on Linux, **systemd**. You'll see those words go by — you don't need to understand them, just recognise you picked the local route.

### 3. Confirm it's installed *(agent shows you; you read)*

The agent reports back something like *"installed and verified — runs every Sunday at 22:00, writes its output to `<your vault path>`."* That's your confirmation it's live. It will keep running on that schedule, including after a reboot, with no further action from you.

---

## Make it **read-only** first — the one guardrail that matters

A scheduled job acts while you are **not watching**. So the first version of any job should **prepare, not perform**:

- ✅ *Write a proposal / draft / digest to a file for me to review.*
- ❌ *Send the email / make the change / spend the money — unattended.*

My `master-prompt` schedule **proposes** updates to my identity files; I read them and keep the ones I want. It prepares; **I** decide. Earn the trust before you let a timer send or spend on your behalf.

---

## Checking, editing, removing

All in plain English to your agent:

| You want to… | Ask your agent… |
|---|---|
| See what's scheduled | *"List my local scheduled jobs and when each last ran."* |
| Check a job ran | *"Did the Sunday master-prompt job run last night? Show me its output/log."* |
| Change the time | *"Change my morning brief to run at 6:30am instead of 7."* |
| Pause / remove it | *"Disable (or remove) the morning-brief scheduled job."* |

> Where output lands: whatever you told it to write to (e.g. a file in your vault). If a run seems to have done nothing, first check the machine was **awake** at that time (below), then ask your agent to show the job's log.

---

## The catch — the machine has to be on

A local job only runs while your computer is **awake**. If the laptop was asleep at 10pm, the Sunday job didn't run. Three options, cheapest first (same as the connectors week):

1. **Leave your laptop on** — fine to start; set it not to sleep.
2. **A Raspberry Pi** — ~£60 once, sips power, lives in a drawer.
3. **A small cloud box** — someone else keeps it awake.

If always-on is a step too far this week, schedule something low-stakes and run it while you're working — you can graduate to always-on later.

---

## Start small

One simple job you understand beats ten you don't. Good first jobs:

- **Your `/master-prompt` weekly** — the agent keeps itself current with how you work (proposes, you approve).
- **A daily or weekly digest** — calendar + next actions pulled into a note each morning.

Don't build a cron empire on day one. Add the second job only once the first has proven itself.

---

*See also: the Session 7 notes (the power-tools session this guide supports) and `claude-code-slash-commands.md` for the `/schedule` caveat.*
