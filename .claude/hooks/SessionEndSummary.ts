#!/usr/bin/env bun
/**
 * SessionEnd hook: write a final session summary to today's daily log.
 *
 * Fires when Claude Code exits (manual /exit, timeout, window close).
 * Reads the full session transcript from jsonl and appends a structured
 * block to daily/YYYY-MM-DD.md so the session is recoverable next time.
 *
 * Deterministic — no LLM call.
 */

import { findTranscript, readTranscript, formatSummaryMarkdown, appendToDailyLog } from './lib/transcript';
import { join } from 'path';

interface HookInput {
  session_id?: string;
  cwd?: string;
}

function hhmm(ts: string | null): string {
  if (!ts) return '??:??';
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

async function main() {
  try {
    const input = await Bun.stdin.text();
    if (!input?.trim()) return;
    const data: HookInput = JSON.parse(input);
    const sessionId = data.session_id;
    if (!sessionId) return;

    const jsonl = findTranscript(sessionId, data.cwd || process.cwd());
    if (!jsonl) return;

    const summary = readTranscript(jsonl);
    if (summary.userPrompts.length === 0) return;

    const today = new Date().toISOString().slice(0, 10);
    const dailyPath = join(process.cwd(), 'daily', `${today}.md`);
    const heading = `### Session ${sessionId.slice(0, 8)} (${hhmm(summary.startTime)}–${hhmm(summary.endTime)})`;
    appendToDailyLog(dailyPath, formatSummaryMarkdown(summary, heading));
  } catch (err) {
    console.error(`[SessionEndSummary] ${err}`);
  }
}

main();
