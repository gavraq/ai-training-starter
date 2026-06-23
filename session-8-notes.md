# Session 8 — Build Your Own App: From Runner to Builder

Companion notes to the video. Everything we covered, every prompt, every gotcha worth knowing.

This is the single reference file for the week. The detailed step-by-step recipe for the prerequisite lives in [`guides/memory-upgrade-daily-summaries.md`](./guides/memory-upgrade-daily-summaries.md) — this file is the map.

---

## The one thing to take from today

You stop being a *runner* and become a *builder*. We build a real application — a mission-control dashboard for your agent — and **you don't write a line of code.** The machine does the typing; you do the deciding.

And the headline idea, the one to keep for the rest of your working life: **don't outsource the deciding.** The models are now brilliant at the *building*. But they have no idea what *you* want, so your value moved to the front — deciding what to build, describing it clearly, knowing when it's done. Ask a model "what should I build?" and you'll get the median answer — the same one it's giving everyone else who asked the same way. (Karpathy's word for it: the models have "collapsed" — ask for a joke and it's got about three.) Walk up with your *own* point of view and use AI to stretch and stress-test it. Deciding what to build is the creative act, and that part stays human.

---

## The map — how software actually gets built (7 steps)

There's only one set of activities in software, and every scary methodology word (waterfall, agile, scrum) is just these in a different order, batch size, and appetite for change:

**Idea → Requirements → Design → Build → Test → Deploy → Maintain.**

- **You** are good at steps 1–3 (idea, requirements, design).
- **Your agent** is good at steps 4–7 (build, test, deploy, maintain).
- Directing an agent rewards "spec first": write a clear spec, let it build against it, check, repeat.

---

## Vision big, build small (the MVP)

Hold a **big** vision of the finished thing — then build the **smallest version that genuinely works.** Not a worse version of everything; a complete version of one thing. A scooter that gets you from A to B, not a broken car. The big vision's only job at the start is to shape the handful of decisions that are *ruinous to change later* (your "one-way doors").

---

## Step 0 — the prerequisite: a friendly daily summary (do this first)

A dashboard is only as good as the data behind it. Your Phase 2 memory writes a daily trail, but it's a raw, technical dump — not something you'd want on a screen. So **before** you build the dashboard, add a hook that writes a *friendly*, plain-English daily summary into your `daily/` folder — that's the data the dashboard reads.

Full recipe (the verbatim prompt + how to verify): **[`guides/memory-upgrade-daily-summaries.md`](./guides/memory-upgrade-daily-summaries.md)**.

The one instruction that matters is the **voice**: *"write it like you're telling a friend what we got done — the outcome, not the mechanics."* That's the difference between a changelog and a dashboard.

---

## Building the dashboard — the process

### 1. Write the spec (a PRD)

Don't type it — *direct* it. Give your agent:

```
Draft me a one-page spec (a PRD) for a small personal "mission control" dashboard.
It's for me. The smallest useful version: ONE web page with THREE panels —
(1) Recent Activity: my agent's friendly daily summaries; (2) Today / What's On:
my current to-dos; (3) Daily Briefs: my recent daily brief. No login, no database,
no settings — it just shows me these three things. Write down clearly what it must
do and what it deliberately won't do (yet). Keep it to one page.
```

Then **scope it down** — every time it adds something clever, cut it. The spec is where you win the simplicity battle before anything's built.

### 2. Where it lives — the same repo as your vault

**Rule: build the dashboard in the same Git repo as your vault — the one that pushes to GitHub.** When you deploy, the host builds from *one* repo and needs your data sitting in it. For most of you that's easy: your vault is already inside your agent's project, so the dashboard goes in that same project, alongside it.

```
Create a folder called "mission-control" inside my agent project (the repo that
holds my daily notes, scratch, and briefs) — just the empty folder for now; we'll
decide what goes in it together.
```

*(Git won't track an empty folder — that's fine, it fills up in the next step.)*

### 3. Design — the one-way doors

