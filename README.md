# Orange Township Legislative Tracker

A browser-based first pass for tracking City of Orange Township, New Jersey council agenda items, minutes, votes, spending, and budget alignment.

## What it does

- Upload an agenda PDF and extract likely legislative items.
- Upload meeting minutes and apply likely status and vote updates to existing items.
- Track dates introduced, meeting dates, resolutions, ordinances, contracts, vendors, spending, high-level discussion, public comments, and council votes.
- Cross-reference spending against the 2026 budget dataset from `jameshward3/OrangeBudgetDashboard`.
- Compare passed spending against approved budget totals.
- Export and import the tracker data as JSON.

The starter dataset is seeded from the April 7, 2026 regular meeting agenda and minutes provided in this workspace. Additional January-April 2026 meeting history from `OrangeTownship_2026_Meetings.zip` is appended in `imported-history-data.js`. Budget reference values are loaded from `budget-dashboard-data.js`.

## Run it

Open `index.html` in a browser.

The PDF extractor uses PDF.js from a CDN, so PDF upload needs internet access. All tracker data is stored in browser `localStorage`; use **Export JSON** to keep a portable backup.

## Suggested next steps

- Replace placeholder council member names with the current City of Orange council roster.
- Add a backend database if this will be used by multiple researchers or published to the public.
- Add source links for agenda packets, minutes, contracts, budget pages, and staff reports.
- Add a human review workflow so extracted PDF fields can be verified before publication.
