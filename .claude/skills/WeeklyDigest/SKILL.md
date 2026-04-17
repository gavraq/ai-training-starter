---
name: WeeklyDigest
description: Generate a weekly digest and priorities list from a folder of weekly notes. Tailors the output to the user's identity files and MEMORY.md.
---

# Weekly Digest

USE WHEN the user asks to generate, produce, or write a weekly digest,
a weekly summary, a weekly review, or an end-of-week reflection.

## Process

1. **Read inputs**: every `.md` file in `inputs/` modified this week (or the most recent week's file if none from this week yet)
2. **Read prior context**: the most recent digest in `outputs/` (if any) — gives cross-week continuity
3. **Read memory**: `MEMORY.md` in the project root — durable preferences and patterns (already loaded via SessionStart hook, but reference explicitly)
4. **Extract from the raw notes**:
   - Meetings and what was decided
   - Actions taken and their outcomes
   - Open questions / blockers / things waiting on someone
   - Patterns across the week (energy, focus, slippage)
   - **Signals vs noise** — filter administrative items, parked ideas, or items already handled by others
5. **Produce two sections**:
   - **Week in review**: 5–10 bullets, ordered by priority per `identity/GOALS.md` — NOT chronological
   - **Next week's focus**: 3 priorities with concrete rationale + one sentence on *why* each matters given the user's goals
6. **Optionally**: a short "Risks / things to chase" list if the notes surface competitive pressure, deadlines, or items likely to slip
7. **Save** to `outputs/digest-YYYY-MM-DD.md` (today's date)
8. **Return a brief summary** to the user confirming what was written — not the full digest

## Tone (from `identity/SOUL.md`)

- Match the user's preferred tone. If SOUL.md says direct / no fluff / bullet-heavy — honour that.
- No motivational framing ("great week!", "keep it up!"). Honest reflection only.
- If the week was bad, say so. If priorities slipped, flag it.

## Adapting this skill to your angle

Different cohort members will want different digest shapes:

- **Fitness-focused**: change step 4 to extract running logs, sleep, weight, symptoms
- **Client-meeting-focused**: change step 4 to extract per-client activity + next touch point
- **Research-focused**: change step 4 to extract sources read, threads pulled, open questions
- **Family/household-focused**: change step 4 to extract schedules, school/medical dates, recurring patterns

Keep the skill *shape* identical; just tailor what step 4 surfaces. The rest of the structure (ordering by priority, producing two sections, saving to `outputs/`) stays the same.

## What NOT to do

- Don't list items chronologically if the user's goals define a different priority order
- Don't include SOUL-marked "no" items (anything the user has asked not to surface in digests)
- Don't invent items. If the notes don't mention something, don't pad the digest with it.
- Don't treat "random ideas" or "parked" items as legitimate next-week priorities unless the user has said otherwise

## Example invocations that should trigger this skill

- *"Generate my weekly digest"*
- *"Write the end-of-week digest from this week's notes"*
- *"Produce a weekly review based on inputs/"*
- *"What happened this week — summary please"*
