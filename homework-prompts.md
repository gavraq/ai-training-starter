# Homework Prompts — Alternative Path

> **Two ways to fill in your identity files**:
>
> 1. **Direct**: open `vault/identity/SOUL.md`, `vault/identity/USER.md`, `vault/identity/GOALS.md` and replace the `[placeholder text]` in each section. Fast if you know what to write.
> 2. **AI-interview**: paste the prompts below into a fresh ChatGPT or Claude conversation. Let the AI interview you. Paste the output back into the template files. Better if you find a blank page paralysing.
>
> Both paths produce the same outcome. Pick whichever feels lower-friction.

---

## Prompt 1 — `SOUL.md` (how you like to work)

> SOUL.md describes how you want your AI agent to *behave* — voice, tone, working style, hard rules. It's the file that makes Claude sound like *your* assistant rather than a generic one.

Paste the following into a fresh AI chat:

```
You are going to help me build a SOUL.md file — a single markdown document
that describes how I want my AI agent to behave. Tone, voice, working
style, decision-making preferences, hard rules.

The file will have six sections:

1. Voice & tone — directness, formality, humour, emojis
2. Writing style — bullets vs prose, length, technical depth, citations
3. Decision-making preferences — how you want options presented, when to
   push back, depth of analysis
4. Rules / hard nos — things the agent should NEVER do or say
5. Quality bar — what "good" looks like, what makes you proud, what
   triggers revision
6. Meta — when uncertain, when you contradict yourself, when asked for
   opinion

How I'd like you to do this:

- Interview me one section at a time, in the order above
- For each section, ask me 3–5 focused questions
- Speaking out loud (you can transcribe), brainstorm with me
- After my answers, draft that section in clean markdown using bullet
  format with concrete examples in [square brackets]
- Probe gently when my answers are vague — ask for an example, a recent
  output that disappointed me, a phrase I dislike
- Keep your own commentary minimal between questions
- Use British English

At the end, give me the complete file as a single markdown block I can
paste into vault/identity/SOUL.md.

Ready? Start with Section 1: Voice & tone.
```

---

## Prompt 2 — `USER.md` (who you are)

> USER.md describes you — your background, role, family, what you're working on right now. It's what Claude reads at the start of every session to make its responses specific to your life.

Paste the following into a fresh AI chat (or continue the SOUL.md chat — they're related):

```
You are going to help me build a USER.md file — a single markdown
document that describes who I am, so my AI agent's responses can be
specific to my life rather than generic.

The file will have five sections:

1. Personal — name, age / stage of life, location, languages
2. Professional — current role, company, years of experience, skills,
   industry expertise
3. Work context — what you're building right now, tools you use daily,
   communication channels
4. Family & life outside work — partner / family, hobbies, health focus
5. Networks & community — professional communities, mentors, influences

How I'd like you to do this:

- Interview me one section at a time
- For each section, ask me 3–5 focused questions
- Probe for specifics — names, examples, concrete recent things —
  rather than vague generalities
- After my answers, draft that section in clean markdown using bullet
  format
- Keep what's relevant for AI context (a partner's name, a kid's age,
  a hobby that affects how I want responses) — skip what isn't
- Use British English

At the end, give me the complete file as a single markdown block I can
paste into vault/identity/USER.md.

If I already have a "persona file" from a prior exercise, ask me to
paste it first and use it as the starting point.

Ready? Start with Section 1: Personal.
```

---

## Prompt 3 — `GOALS.md` (what you're trying to do)

> GOALS.md describes your horizons — from this week's projects up to your life-long purpose. The agent uses this to weigh trade-offs and prioritise what to surface.

Paste the following into a fresh AI chat:

```
You are going to help me build a GOALS.md file — a single markdown
document describing my goals across five horizons (David Allen's GTD
framework + Thiago Forte's framing).

The file will have five horizon sections plus one optional:

1. This week / this month (Horizon 1 — Projects) — what are you actively
   shipping right now?
2. This year (Horizon 2 — Areas of focus) — standing areas of your life
   you're cultivating, not finishing (Health, Family, Career, etc.)
3. 3–5 years (Horizon 3 — Goals & Objectives) — specific, measurable-ish
4. 5+ years (Horizon 4 — Vision) — aspirational version of your life
5. Life-long (Horizon 5 — Purpose & Principles) — what you're about
6. (Optional) SWOT — honest self-assessment

How I'd like you to do this:

- Interview me one horizon at a time, starting from horizon 1
- For each horizon, ask me 2–4 focused questions
- Probe for specificity — vague goals produce vague advice. If I say
  "I want to be healthier" ask "what does healthier look like in 3
  years specifically?"
- After my answers, draft that section in clean markdown
- Keep this honest, not aspirational — Claude works better with truth
  than with brochures
- Use British English

At the end, give me the complete file as a single markdown block I can
paste into vault/identity/GOALS.md.

Ready? Start with Horizon 1: This week / this month.
```

---

## Prompt 4 — Skill ideas (rough brain-dump)

> Don't try to build skills today. Just brain-dump 5–10 ideas. We'll use the `create-skill` skill in Session 4 (the build session) to convert at least one of them into a working skill, live.

Paste the following into a fresh AI chat:

```
Help me brain-dump skill ideas for my personal AI agent. A "skill" is a
repeatable workflow the agent fires automatically when triggered. Things
like "draft my morning emails", "summarise meeting notes", "track
parkrun results", "weekly digest".

I want a list of 5–10 skill ideas, no more. Don't help me build them
yet — just generate ideas based on the patterns below.

Ask me about each pattern in turn. For each, I'll tell you what fits
my life. Capture in a numbered list.

Patterns:

1. **Recurring output** — something I make every week / month at the
   same shape (digests, status updates, reports)
2. **Tedious admin** — something I'd outsource if I could (forms,
   scheduling, drafting routine emails)
3. **Re-explained context** — something I keep typing into AI from
   scratch each time (briefs, project context, who I'm writing to)
4. **Decision support** — something I'd like a thinking partner on
   (option-comparison, risk-flagging, retrospective)
5. **Data extraction** — pulling structured info from a messy source
   (calendar → schedule, inbox → priorities, notes → actions)
6. **Personal review / reflection** — anything I do periodically to
   stay on track (weekly review, monthly retrospective, quarterly
   planning)

For each pattern, ask me one question. After you have answers across
all six, give me the final list of 5–10 candidate skills. Don't worry
about the implementation details — just the shape: trigger phrase + one
sentence about what the skill should do.

Use British English.

Ready? Start with Pattern 1: Recurring output.
```

---

## After the interviews

1. **Save the outputs** into `vault/identity/SOUL.md`, `vault/identity/USER.md`, `vault/identity/GOALS.md`
2. **Save the skill ideas** somewhere convenient (e.g. as `skill-ideas.md` at the root of the project, or just a notes app — we'll formalise at least one in Session 4)
3. **Commit** to your local repo before next session
4. **Bring the gaps** — if any section feels thin or you ran out of time, that's fine. We can refine next week. Rough is better than perfect

The build session (Session 4) doesn't need everything filled in — it needs *enough that the digest can be tailored to you*. Two minutes of decent SOUL content + two minutes of decent USER content beats an hour of polished perfection.
