# CreateSkill Workflow

**Purpose:** Create a new skill with proper canonical structure and TitleCase naming.

---

## Step 1: Read the authoritative examples

Read a modern reference skill and its workflow structure before creating a new one:

```
.claude/skills/TaskManagement/SKILL.md
.claude/skills/TaskManagement/Workflows/Capture.md
```

Plus the project-level conventions:
```
CLAUDE.md
.claude/CLAUDE.md
```

---

## Step 2: Clarify Requirements

Before creating, clarify with the user:

1. **What does this skill do?** (one sentence)
2. **When should it activate?** (USE WHEN triggers)
3. **What workflows are needed?** (list actions)
4. **Does it need CLI tools?** (scripts, APIs)

---

## Step 3: Determine TitleCase Name

**MANDATORY: All names must use TitleCase (PascalCase)**

Examples:
- PASS: `Blogging`, `CreateSkill`, `HealthTracking`
- FAIL: `blogging`, `create-skill`, `health_tracking`

For multi-word names:
- PASS: `TaskManagement`, `LocationIntelligence`
- FAIL: `task-management`, `location_intelligence`

---

## Step 4: Create Directory Structure

```bash
mkdir -p /.claude/skills/[SkillName]/Workflows
mkdir -p /.claude/skills/[SkillName]/Tools
```

Example:
```bash
mkdir -p /.claude/skills/Recipes/Workflows
mkdir -p /.claude/skills/Recipes/Tools
```

---

## Step 5: Create SKILL.md

Create `/.claude/skills/[SkillName]/SKILL.md`:

```markdown
---
name: SkillName
description: What the skill does. USE WHEN [trigger1] OR [trigger2] OR [trigger3]. Additional capabilities.
---

# SkillName

Brief description of the skill's purpose.

## Workflow Routing

**When executing a workflow, output this notification:**

```
Running the **WorkflowName** workflow from the **SkillName** skill...
```

| Workflow | Trigger | File |
|----------|---------|------|
| **WorkflowOne** | "trigger phrase" | `Workflows/WorkflowOne.md` |
| **WorkflowTwo** | "another trigger" | `Workflows/WorkflowTwo.md` |

## Examples

**Example 1: [Use case]**
```
User: "[Request]"
→ Invokes WorkflowOne workflow
→ [Actions taken]
→ [Result returned]
```

**Example 2: [Another use case]**
```
User: "[Different request]"
→ [Process]
→ [Output]
```

## Domain-Specific Details

[Configuration, API endpoints, file paths, etc.]
```

---

## Step 6: Create Workflow Files

For each workflow, create `/.claude/skills/[SkillName]/Workflows/[WorkflowName].md`:

```markdown
# WorkflowName Workflow

**Purpose:** [What this workflow accomplishes]

---

## Step 1: [First Action]

[Instructions]

---

## Step 2: [Second Action]

[Instructions]

---

## Done

[Summary of what was accomplished]
```

**Naming requirements:**
- PASS: `Create.md`, `UpdateDaemonInfo.md`, `SyncRepo.md`
- FAIL: `create.md`, `update-daemon-info.md`, `sync_repo.md`

---

## Step 7: Add CLI Tools (If Needed)

If the skill needs CLI tools:

1. Create tool file:
```bash
touch /.claude/skills/[SkillName]/Tools/[ToolName].ts
```

2. Create help file:
```bash
touch /.claude/skills/[SkillName]/Tools/[ToolName].help.md
```

3. Follow the project language architecture — see `CLAUDE.md § Language Architecture`:
   - Claude Code extensions (hooks, skills, scripts, commands) → **TypeScript** run via `bun`
   - Platform services (HTTP APIs, schedulers, pipelines) → **Python** using `uv` and `pyproject.toml`

**For Python scripts:**
```bash
mkdir -p /.claude/skills/[SkillName]/scripts
touch /.claude/skills/[SkillName]/scripts/script_name.py
```

---

## Step 8: Verify Structure

Final directory should look like:

```
/.claude/skills/[SkillName]/
├── SKILL.md                    # Main skill file
├── Workflows/                  # Execution procedures
│   ├── WorkflowOne.md
│   └── WorkflowTwo.md
└── Tools/                      # CLI tools (if any)
    ├── ToolName.ts
    └── ToolName.help.md
```

---

## Step 9: Final Checklist

### Naming (TitleCase)
- [ ] Skill directory uses TitleCase
- [ ] All workflow files use TitleCase
- [ ] All tool files use TitleCase

### YAML Frontmatter
- [ ] `name:` uses TitleCase
- [ ] `description:` is single-line with `USE WHEN`
- [ ] No separate `triggers:` or `workflows:` arrays

### Markdown Body
- [ ] `## Workflow Routing` section present with table
- [ ] `## Examples` section with 2-3 patterns
- [ ] All workflows have routing entries

### Structure
- [ ] `Workflows/` directory exists
- [ ] `Tools/` directory exists (even if empty)
- [ ] No nested subdirectories beyond 2 levels

---

## Step 10: Update Skill Index

Regenerate the skill index:

```bash
bun /.claude/skills/CORE/Tools/GenerateSkillIndex.ts
```

Verify the new skill appears:

```bash
bun /.claude/skills/CORE/Tools/SkillSearch.ts "[SkillName]"
```

---

## Done

New skill created with canonical structure and TitleCase naming.
