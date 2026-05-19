# Session 4a — YouTube Description (Draft for Review)

---

## Title

**AI Training Course — Session 4a: Build Your Own Personal Agent (Phase 1)**

---

## Description (paste from here down)

In Session 4 we move from theory to build. Last week we mapped the seven layers of the digital Chief of Staff. This week we populate them — on your machine, with your content. By the end of this video you'll have cloned the starter project from GitHub, renamed your vault, replaced the template identity files with your own, committed the result to git, and opened your first session with a personal agent that knows who you are.

This is Phase 1 — the foundational layer. It's deliberately minimal. About twelve files. Same seven layers, just much smaller. The point today is to get the wiring working — refining your files happens over the coming weeks as you actually use the thing.

---

## Purpose

Last week we mapped the 7 layers. Today we populate them — with **your** content, on **your** machine.

By the end of the session you should have:

- The starter project cloned from GitHub onto your computer
- Your identity files filled in (USER.md, SOUL.md, GOALS.md)
- Your changes committed to git
- A working `claude` session that loads your identity automatically

**Carried forward to Session 4b:**
- Running your first weekly digest in Claude Code, tailored to you
- Building your first custom skill using the `create-skill` meta-skill

---

## Pre-Session Setup (Homework Commands)

These are the five things you needed installed *before* Session 4. 

### 1. Node.js — install via `nvm`, NOT from nodejs.org

Claude Code runs on Node.js. **Do not download Node from nodejs.org** — that route leads to permission errors and version conflicts down the line. Use `nvm` (Node Version Manager) instead. It keeps Node tidy and lets you swap versions painlessly.

**Mac (Terminal):**

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Then **close the Terminal window completely and open a fresh one** (so it picks up the new install). In the fresh window:

```
nvm install --lts
nvm use --lts
node --version
```

You should see something like `v20.x.x`.

**Windows (PowerShell):**

`nvm` itself doesn't run natively on Windows. Use **nvm-windows** instead — download the installer (`nvm-setup.exe`) from [github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases) and run it. Then in a fresh PowerShell:

```
nvm install lts
nvm use lts
node --version
```

**Gotcha — `zsh: command not found: nvm` after install (Mac)**

If you reopen Terminal and `nvm --version` returns `zsh: command not found: nvm`, the install completed but the activation lines didn't get added to your shell config. **This bit a couple of the cohort during the live session.** First confirm nvm is on disk:

```
ls ~/.nvm/nvm.sh
```

If that prints a path (rather than "No such file or directory"), run these four commands to wire nvm into your shell, then re-test:

```
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.zshrc
source ~/.zshrc
```

Then `nvm --version` should print `0.40.1` and you can continue with `nvm install --lts`.

**Gotcha — `nvm` works but `node --version` says "command not found"**

This means nvm is loaded but no Node version is installed yet (`nvm ls` will show `N/A` everywhere). Two commands fix it:

```
nvm install --lts
nvm alias default lts/*
```

The second line makes the LTS version come back automatically every time you open a new Terminal, so you only hit this once.

### 2. Python — install via `uv` from Astral, NOT from python.org

Python isn't strictly required to *run* Claude Code, but a lot of the tooling and example code in later sessions assumes it's there. Same principle as Node — **don't install Python from python.org**. Use `uv` by Astral, which is dramatically faster and avoids the macOS-system-Python tarpit.

**Mac (Terminal):**

```
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Close and reopen Terminal, then:

```
uv python install 3.13
uv python list
```

You should see Python 3.13 listed as installed.

**Windows (PowerShell):**

```
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Close and reopen PowerShell, then:

```
uv python install 3.13
uv python list
```

### 3. Claude Code — the terminal version of Claude

With Node now in place (step 1), install Claude Code:

```
npm install -g @anthropic-ai/claude-code
```

Same command on Mac and Windows. Verify:

```
claude --version
```

Run `claude` once on its own to step through the first-time setup — it'll ask you to log in via browser using the same Anthropic account you've been using for claude.ai.

**Note**: running Claude Code requires an Anthropic subscription (Pro or Max). If you don't have one, ask me for a 1-week free-trial referral link.

**Gotcha — `claude` not recognized after install (Windows)**

A very common Windows snag: `npm install -g @anthropic-ai/claude-code` completes successfully, but when you type `claude` you get one of these errors:

- PowerShell: `claude : The term 'claude' is not recognized as the name of a cmdlet, function, script file, or operable program.`
- cmd: `'claude' is not recognized as an internal or external command.`

This almost always means npm's global binary folder isn't on your `PATH`, or your current terminal session hasn't picked up the updated `PATH` from the install. Two fixes, in order:

