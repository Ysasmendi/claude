---
name: remember
description: Use when the user says "remember this", "remember that", "don't forget", "save this", "note this", "add to memory", "update memory", or any variation of asking Claude to persist information across sessions. Also trigger when the user corrects Claude's behavior and the correction should be durable (e.g., "no, always do X", "stop doing Y", "I prefer Z").
---

# Remember — Persistent Memory Skill

When triggered, append the new information to `knowledge/memory.md` under the appropriate section.

## Sections

- **Preferences & Corrections** — How Jaime wants things done. Behavioral corrections. Style tweaks.
- **People & Context** — Who people are, their roles, relationships, nicknames.
- **Decisions & Outcomes** — Decisions made during sessions and why. Prevents re-litigation.
- **Tools & Workflows** — Learned patterns about tool usage, shortcuts, preferred approaches.
- **Recurring Issues** — Problems and their fixes so we don't troubleshoot the same thing twice.

## Rules

1. **Append, don't overwrite.** Add a new bullet under the right section. Never delete existing entries unless explicitly asked.
2. **Date-stamp each entry.** Format: `- [YYYY-MM-DD] The thing to remember.`
3. **Be precise.** Write exactly what needs to be remembered, not a summary of the conversation.
4. **Deduplicate.** Before adding, scan the file for existing entries on the same topic. Update the existing entry if it's a refinement, add new if it's genuinely new.
5. **Commit the change.** After editing `knowledge/memory.md`, stage and commit with message: `memory: <short description of what was remembered>`.
6. **Confirm to the user.** After saving, reply with what was saved and where.

## Example

User: "Remember that Luis handles all infrastructure decisions and I shouldn't be looped in unless it's budget-related."

Action: Append to **People & Context**:
```
- [2026-03-22] Luis is DRI for infrastructure decisions. Don't loop Jaime in unless budget-related.
```
