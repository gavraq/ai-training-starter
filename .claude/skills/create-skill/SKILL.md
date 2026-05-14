---
name: create-skill
description: Create a new skill for this Claude Code project. Use when the user wants to author a skill, add a skill, build a custom workflow, or says "create a skill", "new skill", "make a skill". This skill walks the user through a short interview, drafts the SKILL.md, and places it under `.claude/skills/` so it auto-loads next session.
---

# create-skill

The meta-skill: a skill that helps you author your own skills.

A "skill" in Claude Code is a folder under `.claude/skills/` containing at minimum a `SKILL.md` file with YAML frontmatter. When a user prompt matches the skill's `description` triggers, Claude consults the SKILL.md and follows the instructions inside. That's it — skills are just structured prompts you've written once and reuse.

This skill walks the user through creating one.

## Relationship to Anthropic's official `skill-creator`

Anthropic ships an official `skill-creator` skill in their [plugins marketplace](https://github.com/anthropics/skills) — install it via `/plugin install skill-creator@anthropic-official`. That version covers the full lifecycle: drafting, **test-case evaluation**, **description optimization** loops, and packaging for distribution.

This `create-skill` is a **simpler, teaching-focused subset** for the AI Training course. It skips the evals and description-optimization machinery so you can author a useful skill in 15 minutes. When you're ready for the full version — running benchmarks, iterating on test cases, optimizing trigger accuracy — install Anthropic's official skill-creator and use that.

The structural conventions used here (single SKILL.md, kebab-case naming, optional `scripts/` and `references/` folders) are the same as Anthropic's, so skills you build with this one are forward-compatible.

## Anatomy of a skill

```
skill-name/
├── SKILL.md           (required — YAML frontmatter + instructions)
├── scripts/           (optional — executable code for deterministic tasks)
├── references/        (optional — docs Claude can read on demand)
└── assets/            (optional — templates, fonts, images used in output)
```

For most Phase 1 skills, you only need `SKILL.md`. Add the other folders only when you actually need them.

## Progressive disclosure

Skills load in three stages — keep this in mind so you don't bloat the SKILL.md:

1. **Metadata** (name + description) — always in Claude's context. Keep concise; the description is what triggers the skill.
2. **SKILL.md body** — loaded when the skill triggers. Keep under ~500 lines.
3. **Bundled resources** (`scripts/`, `references/`, `assets/`) — loaded on demand when the SKILL.md tells Claude to read them.

If your SKILL.md is creeping past 500 lines, split detail into `references/` files and point at them from SKILL.md ("for the full schema, read `references/schema.md`").

## The creation workflow

### Step 1 — Capture intent

Ask the user (or extract from context):

1. **What should this skill do?** One sentence.
2. **When should it trigger?** What phrases or contexts? Be concrete — "when the user pastes a meeting transcript", not "for meeting stuff".
3. **What's the output?** A file? A reply in chat? A modified file?
4. **Inputs?** A pasted block of text? A file path? Nothing (just the trigger phrase)?
5. **Bundled resources?** Does the skill need any of:
   - A **script** to do something deterministic (fetch data, transform a file, call an API)? → `scripts/`
   - **Reference docs** Claude should read only when needed (a long schema, an API reference, a style guide)? → `references/`
   - **Assets** used in the skill's output (templates, boilerplate, fonts, images)? → `assets/`

   Most Phase 1 skills don't need any of these — the SKILL.md alone is enough. Only add a folder when it pulls its weight. If the user is unsure, default to "no" and add later when you actually feel the need.

Don't proceed past this step until the user has confirmed answers. Skills with vague triggers don't fire reliably.

### Step 2 — Pick a name

Use **kebab-case lowercase** by default (`meeting-followup`, `daily-brief`, `pros-cons`). This matches Anthropic's official skills and the wider plugin marketplace. TitleCase (`MeetingFollowup`) is tolerated if the project's other skills already use it — match the neighbours.

The folder name and the `name:` field in YAML frontmatter must match exactly.

### Step 3 — Draft the SKILL.md

Create `.claude/skills/<skill-name>/SKILL.md`:

```markdown
---
name: <skill-name>
description: <One sentence on what it does>. Use when <specific trigger contexts — be pushy if the skill tends to undertrigger>. <Any additional capabilities>.
---

# <skill-name>

<One-paragraph intro: what this skill does and why it exists.>

## When to use this skill

<Concrete triggers — when should Claude consult this skill? List 2-4 patterns.>

## How to use this skill

<The actual instructions. Imperative voice. Explain why, not just what.>

## Examples

**Example 1: <typical use case>**

Input: <what the user said>
Output: <what the skill produces>

**Example 2: <edge case>**

Input: <...>
Output: <...>
```

Keep the body under 500 lines. If you need more, move detail to `references/`.

### Step 3a — Add bundled resources (only if Step 1 question 5 said yes)

If the skill needs supporting files, create the relevant folder alongside SKILL.md:

```
your-skill-name/
├── SKILL.md
├── scripts/             # only if you have a script to call
│   └── fetch-data.py
├── references/          # only if you have detail Claude reads on demand
│   └── api-schema.md
└── assets/              # only if you have templates or files used in output
    └── email-template.md
```

Then **tell SKILL.md when to use each one** — Claude only loads bundled resources when the SKILL.md body points at them:

- **Script**: *"To fetch the latest numbers, run `scripts/fetch-data.py` and parse the JSON output."*
- **Reference**: *"For the full API schema, read `references/api-schema.md` before drafting the response."*
- **Asset**: *"Use `assets/email-template.md` as the base, then fill in the placeholders with the user's specifics."*

This is the **progressive disclosure** principle in action — keep SKILL.md lean, defer detail to the resource files, and let Claude pull them in only when needed.

**Choosing the right folder**:

| You have… | Use… | Example |
|-----------|------|---------|
| Code that runs the same way every time | `scripts/` | A Python script that calls the FreeAgent API |
| Long detail Claude needs sometimes | `references/` | A 300-line API reference |
| Files you want included in the output | `assets/` | An email template, a Word .dotx, a font file |

If a SKILL.md is 80 lines and the workflow is "follow these instructions", you don't need any of these folders. Save them for when complexity actually demands them.

### Step 4 — Test it

1. Restart your Claude Code session (the skill is picked up at session start).
2. Type the trigger phrase you specified in the description.
3. Verify the skill fires — Claude should mention it's using your skill, or follow the instructions you wrote.
4. If it doesn't fire, tighten the description: add more specific trigger phrases, or use Anthropic's "be a little pushy" language: *"Make sure to use this skill whenever..."*

### Step 5 — Iterate

After using the skill a few times, you'll notice gaps. Update the SKILL.md, restart the session, try again. Skills get better through use, not through up-front design.

## Writing patterns

### The description field is the trigger

Claude decides whether to use a skill based on the `description`. Two principles:

- **Include both what AND when**. *"Generate a weekly digest from notes in `inputs/`. Use when the user asks for a digest, weekly summary, or week-in-review."*
- **Be a little pushy** if the skill tends to undertrigger. Add explicit trigger phrases: *"Use this skill whenever the user mentions X, Y, or Z, even if they don't explicitly ask for a 'skill'."*

### Imperative voice in the body

Write instructions as commands directly to Claude:

- ✅ "Read the user's pasted notes. Extract decisions, actions, and open questions. Write each to a separate section."
- ❌ "The skill should read notes and the output will contain decisions, actions, and questions."

### Explain why, not just what

When you tell Claude to do something, briefly explain the reason. Modern models reason about your intent — a sentence of context produces better results than a rigid rule.

- ❌ "ALWAYS use bullet points. NEVER write paragraphs."
- ✅ "Use bullet points for action items so the user can scan and tick them off. Use prose for narrative summaries where flow matters."

If you find yourself writing ALWAYS / NEVER / MUST in capitals, that's a signal to step back and explain the reason instead.

### Examples beat rules

Two concrete examples teach more than a paragraph of rules. End the SKILL.md with at least one worked example showing input → output.

## Worked example: building `meeting-followup`

Suppose the user wants a skill that drafts follow-up emails from rough meeting notes.

**Step 1 — Intent**:
- What: drafts a follow-up email after a meeting
- Trigger: when user says "draft a follow-up for [meeting]" or pastes meeting notes
- Input: pasted meeting notes
- Output: a 3-section email — Decisions / Actions / Next step

**Step 2 — Name**: `meeting-followup`

**Step 3 — Draft `.claude/skills/meeting-followup/SKILL.md`**:

```markdown
---
name: meeting-followup
description: Draft a follow-up email from rough meeting notes. Use when the user pastes meeting notes and asks for a follow-up, recap, or summary email. Also use when the user says "draft a follow-up for [meeting name]".
---

# meeting-followup

Turns rough meeting notes into a clean follow-up email with three sections: Decisions, Actions, Next step.

## How to use this skill

1. Read the meeting notes the user has pasted (or the file they pointed at).
2. Extract:
   - **Decisions** — anything that was agreed
   - **Actions** — concrete things people committed to do, with the owner's name
   - **Next step** — the single most important thing happening before the next meeting
3. Draft an email in the user's voice (see `identity/SOUL.md` for tone). Keep it under 200 words.

## Example

Input: rough notes from a 1-hour project kick-off
Output:
> Subject: Project Atlas — kick-off recap
>
> **Decisions**: scope locked at MVP; launch target end of Q3.
> **Actions**: Sara owns the design brief by Fri. Tom drafts API spec by Tue.
> **Next step**: design walkthrough Thursday 10am.
```

**Step 4 — Test**: restart session, paste some notes, say "draft a follow-up". The skill fires. Done.

## Common pitfalls

| Pitfall | Fix |
|---------|-----|
| Description too vague — skill never fires | Add specific trigger phrases. Be a little pushy. |
| SKILL.md is 800 lines and Claude ignores most of it | Split detail into `references/`. Keep SKILL.md scannable. |
| Skill works on the example you wrote it for, fails on real inputs | The skill was overfit. Generalize: replace specific values with categories, explain the *why* not the *what*. |
| You wrote it once, never used it again | The trigger was wrong. Watch what you actually type when you want this behaviour, then put those phrases in the description. |
| Folder name doesn't match `name:` in frontmatter | They must match exactly. Rename one to match the other. |

## When you're done

1. The new skill is at `.claude/skills/<skill-name>/SKILL.md`.
2. Restart the Claude Code session so the skill is loaded.
3. Use it. Notice what's missing. Update the SKILL.md. Repeat.

That's the whole loop.