**Fix 1 — Close and reopen PowerShell.** Quit *every* PowerShell window completely, then open a fresh one. This alone resolves it most of the time, because the new shell inherits the updated `PATH` that the npm/nvm-windows installer set.

**Fix 2 — If that didn't work, check where npm puts global binaries and add it to `PATH` manually.** In PowerShell:

```
npm config get prefix
```

That prints a folder path — for nvm-windows it'll be something like `C:\Users\YourName\AppData\Roaming\nvm\v22.x.x`; for a direct Node install it'll be `C:\Users\YourName\AppData\Roaming\npm`. Add it to your user `PATH`:

```
[Environment]::SetEnvironmentVariable("PATH", "$env:PATH;<paste-the-path-here>", "User")
```

Then **close and reopen PowerShell again** and re-run `claude --version`.

**Alternative (GUI route)**: Search the Start menu for "Environment Variables" → "Edit the system environment variables" → "Environment Variables..." button → under "User variables" select `Path` → "Edit..." → "New" → paste the path from `npm config get prefix` → OK out of everything → reopen PowerShell.

**For nvm-windows users specifically**: if you've just switched Node versions with `nvm use`, the symlink to the active Node folder sometimes needs a fresh shell to register. Close PowerShell, reopen, and try `claude --version` again before going down the `PATH`-editing rabbit hole.

### 4. Git — file version control

The original homework email was Mac-only and assumed git was pre-installed. Adding the Windows note here because the live session showed Windows users need to install it explicitly.

