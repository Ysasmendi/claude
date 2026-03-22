# Claude Knowledge Base

Personal knowledge layer for Claude Code, Cowork, Web Sessions, Dispatch, Remote Control, and Channels.

## Usage

```bash
cd ~/claude && claude
```

Every Claude surface reads from this repo:
- **Web Sessions** clone it from GitHub
- **Everything else** reads it from your local clone

## Structure

- `CLAUDE.md` — Master instructions loaded automatically by every Claude surface
- `.claude/skills/` — Reusable skills (writing style, etc.)
- `.claude/scheduled-tasks/` — Automated tasks (weekly ops summary, etc.)
- `.claude/settings.json` — Shared permissions and config
- `knowledge/` — Research, references, domain knowledge
- `templates/` — Reusable document structures
- `tools/` — Scripts and utilities

## Sync Workflow

```bash
# When switching machines:
git pull

# After working:
git add -A && git commit -m "update" && git push
```