Two decisions worth making deliberately:
- **The data model:** the dashboard owns no data — it *reads* the files your agent already writes (daily summaries, scratch, briefs). Decide that and adding a panel later is just "read another file."
- **Where it runs:** self-host (a server you keep alive) vs cloud. Because your vault already pushes to GitHub, you can host it free on **Vercel**, which rebuilds the page every time you push — no server, reachable on your phone. The framework that fits Vercel is **Next.js**. That's the route we take.

### 4. Scaffold the app

```
Set up the simplest Next.js app you can in my mission-control folder — the standard
starter, nothing fancy, ready to deploy to Vercel. Make sure node_modules and the
.next build folder are gitignored. Then run it locally and tell me the address.
```

### 5. Build the panels — one small step at a time

The rhythm is the whole game: **one small step, run it, look, next step.** Never five things and hope. One panel at a time, e.g.:

```
Add a panel called "Today / What's On". Read the "## Do This Week" section from
my vault's gtd/scratch.md and list the items. Then let me see it.
```

Then the next panel (Daily Briefs), then the showcase one (Recent Activity).

### 6. Front end vs back end

The **front end** is the page you see and click; the **back end** is the engine that reads your files. (Because your data already lives in GitHub/your vault, you don't need a separate database like SQL or Postgres.) That's the only structural vocabulary you need.

### 7. The design reference — a picture for taste

When you care how something *looks*, don't describe it in a paragraph — **show it a picture.** Your agent can read images:

```
Build the "Recent Activity" panel as a daily-notes view styled like this screenshot
[attach your image]: a year-in-pixels heatmap, a clickable monthly calendar with
today highlighted, and a pane showing the selected day's note. Read the notes from
my vault's daily folder. Build a first pass and let me see it.
```

**Words for behaviour; a picture for taste.**

### 8. Define "done" and test

The one job only *you* can do: say, in plain words, what "done and good" looks like. The agent turns it into checks.

```
Here's my "done" checklist for the dashboard: (1) all three panels show real data
from my vault, (2) the page loads without errors, (3) if a source file is missing
the panel says "nothing yet" instead of crashing. Turn that into checks, run them,
and tell me what passes.
```

---

## Building in loops — `/goal` and `/loop`

Topical right now, worth understanding even though we *didn't* need it today (small increments kept things clean):

- **`/loop`** — re-runs a prompt or command on an interval, or until a condition is met.
- **`/goal`** — you set a verifiable end state and it works, turn after turn, until that state is reached.

`/goal` exists for *very ambitious* tasks, and it fixes two failure modes:
1. **Context bloat** — on a long loop the context window fills and the agent loses focus, so `/goal` summarises progress mid-loop to stay clean.
2. **The agent lying** — hyper-focused on the goal, it'll claim it's done when it isn't. So `/goal` hands the "is it actually done?" check to a **second, independent model** — the agent can't mark its own homework.

For most builds, small increments (like today) keep your context clean naturally and you won't need it.

---

## Deploy — Vercel, and the real blockers

The route: your code is already on GitHub → import the repo on Vercel → set the **Root Directory** to your `mission-control` folder → deploy. Vercel then rebuilds on every push.

```
The dashboard already lives in my notes repo, which is on GitHub. Walk me through
deploying it to Vercel: connect the repo, set the root directory to the
mission-control folder, and deploy. Tell me each step before you do it.
```

A good agent will **stop you with two blockers** here — and that judgement is worth more than the code:

**Blocker 1 — privacy.** A Vercel URL is *public by default*. Your dashboard shows your private notes and to-dos. On the free **Hobby** plan, Vercel's built-in password protection only covers *preview* URLs — the production URL stays public unless you pay for Pro. So protect it in code instead:

```
Add a simple app-level auth gate so the dashboard is protected on any Vercel plan.
Keep it minimal: a single shared password stored in an environment variable (NOT in
the code or repo), checked via Next.js middleware. No accounts, no database. Set the
password in .env.local (gitignored) for local dev and as a Vercel environment
variable for the deploy.
```

**Blocker 2 — it wouldn't work live.** The app reads your vault files at *request time*; Vercel's serverless functions don't have those files at runtime. The fix is to read everything at **build time** (static) and bake it in — which is exactly the "rebuilds on every push" model anyway. The site then carries a fresh snapshot of your vault on each deploy (every ~30 min if your vault auto-pushes).

### Secrets — the `.env` file and `.gitignore`

There's one file worth knowing by name: **`.env`** (a hidden file — the dot makes it hidden). It's the locked drawer for your passwords and secrets, kept *out* of your code. The one rule: make sure `.env` (or `.env.local`) is listed in **`.gitignore`** — the list of things that must never leave your machine. Your agent does this for you, but ask it to confirm: *"is my `.env` in `.gitignore`?"*

### Dev vs production

Your local machine is **dev**; the GitHub repo Vercel builds from is **production**. You build and test in dev, push when you're happy, and production updates.

### Sensitive data — keep it off the cloud

If the data is genuinely sensitive (client data, confidential records), the conscious choice is **don't push it to GitHub and don't deploy it on Vercel.** Keep production on a machine you control — a Raspberry Pi inside your own network. The trade-off: *you* become the IT department (when a server goes down, you restart it). Cloud hosts keep themselves online; self-hosting is on you.

---

## The second front door — an MCP server (homework to *think* about)

Your dashboard has a front door for *humans* (the web page). It could also have one for *other agents* — an MCP server, the same kind you pointed your agents at in Session 6. The flip from *consuming* everyone's agents to being a piece of the world *they* come to. I'm not telling you what to expose — that's the question to chew on: **what would you let other agents come to you for?**

---

## Gotchas — things that bite, listed so they don't bite you

### Gotcha 1 — the dashboard must be in the *same repo* as your vault
Vercel builds one repo and needs the data in it. If your dashboard is off in its own folder, you'll be fighting to get the data to it. Keep the app next to the data it reads.

### Gotcha 2 — an empty folder isn't tracked by git
Don't worry about it — it fills up the moment your spec/app lands.

### Gotcha 3 — serverless can't read your files at request time
On Vercel, read the vault at **build time** and bake it in (static), not live at runtime. Otherwise live reads 404.

### Gotcha 4 — Vercel Hobby protection only covers preview URLs
The production URL stays public on the free plan. Use **app-level auth in code** (a password via middleware) to protect it without paying.

### Gotcha 5 — add `.next` to `.gitignore`
The starter ignores `node_modules` but not the `.next` build folder. Add it — especially if your dashboard sits inside a vault that auto-commits, or every backup will try to commit thousands of build files.

### Gotcha 6 — never deploy credentials or sensitive data to a public host
Keep secrets in `.env` (gitignored). For genuinely sensitive *content*, self-host instead of deploying to the cloud.

---

## Homework — in priority order (and the order *is* the lesson)

1. **Do the memory upgrade first** — add the daily-summary hook so your agent writes a friendly summary into your `daily/` folder. That's the data your dashboard reads, and it's your warm-up at building by directing. Recipe: [`guides/memory-upgrade-daily-summaries.md`](./guides/memory-upgrade-daily-summaries.md).
2. **Write one spec / PRD** for something you actually want to build. One page: what it is, who it's for, what it must do, what it won't do, and how you'll know it's done.
3. **Build the smallest version** — three panels, not thirty. Small steps, run it often. Start smaller than you think.
4. **Only if you fancy it** — try `/goal` or `/loop` on something ambitious, and have a *think* (not a build) about what you'd expose as your own MCP server.

Anything that breaks: email me, subject `S8 issue:` and a one-liner — or grab a 1:1.

---

## What's next — the wind-down

This was the last live session, but it's not the end. We'll keep going with **one-to-one follow-ups** (walk me through what you built, get feedback) and a **group community** so you can keep sharing builds and bouncing ideas. More on the mechanism soon.

---

## Links

- **Starter repo:** https://github.com/gavraq/ai-training-starter/tree/main
- **The memory-upgrade recipe:** [`guides/memory-upgrade-daily-summaries.md`](./guides/memory-upgrade-daily-summaries.md)
- **AI Training Notes MCP server** (all the course notes — point your agent here): https://aitraining.gavinslater.co.uk

---

*Recorded 2026-06-19. ~90 minutes. Build your own app — from runner to builder. The finale.*