| Platform | What to do |
|----------|------------|
| **Mac** | Already pre-installed. Verify with `git --version`. If missing, install Xcode Command Line Tools with `xcode-select --install`. |
| **Windows** | **Not pre-installed.** Download Git for Windows from [git-scm.com](https://git-scm.com) — this also bundles **Git Bash**, the terminal we recommend for Windows users. Verify with `git --version`. |

### 5. GitHub account

Sign up at [github.com](https://github.com). Free tier is fine. You'll use this in Session 5 to push your agent up as offsite backup.

### 6. Configure git (one-time, both platforms)

After installing git, set your identity *once* so commits know who you are. **Do this before Session 5 if you hit "Author identity unknown" during the live build.**

```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

Verify with:

```
git config --list
```

---

## Commands Used in the Session

A side-by-side reference so you can replay any step at your own pace.

### Opening the terminal

| Platform                             | How                                                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Mac**                              | Open **Terminal** from Applications → Utilities → Terminal. (Or `Cmd+Space`, type "Terminal", Enter.) |
| **Windows (PowerShell)**             | Press `Win+X` → "Windows PowerShell" (or "Terminal" on Windows 11).                                   |
| **Windows (Git Bash) — recommended** | Right-click any folder → "Git Bash Here". Or search the Start menu for "Git Bash".                    |

### Navigating the file system

| Action | Mac / Git Bash | Windows PowerShell |
|--------|----------------|--------------------|
| List files in current folder | `ls` | `ls` *or* `dir` |
| List files with detail | `ls -la` | `ls -Force` |
| Change directory | `cd projects` | `cd projects` |
| Go up one level | `cd ..` | `cd ..` |
| Go to home folder | `cd ~` | `cd ~` |
| Show current folder | `pwd` | `pwd` *or* `Get-Location` |
| Make a new folder | `mkdir projects` | `mkdir projects` |

**Key point**: on Mac and Git Bash, paths use `/`. On Windows PowerShell paths use `\` *or* `/` — either works in modern PowerShell. If you're following along on Windows, **using Git Bash will match what I'm doing on screen more closely**.

### Setting up the projects folder

| Step | Mac / Git Bash | Windows PowerShell |
|------|----------------|--------------------|
| Create projects folder and move into it | `mkdir -p ~/projects && cd ~/projects` | `mkdir ~/projects -Force; cd ~/projects` |

(`mkdir -p` on Mac/Bash means "don't error if it already exists". On PowerShell, `-Force` does the same.)

### Cloning the starter repo

**Same command on all platforms** — replace `bob` with your chosen agent name:

```
git clone https://github.com/gavraq/ai-training-starter.git bob
cd bob
```

The starter repo is public at [github.com/gavraq/ai-training-starter](https://github.com/gavraq/ai-training-starter).

### Renaming the vault

**Same command on all platforms** — replace `bob-vault` with your agent's vault name:

```
git mv vault bob-vault
```

Use `git mv`, not plain `mv`/`move` — `git mv` records the rename as a single operation so `git status` stays clean.

### Editing your identity files

You **don't** need to use the terminal for this. Use whichever editor is most comfortable:

| Approach | How |
|----------|-----|
| **Obsidian** (recommended) | Open Obsidian → "Open folder as vault" → select `~/projects/bob/bob-vault/`. Edit the three files in `identity/` in the side panel. |
| **TextEdit (Mac) / Notepad (Windows)** | Open Finder/File Explorer, navigate to `~/projects/bob/bob-vault/identity/`, right-click each file → "Open With" → TextEdit or Notepad. |
| **VS Code or Cursor** | Open the `bob` folder as a workspace. Edit the three files in the explorer. |
| **Claude Code itself** | Run `claude` and ask: *"Open my USER.md and let's draft it together."* |

The three files to fill in:
- `bob-vault/identity/USER.md` — who you are (personal, professional, family, networks)
- `bob-vault/identity/SOUL.md` — your agent's voice, tone, hard rules. First line should give your agent its name.
- `bob-vault/identity/GOALS.md` — your horizons (today, this week, this quarter, this year, life)

Even rough drafts are fine. You'll refine these over the weeks.

### Committing your changes to git

| Step | Command (Mac / Windows — identical) |
|------|--------------------------------------|
| Stage all changes | `git add -A` |
| Commit with a message | `git commit -m "Initial setup: rename vault, fill identity files"` |
| Check status | `git status` |

**If you see "Author identity unknown"** when committing, you need to set your git config first — see Step 6 of homework above.

### Starting and using your agent

| Step | Command (all platforms) |
|------|--------------------------|
| Start Claude Code in your agent folder | `claude` |
| Approve the SessionStart hook when prompted | (press y/Enter when asked) |
| Try it: ask your agent who you are | Type: `who am I?` |
| Exit Claude Code | Type `exit` |

### Resuming a previous session

Inside a `claude` session, type:

```
/resume
```

This shows your last 30 days of chat history. Pick one to load its context back into the current session. (In Phase 2 we'll build a more durable memory system that goes back further than 30 days.)

---

## Useful Files in the Starter Repo

| File | What it does |
|------|--------------|
| `README.md` | Setup walkthrough — clone, fill, run |
| `CLAUDE.md` | Entry point — auto-loaded by Claude Code every session |
| `homework-prompts.md` | Prompts to interview yourself if your identity drafts are blank |
| `<your-name>-vault/identity/USER.md` | Template for who you are |
| `<your-name>-vault/identity/SOUL.md` | Template for your agent's voice + rules |
| `<your-name>-vault/identity/GOALS.md` | Template for your horizons |
| `<your-name>-vault/inputs/EXAMPLE-week.md` | A sample week of bullet-point notes (Alex Okafor's fictional week) |
| `<your-name>-vault/outputs/` | Where your agent will save digests and other generated content |
| `.claude/hooks/LoadMasterPrompt.ts` | The one hook that fires on every session start and loads your identity files |
| `.claude/skills/create-skill/SKILL.md` | A meta-skill that helps you build other skills (we'll use this in Session 5) |

---

## Bonus Pattern Shown at the End

**Granola → Obsidian → agent context**: after every meeting, copy the Granola transcript into a markdown file in your `<vault>/references/meetings/` folder. Now you can ask your agent things like *"look at the meeting transcript from this morning and create a list of follow-up tasks."* Every meeting becomes durable context.

In Session 5 we'll package this as a proper skill so the agent does it automatically.

---

## Homework for Session 4b

1. **Finish Phase 1 if you didn't get there in the live session.** Use the commands in this description to clone, rename, populate, commit. Reach out for a quick 1:1 clinic if you're stuck — easier to unblock you in 15 minutes than to wrestle with it alone.
2. **Use your agent at least three times this week.** Ask it anything. The point is to start building muscle memory, not to complete a task.
3. **Keep a gaps log.** Anywhere — a sticky note, a markdown file, your phone. Write down everything that frustrates you, breaks, or feels missing as you use the agent this week. This list drives Session 5's priorities. The cohort with the longest gaps log usually has the best week.

---

## What's Next — Session 5 (Phase 2)

We add:
- **Memory hooks** — your sessions persist between days
- **A formal `WeeklyDigest` skill** — fires automatically when you ask, no need to type the full prompt
- **A `MEMORY.md` template** — curated long-term memory loaded alongside identity
- **The `/master-prompt` self-improvement loop** — your agent proposes updates to its own configuration based on what worked this week

We'll also do a share-out of the custom skills you build. Bring your gaps log.

---

## Links

- **Starter repo**: github.com/gavraq/ai-training-starter
- **nvm (Mac/Linux)**: github.com/nvm-sh/nvm
- **nvm-windows**: github.com/coreybutler/nvm-windows
- **uv (Astral)**: astral.sh/uv
- **Git for Windows**: git-scm.com
- **Obsidian**: obsidian.md
- **GitHub**: github.com

---

*Recorded 15 May 2026.*
