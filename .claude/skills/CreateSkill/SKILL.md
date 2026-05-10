---
name: CreateSkill
description: Create and validate Claude Code skills in this project. USE WHEN create skill, new skill, skill structure, validate skill, canonicalize skill, update skill, fix skill format.
---

# CreateSkill

Framework for creating, validating, and maintaining skills under `.claude/skills/` in your Claude Code project. Ensures skills follow the canonical structure with YAML frontmatter, routing tables, and workflow files.

**Naming convention**: kebab-case (`weekly-digest`, `morning-brief`) or TitleCase (`WeeklyDigest`, `MorningBrief`) — both are tolerated. Pick one style and stick with it across your project. The skill's `name:` frontmatter field must exactly match the directory name.

## Naming

| Component | Convention | Examples |
|-----------|------------|----------|
| Skill directory | TitleCase **or** kebab-case (match adjacent skills) | `HealthTracking`, `cover-letter` |
| Workflow files | TitleCase.md | `Create.md`, `MorningBriefing.md` |
| Tool files | TitleCase.ts (if script-driven) | `ManageServer.ts` |
| Reference docs | TitleCase.md or kebab-case.md | `api-reference.md` |
| Directory-internal file naming | Prefer lowercase kebab-case per project `CLAUDE.md` | `daily-brief.md` |

The `name:` field in frontmatter must exactly match the directory name.

## Flat Folder Structure (MANDATORY)

**Maximum depth: 2 levels - `skills/SkillName/Category/`**

### Allowed Structure
```
skills/SkillName/
├── SKILL.md           # Root level
├── Workflows/         # One level deep
│   └── Create.md
└── Tools/             # One level deep
    └── Manage.ts
```

### Forbidden Structure
```
skills/SkillName/
└── Workflows/
    └── Category/      # THREE LEVELS - FORBIDDEN
        └── File.md
```

**Rule:** Use clear filenames, NOT subdirectories for organization.

## Workflow Routing

**When executing a workflow, output this notification:**

```
Running the **WorkflowName** workflow from the **CreateSkill** skill...
```

| Workflow | Trigger | File |
|----------|---------|------|
| **CreateSkill** | "create a new skill", "new skill" | `Workflows/CreateSkill.md` |
| **ValidateSkill** | "validate skill", "check skill" | `Workflows/ValidateSkill.md` |
| **UpdateSkill** | "update skill", "add workflow" | `Workflows/UpdateSkill.md` |
| **CanonicalizeSkill** | "canonicalize", "fix skill structure" | `Workflows/CanonicalizeSkill.md` |

## Examples

**Example 1: Create a new skill**
```
User: "Create a new skill for managing recipes"
→ Invokes CreateSkill workflow
→ Clarifies purpose, triggers, workflows
→ Creates Recipes/ with SKILL.md and Workflows/
```

**Example 2: Validate existing skill**
```
User: "Check if my HealthTracking skill is properly formatted"
→ Invokes ValidateSkill workflow
→ Checks TitleCase, YAML frontmatter, routing table
→ Reports compliance or issues
```

**Example 3: Fix non-compliant skill**
```
User: "Canonicalize the location-tracking skill"
→ Invokes CanonicalizeSkill workflow
→ Renames to LocationIntelligence (TitleCase)
→ Restructures YAML, adds routing table
```

## Dynamic Loading Pattern

For skills over 100 lines, use dynamic loading:

1. **SKILL.md** (30-50 lines): Minimal frontmatter + routing
2. **Context files** at skill root for detailed documentation
3. **70%+ token reduction** when full docs aren't needed

## Skill File Requirements

### YAML Frontmatter
```yaml
---
name: SkillName
description: What it does. USE WHEN [intent triggers]. Additional capabilities.
---
```

### Required Sections
1. `## Workflow Routing` - Table mapping triggers to files
2. `## Examples` - 2-3 concrete usage patterns
3. Domain-specific documentation as needed

## Related Documentation

- **Project skill guidelines**: project root `CLAUDE.md` and `.claude/CLAUDE.md`
- **Skills auto-reference**: `life-vault/system/skills/*.md` (regenerate with `bun run scripts/generate_config_docs.ts`)
- **Architecture**: `life-vault/docs/README.md`
