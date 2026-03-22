---
name: weekly-ops-summary
description: Resumen semanal de actividad laboral y personal (lunes a domingo anterior) consolidando Claude chats, Calendar, Gmail, Slack y Notion.
---

## Weekly Ops Summary — Automated Task

You are generating Jaime's weekly activity summary. Today is Monday. Summarize the PREVIOUS week (Monday–Sunday).

**CRITICAL**: Do NOT use the Agent tool for data gathering. You have direct access to all MCP tools (Gmail, Calendar, Slack, Notion). Call them yourself, in parallel where possible. Subagents cannot reliably access MCP tools.

### Step 0 — Calculate date range

Compute in Europe/Madrid timezone:
- `week_start` = last Monday at 00:00:00
- `week_end` = last Sunday at 23:59:59
- Gmail format: YYYY/MM/DD
- Calendar format: RFC3339 without timezone suffix (e.g., 2026-03-09T00:00:00)
- Slack format: YYYY-MM-DD
- Notion format: YYYY-MM-DD

### Step 1 — Parallel data gathering (YOU do this, not subagents)

Make ALL of these tool calls in parallel in a single message:

1. **Google Calendar** — call `gcal_list_events` with:
   - timeMin: "{week_start}" (RFC3339, no tz)
   - timeMax: "{week_end}" (RFC3339, no tz)
   - timeZone: "Europe/Madrid"
   - maxResults: 250

2. **Gmail** — call `gmail_search_messages` with:
   - q: "after:{YYYY/MM/DD} before:{YYYY/MM/DD+1}"
   - maxResults: 50

3. **Slack messages** — call `slack_search_public_and_private` with:
   - query: "from:<@U087N33RLVA> after:{YYYY-MM-DD} before:{YYYY-MM-DD}"
   - sort: "timestamp"
   - sort_dir: "desc"
   - limit: 20

4. **Notion** — call `notion-search` with:
   - query: "" (broad)
   - filters: { created_date_range: { start_date: "{YYYY-MM-DD}", end_date: "{YYYY-MM-DD}" } }

5. **Weekly Ops Sync canvas** — call `slack_read_canvas` with:
   - canvas_id: "F0A065KP8P3"

6. **Previous #ops_news posts** — call `slack_search_public` with:
   - query: "Last week in Ops in:#ops_news"
   - sort: "timestamp"
   - sort_dir: "desc"
   - limit: 5

7. **Claude chats** — run Bash: `claude conversations list --limit 20 2>/dev/null || echo "Claude chats: no CLI available"`

### Step 2 — Pagination

After Step 1 results return:
- **Gmail**: if nextPageToken exists, call `gmail_search_messages` again with pageToken.
- **Slack**: if results are full (20), paginate up to 10 total calls.
- For each significant Gmail thread, call `gmail_read_message` to get details.
- For Slack messages that look significant (announcements, decisions, long threads), call `slack_read_thread` to get context.

### Step 3 — Deduplication against previous summaries

From the #ops_news results (Step 1.6), extract ALL topics/items mentioned in the most recent 2–3 summaries. These are ALREADY REPORTED and MUST NOT appear again. If an item from this week's data was already covered in a previous summary, skip it entirely — even if there's a small update. Only re-mention something if there's a genuinely new, significant milestone (e.g., "We renewed Ecoinvent" was last week → don't mention Ecoinvent again unless something materially new happened like a price change).

### Step 4 — Analysis & filtering

Now analyze all gathered data. For each potential bullet:

**SENSITIVITY FILTER (mandatory):**
- EXCLUDE: dismissals, firings, disciplinary actions, severance, personnel costs.
- EXCLUDE: anything from ONLY private channels or DMs — if not also in a public channel, it's confidential.
- EXCLUDE: C-Suite content, board discussions, limited-audience strategy docs.
- EXCLUDE: fundraising, Series B, investor topics.
- EXCLUDE: internal criticism of team performance or business viability.
- EXCLUDE: individual candidate names in hiring pipelines → say "we continued interviewing for open roles."
- EXCLUDE: NDA details, confidential visitor logistics, private executive visits. Confidential visitors are NOT new Dcyclers — do not welcome them or mention them at all.
- EXCLUDE: things not yet done or still being decided.

**The test:** "Would Jaime post this in front of the entire company?" If not clearly YES → omit.

**TEMPORAL FILTER (mandatory):**
- Only include things that ACTUALLY HAPPENED during THIS specific week.
- If something was set up or announced in a previous week and is just being used day-to-day now, it is NOT news. Skip it.
- Day-to-day ops enablement (distributing API keys, helping people connect tools, routine support tasks) is NOT bullet-worthy — it falls under the closing "ops_requests" bullet.

**CONTRIBUTION FILTER:**
- Distinguish between Jaime making 1–2 brief comments in a thread vs. leading a discussion/decision/project.
- Only include topics where there was direct, substantial participation.

**OPS TEAM HITS (from canvas):**
- The Weekly Ops Sync canvas has AG (Álvaro Granados) and AML (Álvaro Martínez-Laforgue) "biggest hits."
- Find the most recent week's entries. These are team accomplishments — include relevant ones.
- Same sensitivity and temporal filters apply to team hits.

### Step 5 — Draft output

Produce 5–10 bullets following these rules:

**FORMAT — CRITICAL:**
The output MUST be formatted EXACTLY like this, with the title on its OWN line:
```
*Last week in Ops; a selection:*
• First bullet here.
• Second bullet here.
...
• We kept solving minor issues and major <#C087CGF0Q15|ops_requests>.
```

DO NOT concatenate the title with the first bullet. The title `*Last week in Ops; a selection:*` is on line 1. The first `•` bullet is on line 2. There must be a line break between them.

**VOICE — CRITICAL:**
- ALWAYS use "We" as the subject. NEVER attribute to individual team members.
- NOT "AG finished the performance review template" → YES "We finished the performance review template."
- NOT "AML shipped Tech Tracker v0.8" → YES "We shipped Tech Tracker v0.8."
- This is an OPS TEAM summary, not individual attributions.

**OTHER RULES:**
- Each bullet = ONE topic. Never merge unrelated items.
- No excess operational detail.
- Bullets end with a period.
- Dense, direct, no filler, no praise.
- Currency: €X.XXX,XX
- Deduplicate across sources — one bullet per topic.
- Deduplicate against previous weeks' summaries — never repeat old news.
- Dry humor acceptable if warranted (matches channel tone).
- ALWAYS end with the ops_requests bullet.

**GRANULARITY:**
- Vendor renewals: "We renewed X."
- Tool milestones: specific versions/names — great content.
- Onboarding: "We onboarded [name] as [role]."
- Hiring pipeline: "We continued interviewing for open roles."
- Policy changes: only if publicly announced.
- Meetings: only if outcome is public-relevant.
- Routine enablement/support: not bullet-worthy → covered by ops_requests line.

### Step 6 — Post as draft

Call `slack_send_message_draft` with:
- channel_id: "C09QZLYFW0K"
- message: the formatted summary

If any sources failed or returned errors, append at the end:
```
_No cubierto: [list of failed sources with reason]_
```

Tell Jaime the draft is ready for review in #ops_news.
