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
| `CSJ_Reporting_App_Connected_v4.html` | The main app — open in any browser on phone or desktop |
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
| **Tuesday** | 10:00 AM – 5:00 PM | Offload / Admin + Supervision 1:1s |
| **Wednesday** | 10:30 AM – 6:30 PM | Food Bank Service + Role Work |
| **Thursday** | 10:00 AM – 5:00 PM | Community Engagement + Mentorship 1:1s |
| **Saturday** | 10:30 AM – 6:30 PM | Food Bank + Role Work + Team Huddle |

---

## How the System Works

```
HTML App  →  Google Apps Script  →  Google Sheet
(browser)      (deployed as           (data stored
                web app)               in Drive)
```

1. Youth open the HTML file in their browser and clock in
2. Each action is sent to Apps Script, which writes it to the Google Sheet instantly
3. Deborah opens the Manager view (password protected) to see all data live
4. Every Saturday at 6:30 PM, Apps Script auto-generates a Google Doc summary report and emails it to the program manager
5. On-demand reports can also be generated any time from the Generate Report tab

---

## Setup Instructions

### Step 1 — Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet
2. Name it: **CSJ 2026 Reporting System**
3. Leave it open — Apps Script will auto-create the required tabs on first use

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

1. Open `CSJ_Reporting_App_Connected_v4.html` in a text editor
2. Find this line near the top of the JavaScript section:

```javascript
const SCRIPT_URL = "";
```

3. Paste your Web App URL between the quotes:

```javascript
const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_URL_HERE/exec";
```

4. Save the file
5. Open it in Chrome — you should see a green **Connected** dot in the top bar

### Step 5 — Set Up the Automatic Weekly Report

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

### Step 6 — Share with Youth

- Upload this HTML file to your shared Google Drive folder
- Share the link with each youth — they download and open it in Chrome
- On mobile: tap **Share → Add to Home Screen** for one-tap access
- The app works on phones, tablets, and computers

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Red "Not connected" dot | Check that `SCRIPT_URL` in the HTML file is the full URL from your Apps Script deployment |
| "Authorization required" error | Click Review permissions → sign in → Allow |
| Reports not being emailed | Check `REPORT_EMAIL` in `Code_v3.gs` and check Deborah's spam folder |
| Data not appearing in Google Sheet | In Apps Script go to View → Logs to see any error messages |
| Need to change the manager password | Update `MANAGER_PASSWORD` in `Code_v3.gs`, save, and redeploy |

---

## Data Structure

The Google Sheet will contain three auto-created tabs:

- **Attendance** — Every clock-in and clock-out (name, role, date, day type, week number, time in, time out, hours, late flag)
- **DailyReports** — Every daily report submission (name, role, date, hours, activities, progress, challenges, shift type, win, skills, next day priorities)
- **Deliverables** — Progress tracking for all role-specific deliverables

---

## Report Generation

Reports are generated as formatted Google Docs, saved automatically to the **CSJ 2026 Reports** folder in Google Drive, and emailed to the program manager.

Three report types are available from the **Generate Report** tab in the Manager view:

- **Weekly All-Staff** — All four youth, one selected week
- **Individual** — One staff member, selected week or full program
- **Custom** — Any combination of role and date range

---

## Organization

**Fruitful Communities** is the social services hub of Fruitful House Family Church, serving seniors, youth, newcomers, and families experiencing food insecurity in Mississauga-Malton, Ontario.

- Website: [fruitfulcommunities.ca](https://fruitfulcommunities.ca)
- Location: 1-6731 Columbus Rd, Mississauga, ON
- Program Manager: Deborah London — deborah@fruitfulcommunities.ca

---

## Version History

| Version | Date | Changes |
|---|---|---|
| v1 | May 2026 | Initial build — weekly reporting system |
| v2 | May 2026 | Switched to daily reporting with clock-in/out |
| v3 | Jun 2026 | Updated dates (Jun 29–Aug 29), brand colours applied, Google Sheets connected |
| v4 | Jul 2026 | Name dropdowns, auto-fill role/shift/hours, 12-hour ET timestamps, logo added |

---

*Built for Fruitful Communities · Canada Summer Jobs 2026 · Mississauga-Malton*
