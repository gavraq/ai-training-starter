#!/usr/bin/env bun
/**
 * SessionStart hook: loads identity/*.md into the session context.
 * Deterministic, no LLM call. Runs once per session start.
 *
 * Reads every .md file in the identity/ folder, wraps them in a
 * <master-prompt>...</master-prompt> block, and hands the block to
 * Claude Code via the additionalContext channel.
 *
 * To switch to the Python variant: edit .claude/settings.local.json
 * and change the command to `python3 .claude/hooks/LoadMasterPrompt.py`.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const identityDir = join(process.cwd(), 'identity');

if (!existsSync(identityDir)) {
  console.error('[LoadMasterPrompt] identity/ folder not found — skipping');
  process.exit(0);
}

const files = readdirSync(identityDir)
  .filter((f) => f.endsWith('.md'))
  .sort();

const parts: string[] = [
  '<master-prompt>',
  'The following files describe the user. Load them into context for this session and tailor every response accordingly.',
  '',
];

for (const f of files) {
  const content = readFileSync(join(identityDir, f), 'utf-8');
  parts.push(`--- ${f} ---`);
  parts.push(content);
  parts.push('');
}

// Phase 2: also load MEMORY.md (curated long-term memory) if present
const memoryPath = join(process.cwd(), 'MEMORY.md');
if (existsSync(memoryPath)) {
  parts.push('--- MEMORY.md ---');
  parts.push(readFileSync(memoryPath, 'utf-8'));
  parts.push('');
}

parts.push('</master-prompt>');

const block = parts.join('\n');

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: block,
    },
  }),
);
