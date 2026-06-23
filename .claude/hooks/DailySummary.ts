#!/usr/bin/env bun
/**
 * SessionEnd hook: write a short, PLAIN-ENGLISH summary of what was worked on
 * this session into the vault's daily activity log.
 *
 * Why this exists (Session 8): the mission-control dashboard's "recent activity"
 * panel needs something human-readable to show. This hook is that data source —
 * after every session, it asks a small fast model (Haiku) to summarise what got
 * done, in plain language, and appends it under a "## Summary" heading in:
 *
 *     <vault>/daily/YYYY-MM-DD.md
 *
 * i.e. the SAME daily folder your Phase 2 hooks already write to — one data
 * source, not a parallel one. The dashboard reads "## Summary" from these files.
 *
 * Deliberately simple and self-contained (no shared lib), to match the starter's
 * style. The full life-vault agent has a richer version (SessionEndSummary +
 * daily_reflect); this is the teaching-sized cousin.
 *
 * Register it in .claude/settings.json under "SessionEnd" (see the notes).
 * Set SKIP_SUMMARY=1 to disable (e.g. when a script drives claude -p).
 */

import { readFileSync, readdirSync, existsSync, mkdirSync, appendFileSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { spawnSync } from 'child_process';

// Small fast model — cheap, and a single session is a bounded, easy job for it.
const SUMMARY_MODEL = 'claude-haiku-4-5-20251001';

interface HookInput {
  session_id?: string;
  cwd?: string;
}

function todayISO(): string {
  // Local date as YYYY-MM-DD.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function hhmm(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Find the vault folder (named `vault` or ending in `-vault`), same rule as LoadMasterPrompt. */
function findVault(cwd: string): string | null {
  try {
    const dir = readdirSync(cwd)
      .filter((d) => {
        try {
          return statSync(join(cwd, d)).isDirectory();
        } catch {
          return false;
        }
      })
      .find((d) => d === 'vault' || d.endsWith('-vault'));
    return dir ? join(cwd, dir) : null;
  } catch {
    return null;
  }
}

/**
 * Locate this session's transcript. Claude Code stores it at
 * ~/.claude/projects/<slug>/<session_id>.jsonl, where <slug> is the project
 * path with `/` and `.` turned into `-`.
 */
function findTranscript(sessionId: string, cwd: string): string | null {
  const slug = cwd.replace(/[/.]/g, '-');
  const path = join(homedir(), '.claude', 'projects', slug, `${sessionId}.jsonl`);
  return existsSync(path) ? path : null;
}

/** Pull the user prompts and assistant text out of the jsonl transcript (today only). */
function readTranscript(jsonlPath: string, dayStartISO: string): { prompts: string[]; responses: string[] } {
  const prompts: string[] = [];
  const responses: string[] = [];
  const lines = readFileSync(jsonlPath, 'utf-8').split('\n').filter(Boolean);

  for (const line of lines) {
    let entry: any;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (entry.timestamp && entry.timestamp < dayStartISO) continue;

    const role = entry.type; // 'user' | 'assistant'
    const content = entry.message?.content;
    if (!content) continue;

    // content is either a string or an array of {type, text} blocks.
    const text = typeof content === 'string'
      ? content
      : Array.isArray(content)
        ? content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join(' ')
        : '';
    const clean = text.replace(/\s+/g, ' ').trim();
    if (!clean) continue;

    if (role === 'user' && !clean.startsWith('<')) prompts.push(clean);
    else if (role === 'assistant') responses.push(clean);
  }
  return { prompts, responses };
}

/**
 * THE DE-JARGONED PROMPT.
 *
 * The point of the rewrite: the old summary prompt said "be direct, technical"
 * and rewarded specifics like "Raised WM threshold to 100W/2min". Great for an
 * engineer's log, wrong for a dashboard a normal person glances at. This version
 * asks for plain English and outcomes — what got done, not how.
 */
function buildPrompt(prompts: string[], responses: string[]): string {
  return `You are writing one short note for a person's daily activity log — a plain record of what their AI assistant helped them get done today, which they'll glance at on a dashboard.

Write in PLAIN, FRIENDLY ENGLISH for a non-technical reader. Imagine telling a friend what you two got done today. Avoid jargon, file names, code, settings, and technical detail unless it genuinely matters to a normal person. Focus on what was actually accomplished or decided — the outcome, not the mechanics. British English.

--- WHAT THEY ASKED FOR ---
${prompts.join('\n') || '(nothing recorded)'}

--- WHAT GOT DONE ---
${responses.join('\n').slice(0, 12000) || '(nothing recorded)'}
--- END ---

Write 1 to 3 short sentences summarising what was worked on and what got done. Lead with the result. If a real decision was made, say it plainly. No preamble, no heading, no sign-off — just the sentence(s).`;
}

function summarise(prompts: string[], responses: string[]): string | null {
  try {
    const result = spawnSync('claude', ['-p', '--model', SUMMARY_MODEL], {
      input: buildPrompt(prompts, responses),
      encoding: 'utf-8',
      maxBuffer: 5 * 1024 * 1024,
      env: { ...process.env, SKIP_SUMMARY: '1' }, // don't recurse if the child ends a session
      timeout: 90_000,
    });
    if (result.error || result.status !== 0) return null;
    return result.stdout.trim() || null;
  } catch {
    return null;
  }
}

function main() {
  try {
    if (process.env.SKIP_SUMMARY === '1') process.exit(0);

    const raw = readFileSync(0, 'utf-8'); // stdin
    if (!raw.trim()) process.exit(0);
    const data: HookInput = JSON.parse(raw);

    const sessionId = data.session_id;
    const cwd = data.cwd || process.cwd();
    if (!sessionId) process.exit(0);

    const vault = findVault(cwd);
    if (!vault) process.exit(0);

    const jsonlPath = findTranscript(sessionId, cwd);
    if (!jsonlPath) process.exit(0);

    const today = todayISO();
    const dayStartISO = new Date(`${today}T00:00:00`).toISOString();
    const { prompts, responses } = readTranscript(jsonlPath, dayStartISO);
    if (prompts.length === 0) process.exit(0); // nothing happened today

    const summary = summarise(prompts, responses);
    if (!summary) process.exit(0); // summary is an enhancement, never block

    // Append to <vault>/daily/YYYY-MM-DD.md under a "## Summary" heading — the
    // same daily folder the Phase 2 hooks use, and what the dashboard reads.
    const dailyDir = join(vault, 'daily');
    if (!existsSync(dailyDir)) mkdirSync(dailyDir, { recursive: true });
    const file = join(dailyDir, `${today}.md`);

    const tag = `<!-- session ${sessionId.slice(0, 8)} -->`;
    if (existsSync(file) && readFileSync(file, 'utf-8').includes(tag)) process.exit(0); // one entry per session

    // Ensure the file exists and has a "## Summary" section, then append the bullet.
    if (!existsSync(file)) {
      appendFileSync(file, `# ${today}\n\n## Summary\n\n`);
    } else if (!readFileSync(file, 'utf-8').includes('## Summary')) {
      appendFileSync(file, `\n## Summary\n\n`);
    }
    appendFileSync(file, `- **${hhmm()}** — ${summary} ${tag}\n`);

    console.error(`[DailySummary] wrote summary to ${file}`);
    process.exit(0);
  } catch (err) {
    console.error(`[DailySummary] ${err}`);
    process.exit(0);
  }
}

main();
