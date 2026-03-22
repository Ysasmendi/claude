# Jaime de la Torre — Claude Knowledge Base

## Who I Am

Jaime de la Torre de Ysasi-Ysasmendi. Head of Operations at Dcycle.
- Slack user ID: U087N33RLVA
- Manages: tooling stack (Claude, Slack, Cursor, Fireflies/Fathom/Salescaling), hiring pipelines, vendor renewals, budgets, onboarding, internal processes.
- Posts weekly "Last week in Ops" summaries in #ops_news (C09QZLYFW0K).
- Tone: direct, dense, occasionally irreverent. No filler, no praise.
- Prefers Spanish for conversation, English for technical/ops summaries.
- Currency format: €X.XXX,XX.

## Writing

When asked to write, draft, compose, or produce any text, use the writing-style skill at `.claude/skills/writing-style.md`.

## Repository Structure

This repo is the durable knowledge layer. Every Claude surface reads from it.

- `knowledge/` — Research, references, domain knowledge. Grows over time.
  - `memory.md` — Persistent memory across sessions. Updated via the `remember` skill.
- `templates/` — Reusable document structures.
- `tools/` — Scripts and utilities.
- `.claude/skills/` — Claude Code skills.
- `.claude/scheduled-tasks/` — Automated tasks.

## Memory System

This repo has a persistent memory system. Claude learns and retains information across sessions.

### How it works
1. **SessionStart hook** runs at the beginning of every session, loading `knowledge/memory.md` into context.
2. **`/remember` skill** — when Jaime says "remember this", "don't forget", or corrects a behavior, Claude appends the information to `knowledge/memory.md` under the right section, commits, and confirms.
3. **`CLAUDE.md`** (this file) holds durable rules and instructions. Update this file for structural changes to how Claude behaves.
4. **`knowledge/memory.md`** holds accumulated session learnings — preferences, people, decisions, workflows, recurring issues.

### When to update memory
- Jaime explicitly asks to remember something.
- Jaime corrects Claude's behavior and the correction should persist.
- A decision is made that shouldn't be re-litigated.
- A recurring problem is solved.

### When to update CLAUDE.md instead
- New permanent rules or behavioral instructions.
- Changes to repo structure or workflow.
- New skills or scheduled tasks added.

## Weekly Ops Summary Rules

The "Last week in Ops" summary is a PUBLIC internal post visible to the entire company. The audience is all Dcyclers. The purpose is to show what Ops has done FOR the team.

### What to EXCLUDE (sensitive/private):
- Dismissals, firings, disciplinary actions — never mention, never hint at.
- Cost of personnel actions (severance, dismissal costs, salary details).
- Anything discussed exclusively in private channels or DMs — if it never appeared in a public channel, it's likely confidential.
- C-Suite meeting content, strategy documents with limited audience.
- Series B, fundraising strategy, investor discussions.
- Internal team performance criticism.
- Candidate names in hiring (say "we continued interviewing for open roles" instead).
- NDA details, confidential visitor logistics.
- Vendor negotiation details beyond the outcome.
- Confidential visitors or guests — if only discussed in private channels, they are NOT new Dcyclers and must not be mentioned.

### Before including any bullet, ask: "Would Jaime post this in front of the entire company?"

If the source is a private channel, DM, or restricted doc, default to EXCLUDE unless the topic is clearly public.

### Temporal accuracy — CRITICAL:
- Only include things that ACTUALLY HAPPENED during the target week.
- Do NOT repeat items from previous weeks' summaries. Check recent #ops_news messages first.
- If something was set up weeks ago and is just being used day-to-day, it's NOT news.

### Formatting:
- `*Last week in Ops; a selection:*` is the TITLE — bold standalone line. First bullet starts on the NEXT line with `•`.
- Each bullet is its own topic. Don't merge unrelated items.
- ALWAYS use "We" as the subject. NEVER attribute to individual team members.
- No excess operational detail.

### Sources:
- Scheduled task ID: `weekly-ops-summary` (runs Mondays ~9:03 AM)
- Gathers from: Claude chats, Google Calendar, Gmail, Slack, Notion, Weekly Ops Sync canvas (F0A065KP8P3) in #ops_chat (C08MMKJTX2T)
- Drafts to #ops_news (C09QZLYFW0K) — does NOT auto-send.
- Ops requests channel: #ops_requests (C087CGF0Q15).
