# CSJ Daily Reporting System
### Fruitful Communities — Canada Summer Jobs 2026

> A browser-based daily attendance and reporting app for four Canada Summer Jobs youth placements, connected to Google Sheets for real-time data storage and automated weekly reporting.

---

## Overview

This repository contains the complete reporting system built for Fruitful Communities' Canada Summer Jobs 2026 program. Four youth positions are funded through ESDC, running from **June 29 – August 29, 2026**, operating Tuesday, Wednesday, Thursday, and Saturday out of our Mississauga-Malton hub.

The system has two views:

- **Youth View** — Clock in/out, submit daily reports, track deliverable progress, and view personal history
- **Manager View** (password protected) — Live analytics dashboard, full attendance log, all daily reports, deliverable tracking across all four roles, and on-demand Google Doc report generation

---

## Files in This Repository

| File | Purpose |
|---|---|
| `index.html` | The main app — open in any browser on phone or desktop, or access via GitHub Pages |
| `Code_v3.gs` | Google Apps Script backend — paste into Apps Script and deploy |
| `README.md` | This file |

---

## The Four Positions

| Role | Staff Member | Brand Colour |
|---|---|---|
| Volunteer Experience | Esther Odunjo | Blue `#1B5AAB` |
| Community Outreach & Engagement | Jeslyn Darku | Red `#E63329` |
| Digital Media & Communications | Esli Affran | Gold `#F2CC0C` |
| Youth Wellness Program | Haris Kamran | Green `#3AAA35` |

---

## Program Schedule

| Day | Hours | Structure |
|---|---|---|
| **Orientation (Jun 29)** | 1:00 PM – 4:00 PM | One-time orientation session |
| **Tuesday** | 10:00 AM – 5:00 PM | Offload / Admin + Supervision 1:1s |
| **Wednesday** | 10:30 AM – 6:30 PM | Food Bank Service + Role Work |
| **Thursday** | 10:00 AM – 5:00 PM | Community Engagement + Mentorship 1:1s |
| **Saturday** | 10:30 AM – 6:30 PM | Food Bank + Role Work + Team Huddle |

> Staff may also clock in on non-working days (Monday, Friday, Sunday) if called in for special work. The app supports this and flags those entries as **Non-Working Day: Special Shift**.

---

## How the System Works

```
HTML App  →  Google Apps Script  →  Google Sheet
(browser)      (deployed as           (data stored
                web app)               in Drive)
```

1. Youth open the app via the GitHub Pages link and clock in using their name dropdown
2. Their role auto-fills based on their name selection
3. Each clock-in/out and daily report is sent to Apps Script and written to Google Sheets instantly
4. Deborah opens the Manager view (password protected) to see all data live from the Sheet
5. Every Saturday at 6:30 PM, Apps Script auto-generates a formatted Google Doc summary report and emails it to the program manager
6. On-demand reports can also be generated any time from the Generate Report tab

---

## App Features

### Youth View
- **Clock In / Out** — name dropdown auto-fills role; timestamps recorded in Eastern Time 12-hour format; hours calculated precisely using millisecond timestamps
- **Daily Report** — date, hours, activities, shift type, challenges, skills checklist, tomorrow's priorities, and daily win; all fields auto-fill from clock-out data
- **My History** — personal log of all submitted reports and attendance records
- **Deliverables Tracker** — role-specific progress sliders synced to Google Sheets

### Manager View (Password Protected)
- **Analytics** — team submission status, hours by role, late arrival tracking, top skills across the team
- **Attendance** — full clock-in/out log for all four staff with formatted timestamps
- **Daily Reports** — all submissions filterable by role and week; manager notes on each entry
- **Deliverables** — progress tracking for all four roles in one view
- **Generate Report** — creates a formatted Google Doc (weekly all-staff, individual, or custom range) saved to Google Drive and emailed automatically

### Smart Behaviours
- **Name → Role auto-fill** — selecting a name on Clock In automatically populates the role field
- **Shift type auto-fill** — selects the correct shift type based on the day chosen (Tuesday: Offload/Admin, Wednesday: Food Bank Service, etc.)
- **Hours auto-fill** — daily report hours field populates automatically after clocking out
- **Clock-out persistence** — if a student closes the app after clocking in, their session is restored when they reopen it so they can still clock out
- **Non-working day support** — staff can record time on off-days; the app labels these clearly without blocking entry
- **Eastern Time, 12-hour format** — all timestamps displayed as e.g. 10:02:35 AM throughout

---

## Setup Instructions

### Step 1 — Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet
2. Name it: **CSJ 2026 Reporting System**
3. Leave it open — Apps Script will auto-create the required tabs on first use:
   - **Attendance** — every clock-in and clock-out record
   - **DailyReports** — every daily report submission
   - **Deliverables** — deliverable progress tracking

### Step 2 — Set Up Google Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete the default code
3. Copy the entire contents of `Code_v3.gs` and paste it in
4. At the top of the code, update these two lines:

```javascript
const MANAGER_PASSWORD = "YourChosenPassword";
const REPORT_EMAIL     = "your.email@fruitfulhouse.com";
```

5. Save (Ctrl+S / Cmd+S)

### Step 3 — Deploy as a Web App

