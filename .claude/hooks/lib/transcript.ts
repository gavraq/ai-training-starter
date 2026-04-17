/**
 * Transcript Reader — shared helper for the PreCompact + SessionEnd hooks.
 *
 * Reads Claude Code's per-session jsonl transcript (at
 * ~/.claude/projects/<project-root-slug>/<session-id>.jsonl) and extracts
 * a structured summary: user prompts, assistant text, tool-call counts.
 *
 * Deterministic — no LLM call.
 *
 * Simplified version of the helper used in gavraq/life. For Phase 2 of the
 * AI Training starter, this is all you need. You'll see production-grade
 * versions (with day-scoping, idempotency, etc.) in Gavin's full system.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';

export interface TranscriptSummary {
  sessionId: string;
  startTime: string | null;
  endTime: string | null;
  userPrompts: string[];
  assistantTexts: string[];
  toolCalls: Record<string, number>;
}

/**
 * Find the jsonl transcript for a session.
 * Tries the project-slug path first; falls back to scanning
 * ~/.claude/projects/* if the hook was invoked from a subdir.
 */
export function findTranscript(sessionId: string, cwd: string): string | null {
  const slug = cwd.replace(/\//g, '-');
  const direct = join(homedir(), '.claude', 'projects', slug, `${sessionId}.jsonl`);
  if (existsSync(direct)) return direct;

  const root = join(homedir(), '.claude', 'projects');
  if (!existsSync(root)) return null;
  for (const dir of readdirSync(root)) {
    const candidate = join(root, dir, `${sessionId}.jsonl`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function isRealPrompt(content: unknown): content is string {
  if (typeof content !== 'string') return false;
  const t = content.trimStart();
  if (t.startsWith('<local-command')) return false;
  if (t.startsWith('<command-name>')) return false;
  if (t.startsWith('<command-message>')) return false;
  if (t.startsWith('<system-reminder>')) return false;
  return t.length >= 2;
}

export function readTranscript(jsonlPath: string): TranscriptSummary {
  const lines = readFileSync(jsonlPath, 'utf-8').split('\n').filter(Boolean);
  const userPrompts: string[] = [];
  const assistantTexts: string[] = [];
  const toolCalls: Record<string, number> = {};
  let sessionId = '';
  let startTime: string | null = null;
  let endTime: string | null = null;

  for (const line of lines) {
    let entry: any;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (entry.sessionId && !sessionId) sessionId = entry.sessionId;
    if (entry.timestamp) {
      if (!startTime) startTime = entry.timestamp;
      endTime = entry.timestamp;
    }
    if (entry.type === 'user' && isRealPrompt(entry.message?.content)) {
      userPrompts.push(entry.message.content);
    } else if (entry.type === 'assistant' && Array.isArray(entry.message?.content)) {
      for (const block of entry.message.content) {
        if (block?.type === 'text' && typeof block.text === 'string' && block.text.trim()) {
          assistantTexts.push(block.text.trim());
        } else if (block?.type === 'tool_use') {
          const n = block.name || 'unknown';
          toolCalls[n] = (toolCalls[n] || 0) + 1;
        }
      }
    }
  }

  return { sessionId, startTime, endTime, userPrompts, assistantTexts, toolCalls };
}

export function formatSummaryMarkdown(summary: TranscriptSummary, heading: string): string {
  const lines: string[] = ['', heading, ''];
  if (summary.userPrompts.length) {
    lines.push('**Prompts:**');
    for (const p of summary.userPrompts) {
      lines.push(`- ${p.replace(/\s+/g, ' ').trim()}`);
    }
    lines.push('');
  }
  if (summary.assistantTexts.length) {
    lines.push('**Assistant responses:**');
    for (const a of summary.assistantTexts) {
      lines.push(`- ${a.replace(/\s+/g, ' ').trim()}`);
    }
    lines.push('');
  }
  const toolNames = Object.keys(summary.toolCalls).sort();
  if (toolNames.length) {
    lines.push('**Tools:** ' + toolNames.map((n) => `${n}×${summary.toolCalls[n]}`).join(', '));
    lines.push('');
  }
  return lines.join('\n');
}

/**
 * Append a block to a daily log. Creates the file (and parent dirs)
 * if missing. Idempotent on heading — skips if the heading is already present.
 */
export function appendToDailyLog(dailyPath: string, block: string): void {
  mkdirSync(dirname(dailyPath), { recursive: true });
  const existing = existsSync(dailyPath) ? readFileSync(dailyPath, 'utf-8') : '';
  const headingLine = block.split('\n').find((l) => l.startsWith('### '));
  if (headingLine && existing.includes(headingLine)) return;

  const date = dailyPath.split('/').pop()?.replace('.md', '') ?? '';
  const header = existing ? existing : `# ${date}\n`;
  writeFileSync(dailyPath, header + block + '\n', 'utf-8');
}
