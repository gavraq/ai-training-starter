#!/usr/bin/env bun
/**
 * SessionStart hook: loads <vault>/identity/*.md + <vault>/MEMORY.md
 * into the session context.
 *
 * Deterministic, no LLM call. Runs once per session start.
 *
 * Auto-detects the vault directory: looks for any folder named `vault`
 * or ending in `-vault` (e.g. `chiefofstaff-vault`, `jarvis-vault`).
 * This way participants can rename `vault/` → `<their-agent-name>-vault/`
 * after cloning, and the hook still finds it.
 *
 * Reads every .md file in <vault>/identity/, plus <vault>/MEMORY.md if
 * present (Phase 2 — curated long-term memory). Wraps them in a
 * <master-prompt>...</master-prompt> block, and hands the block to
 * Claude Code via the additionalContext channel.
 *
 * To switch to the Python variant: edit .claude/settings.json
 * and change the command to `python3 .claude/hooks/LoadMasterPrompt.py`.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const cwd = process.cwd();

// Find the vault directory (any folder named `vault` or ending in `-vault`)
const vaultDir = readdirSync(cwd)
  .filter((d) => {
    try {
      return statSync(join(cwd, d)).isDirectory();
    } catch {
      return false;
    }
  })
  .find((d) => d === 'vault' || d.endsWith('-vault'));

if (!vaultDir) {
  console.error(
    '[LoadMasterPrompt] No vault directory found (looking for `vault` or `*-vault`). Skipping.',
  );
  process.exit(0);
}

const identityDir = join(cwd, vaultDir, 'identity');

if (!existsSync(identityDir)) {
  console.error(
    `[LoadMasterPrompt] ${vaultDir}/identity/ folder not found — skipping`,
  );
  process.exit(0);
}

const files = readdirSync(identityDir)
  .filter((f) => f.endsWith('.md'))
  .sort();

const parts: string[] = [
  '<master-prompt>',
  `The following files (from ${vaultDir}/identity/) describe the user. Load them into context for this session and tailor every response accordingly.`,
  '',
];

for (const f of files) {
  const content = readFileSync(join(identityDir, f), 'utf-8');
  parts.push(`--- ${f} ---`);
  parts.push(content);
  parts.push('');
}

// Phase 2: also load <vault>/MEMORY.md (curated long-term memory) if present
const memoryPath = join(cwd, vaultDir, 'MEMORY.md');
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
