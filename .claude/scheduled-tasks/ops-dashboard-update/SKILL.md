---
name: ops-dashboard-update
description: Weekly: pull fresh data from Slack Lists API via MCP, regenerate dashboard, push to GitHub Pages.
---

You are updating the Ops Requests Dashboard for Dcycle. This is a fully automated pipeline — no manual CSV export needed.

## Steps

1. **Export fresh data from Slack Lists API**
   Call the `export_ops_requests_csv` MCP tool (from the slack-lists MCP server). This pulls all items from the Ops Requests Slack List (F087T03C18T) and writes them to `/Users/jaime/ops-dashboard/data/Ops_Requests.csv`.
   
   If the MCP tool is not available, fall back to reading `/Users/jaime/Downloads/Ops_Requests.csv` instead.

2. **Read the CSV data** from `/Users/jaime/ops-dashboard/data/Ops_Requests.csv` in chunks of 200 lines using offset/limit since it's large. The CSV has columns: Request, Details, Submitted by, Date submitted, Status, Completed, Assignee, Due Date, DRI, Severity.

3. **Compute all metrics** from the full dataset:
   - Total requests
   - Monthly volume (by month, format "Jan '25", "Feb '25", etc.)
   - Monthly completed count (status = "Done")
   - New unique requesters per month (first appearance)
   - Category breakdown (Software/Tooling, Office/Facilities, Communication/Groups, Access/Permissions, HR/Benefits, Finance, IT Support, Data/Reporting, Merchandise/Swag, Process/Admin, Other)
   - Status breakdown (Done, Aborted/Denied, Not started, In progress, Blocked, New)
   - Severity breakdown (Low, Medium, High, Critical)
   - DRI breakdown
   - Top 15 requesters by volume
   - Carlos Valverde specific: monthly volume, categories, severity, greatest hits list

4. **Update the dashboard HTML** at `/Users/jaime/ops-dashboard/index.html`. The file is a self-contained HTML dashboard with Chart.js. Update ALL the data arrays in the JavaScript section to reflect the new data. Key arrays to update:
   - `monthLabels` — month labels
   - `volume` — monthly request counts
   - `completionDone` — monthly completed counts
   - `newRequesters` — new requesters per month
   - Category data arrays
   - Status/severity data
   - Top requesters table data
   - Carlos Valverde section data (monthly volume, categories, severity, greatest hits)
   - KPI values in the HTML (total requests, completion rate, etc.)

5. **Commit and push** to GitHub:
   ```
   cd /Users/jaime/ops-dashboard
   git add -A
   git commit -m "Weekly dashboard update — [DATE]

   Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
   git push
   ```

6. **Verify** the GitHub Pages deployment started: `gh run list -R Dcycle-by-WUM/ops-dashboard --limit 1`

## Important Notes
- The CSV may have grown since last time — handle new months, new requesters, new categories gracefully.
- Keep the same visual style and chart types — only update the DATA, not the layout.
- If the Slack Lists MCP and CSV file are both unavailable, skip the update and report that no data was available.