1. Click **Deploy → New deployment**
2. Click the gear icon → **Web app**
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Authorize when prompted
6. **Copy the Web App URL** — you will need it in the next step

### Step 4 — Connect the HTML App

1. Open `index.html` in a text editor
2. Find this line near the top of the JavaScript section:

```javascript
const SCRIPT_URL = "";
```

3. Paste your Web App URL between the quotes:

```javascript
const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_URL_HERE/exec";
```

4. Save the file and upload to GitHub
5. Open the GitHub Pages URL in Chrome — you should see a green **Connected** dot in the top bar

### Step 5 — Enable GitHub Pages

1. In your repository, click **Settings → Pages**
2. Under Source, select **main** branch and **/ (root)** folder
3. Click **Save**
4. Your live URL will be: `https://[your-username].github.io/CSJ-Daily-Reporting`

### Step 6 — Set Up the Automatic Weekly Report

1. In Apps Script, click the **clock icon** (Triggers) in the left sidebar
2. Click **Add Trigger** (bottom right)
3. Configure:
   - **Function:** `generateWeeklyReports`
   - **Event source:** Time-driven
   - **Type:** Week timer
   - **Day:** Saturday
   - **Time:** 6 PM – 7 PM
4. Save

Reports will now generate automatically every Saturday and arrive in the program manager's inbox.

### Step 7 — Share with Youth

- Send the GitHub Pages URL to all four staff members
- On mobile: tap **Share → Add to Home Screen** for a one-tap app icon
- The app works on phones, tablets, and computers in any modern browser
- The Manager view is password protected — only share the password with authorized staff

---

## Skills Tracked

The daily report includes a checklist of 15 skills:

Communication · Digital skills · Leadership · Problem-solving · Creativity · Collaboration · Community engagement · Content creation · Facilitation · Data analysis · Conflict resolution · Adaptability · Program development · Data entry · Customer service

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Red "Not connected" dot | Check that `SCRIPT_URL` in the HTML file contains the full URL from your Apps Script deployment and that the file has been re-uploaded to GitHub |
| "Authorization required" error | Click Review permissions → sign in with your Google account → Allow |
| Reports not being emailed | Check `REPORT_EMAIL` in `Code_v3.gs` is correct; also check spam folder for the first email |
| Data not appearing in Google Sheet | In Apps Script go to **View → Logs** to see any error messages |
| Hours showing as 0 or blank | Ensure you are using v8 or later of the app — earlier versions had a timestamp parsing issue that has been resolved |
| Clock Out not available after reopening app | Ensure you are using v6 or later — earlier versions did not persist clock-in state across browser sessions |
| Student clocked in on wrong date | The manager can view and note this in the Daily Reports tab; data is still saved to Sheets |
| Need to change the manager password | Update `MANAGER_PASSWORD` in `Code_v3.gs`, save, and redeploy as a new deployment |
| Weekly report trigger not firing | In Apps Script go to Triggers and confirm the trigger is listed and active; if missing, repeat Step 6 |

---

## Report Generation

Reports are generated as formatted Google Docs, saved automatically to the **CSJ 2026 Reports** folder in Google Drive, and emailed to the program manager.

Three report types are available from the **Generate Report** tab in the Manager view:

| Type | Contents | How Triggered |
|---|---|---|
| Weekly All-Staff | All four staff, one selected week — clock times, hours, activities, challenges, wins, deliverable progress | Auto every Saturday 6:30 PM + manual |
| Individual Staff | One staff member, selected week or full program | Manual — Generate Report tab |
| Custom | Any combination of role and date range | Manual — Generate Report tab |

---

## Organization

**Fruitful Communities** is the social services hub of Fruitful House Family Church, serving seniors, youth, newcomers, and families experiencing food insecurity in Mississauga-Malton, Ontario.

- Website: [fruitfulcommunities.ca](https://fruitfulcommunities.ca)
- Location: 1-6731 Columbus Rd, Mississauga, ON
- Contact: info@fruitfulcommunities.ca

---

## Version History

| Version | Date | Changes |
|---|---|---|
| v1 | May 2026 | Initial build — weekly reporting system |
| v2 | May 2026 | Switched to daily reporting with clock-in/out |
| v3 | Jun 2026 | Updated dates (Jun 29–Aug 29), Fruitful Communities brand colours applied, Google Sheets backend connected |
| v4 | Jul 2026 | Name dropdowns with auto-fill role, shift type auto-fill by day, hours auto-fill on clock-out, 12-hour ET timestamps, FC logo added |
| v5 | Jul 2026 | Fixed Manager view timestamp display — raw ISO strings from Google Sheets now formatted correctly as readable dates and 12-hour times |
| v6 | Jul 2026 | Clock-out persistence — clock-in state saved to localStorage so students can close and reopen the app and still clock out |
| v7 | Jul 2026 | Non-working day support — staff can clock in on off-days (Mon/Fri/Sun); date picker remains restricted to Jun 29–Aug 29 |
| v8 | Jul 2026 | Fixed total hours calculation — switched from string-based time parsing to millisecond timestamp difference; resolves 0-hour issue caused by 12-hour AM/PM format |

---

*Built for Fruitful Communities · Canada Summer Jobs 2026 · Mississauga-Malton*
