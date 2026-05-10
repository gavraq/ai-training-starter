# ValidateSkill Workflow

**Purpose:** Check if an existing skill follows the canonical structure with proper TitleCase naming.

---

## Step 1: Read the reference examples

Read a modern canonical skill and project conventions:

```
.claude/skills/TaskManagement/SKILL.md
.claude/skills/CreateSkill/SKILL.md
CLAUDE.md
.claude/CLAUDE.md
```

---

## Step 2: Read the Target Skill

```bash
/.claude/skills/[SkillName]/SKILL.md
```

---

## Step 3: Check TitleCase Naming

### Skill Directory
```bash
ls /.claude/skills/ | grep -i [skillname]
```

Verify TitleCase:
- PASS: `Blogging`, `CreateSkill`, `HealthTracking`
- FAIL: `createskill`, `create-skill`, `CREATE_SKILL`

### Workflow Files
```bash
ls /.claude/skills/[SkillName]/Workflows/
```

Verify TitleCase:
- PASS: `Create.md`, `UpdateDaemonInfo.md`, `SyncRepo.md`
- FAIL: `create.md`, `update-daemon-info.md`, `SYNC_REPO.md`

### Tool Files
```bash
ls /.claude/skills/[SkillName]/Tools/
```

Verify TitleCase:
- PASS: `ManageServer.ts`, `Inference.ts`
- FAIL: `manage-server.ts`, `MANAGE_SERVER.ts`

---

## Step 4: Check YAML Frontmatter

Verify the YAML has:

### Single-Line Description with USE WHEN
```yaml
---
name: SkillName
description: [What it does]. USE WHEN [intent triggers using OR]. [Additional capabilities].
---
```

**Check for violations:**
- Multi-line description using `|` (WRONG)
- Missing `USE WHEN` keyword (WRONG)
- Separate `triggers:` array in YAML (OLD FORMAT - WRONG)
- Separate `workflows:` array in YAML (OLD FORMAT - WRONG)
- `name:` not in TitleCase (WRONG)

---

## Step 5: Check Markdown Body

Verify the body has:

### Workflow Routing Section
```markdown
## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **WorkflowOne** | "trigger phrase" | `Workflows/WorkflowOne.md` |
```

**Check for violations:**
- Missing `## Workflow Routing` section
- Workflow names not in TitleCase
- File paths not matching actual file names

### Examples Section
```markdown
## Examples

**Example 1: [Use case]**
```
User: "[Request]"
→ [Action]
→ [Result]
```
```

**Check:** Examples section required (WRONG if missing)

---

## Step 6: Check Workflow Files

```bash
ls /.claude/skills/[SkillName]/Workflows/
```

Verify:
- Every file uses TitleCase naming
- Every file has a corresponding entry in `## Workflow Routing` section
- Every routing entry points to an existing file
- Routing table names match file names exactly

---

## Step 7: Check Structure

```bash
ls -la /.claude/skills/[SkillName]/
```

Verify:
- `Workflows/` directory exists
- `Tools/` directory exists (even if empty)
- No `backups/` directory inside skill
- No nested subdirectories beyond 2 levels
- Reference docs at skill root (not in Workflows/)

---

## Step 7a: Check CLI-First Integration (for skills with CLI tools)

**If the skill has CLI tools in `Tools/` or `scripts/`:**

### CLI Tool Configuration Flags

Check each tool for flag-based configuration:
```bash
bun /.claude/skills/[SkillName]/Tools/[ToolName].ts --help
```

Or for Python scripts:
```bash
python3 /.claude/skills/[SkillName]/scripts/[script].py --help
```

Verify the tool exposes behavioral configuration via flags:
- Mode flags (--fast, --thorough, --dry-run) where applicable
- Output flags (--format, --quiet, --verbose)
- Resource flags (--model, --level) if applicable

### Workflow Intent-to-Flag Mapping

For workflows that call CLI tools, check for intent-to-flag mapping:

**Required pattern in workflows with CLI tools:**
```markdown
## Intent-to-Flag Mapping

| User Says | Flag | When to Use |
|-----------|------|-------------|
| "fast" | `--level fast` | Speed priority |
| (default) | `--level standard` | Balanced |
```

**Reference:** project root `CLAUDE.md § Language Architecture` (TypeScript for extensions, Python for services).

---

## Step 8: Report Results

**COMPLIANT** if all checks pass:

### Naming (TitleCase)
- [ ] Skill directory uses TitleCase
- [ ] All workflow files use TitleCase
- [ ] All tool files use TitleCase
- [ ] Routing table names match file names

### YAML Frontmatter
- [ ] `name:` uses TitleCase
- [ ] `description:` is single-line with `USE WHEN`
- [ ] No separate `triggers:` or `workflows:` arrays
- [ ] Description under 1024 characters

### Markdown Body
- [ ] `## Workflow Routing` section present
- [ ] `## Examples` section with 2-3 patterns
- [ ] All workflows have routing entries

### Structure
- [ ] `Workflows/` directory exists
- [ ] `Tools/` directory exists
- [ ] No `backups/` inside skill
- [ ] Maximum 2 levels deep

### CLI-First Integration (if applicable)
- [ ] CLI tools expose configuration via flags
- [ ] Workflows have intent-to-flag mapping tables
- [ ] Flag mappings cover mode, output, and resource selection

**NON-COMPLIANT** if any check fails. Recommend using CanonicalizeSkill workflow.

---

## Done

Skill validation complete. Report compliance status to user.
