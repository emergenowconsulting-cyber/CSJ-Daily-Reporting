// ============================================================
// FRUITFUL COMMUNITIES — CSJ Reporting System
// Google Apps Script Backend  |  Summer 2026
// Paste this entire file into Apps Script (Extensions > Apps Script)
// ============================================================

// ── CONFIGURATION ─────────────────────────────────────────
const MANAGER_PASSWORD = "FruitfulCSJ2026"; // Change this!
const REPORT_EMAIL     = "Deborah.London@fruitfulhouse.com"; // Change this!
const SHEET_NAME_CLOCK = "Attendance";
const SHEET_NAME_DAILY = "DailyReports";
const SHEET_NAME_PROG  = "Deliverables";
const REPORT_FOLDER    = "CSJ 2026 Reports"; // Google Drive folder name

// ── MAIN ENTRY POINT ──────────────────────────────────────
function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === "clockIn")       return respond(clockIn(data));
    if (action === "clockOut")      return respond(clockOut(data));
    if (action === "submitDaily")   return respond(submitDaily(data));
    if (action === "updateProgress")return respond(updateProgress(data));
    if (action === "verifyPassword")return respond(verifyPassword(data));

    return respond({ok: false, error: "Unknown action: " + action});
  } catch(err) {
    return respond({ok: false, error: err.toString()});
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === "getAttendance")   return respond(getAttendance(e.parameter));
    if (action === "getDailyReports") return respond(getDailyReports(e.parameter));
    if (action === "getDeliverables") return respond(getDeliverables(e.parameter));
    if (action === "getAnalytics")    return respond(getAnalytics());
    if (action === "generateReport")  return respond(generateReport(e.parameter));
    return respond({ok: false, error: "Unknown action"});
  } catch(err) {
    return respond({ok: false, error: err.toString()});
  }
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── SHEET HELPERS ─────────────────────────────────────────
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // Add headers based on sheet name
    if (name === SHEET_NAME_CLOCK) {
      sheet.appendRow(["ID","Timestamp","Name","Role","Date","DayType","WeekNum","ClockIn","ClockOut","Hours","IsLate"]);
    } else if (name === SHEET_NAME_DAILY) {
      sheet.appendRow(["ID","Timestamp","Name","Role","Date","DayType","WeekNum","Hours","Activities","Progress","Challenges","Foodbank","Tomorrow","Win","Skills"]);
    } else if (name === SHEET_NAME_PROG) {
      sheet.appendRow(["Timestamp","Role","Item","Percentage"]);
    }
    sheet.setFrozenRows(1);
    // Format header row
    sheet.getRange(1,1,1,sheet.getLastColumn())
      .setBackground("#1A6B3C")
      .setFontColor("#ffffff")
      .setFontWeight("bold");
  }
  return sheet;
}

function sheetToObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2,5);
}

// ── CLOCK IN ──────────────────────────────────────────────
function clockIn(data) {
  const sheet = getSheet(SHEET_NAME_CLOCK);
  const id    = genId();
  sheet.appendRow([
    id,
    new Date().toISOString(),
    data.name,
    data.role,
    data.date,
    data.dayType,
    data.weekNum,
    data.time,
    "", // clockOut — empty until clock-out
    0,  // hours
    data.isLate ? "YES" : "NO"
  ]);
  return {ok: true, id: id};
}

// ── CLOCK OUT ─────────────────────────────────────────────
function clockOut(data) {
  const sheet = getSheet(SHEET_NAME_CLOCK);
  const rows  = sheet.getDataRange().getValues();
  // Find the row with matching id (column A = index 0)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      sheet.getRange(i+1, 9).setValue(data.clockOut); // ClockOut column
      sheet.getRange(i+1, 10).setValue(data.hours);   // Hours column
      return {ok: true};
    }
  }
  // If not found by id, append a complete row (fallback)
  sheet.appendRow([
    genId(), new Date().toISOString(),
    data.name, data.role, data.date, data.dayType, data.weekNum,
    data.clockIn, data.clockOut, data.hours,
    data.isLate ? "YES" : "NO"
  ]);
  return {ok: true};
}

// ── SUBMIT DAILY REPORT ───────────────────────────────────
function submitDaily(data) {
  const sheet = getSheet(SHEET_NAME_DAILY);
  sheet.appendRow([
    genId(),
    new Date().toISOString(),
    data.name,
    data.role,
    data.date,
    data.dayType,
    data.weekNum,
    data.hours,
    data.activities,
    data.progress,
    data.challenges,
    data.foodbank,
    data.tomorrow,
    data.win,
    (data.skills || []).join(", ")
  ]);
  return {ok: true};
}

// ── UPDATE DELIVERABLE PROGRESS ───────────────────────────
function updateProgress(data) {
  const sheet = getSheet(SHEET_NAME_PROG);
  const rows  = sheet.getDataRange().getValues();
  // Find existing row for this role+item
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === data.role && rows[i][2] === data.item) {
      sheet.getRange(i+1, 1).setValue(new Date().toISOString());
      sheet.getRange(i+1, 4).setValue(data.percentage);
      return {ok: true};
    }
  }
  // Not found — insert new row
  sheet.appendRow([new Date().toISOString(), data.role, data.item, data.percentage]);
  return {ok: true};
}

// ── VERIFY MANAGER PASSWORD ───────────────────────────────
function verifyPassword(data) {
  return {ok: true, valid: data.password === MANAGER_PASSWORD};
}

// ── GET ATTENDANCE ────────────────────────────────────────
function getAttendance(params) {
  const sheet = getSheet(SHEET_NAME_CLOCK);
  let rows    = sheetToObjects(sheet);
  if (params.role)    rows = rows.filter(r => r.Role === params.role);
  if (params.date)    rows = rows.filter(r => r.Date === params.date);
  if (params.weekNum) rows = rows.filter(r => String(r.WeekNum) === params.weekNum);
  return {ok: true, data: rows};
}

// ── GET DAILY REPORTS ─────────────────────────────────────
function getDailyReports(params) {
  const sheet = getSheet(SHEET_NAME_DAILY);
  let rows    = sheetToObjects(sheet);
  if (params.role)    rows = rows.filter(r => r.Role === params.role);
  if (params.weekNum) rows = rows.filter(r => String(r.WeekNum) === params.weekNum);
  return {ok: true, data: rows};
}

// ── GET DELIVERABLES ──────────────────────────────────────
function getDeliverables(params) {
  const sheet = getSheet(SHEET_NAME_PROG);
  let rows    = sheetToObjects(sheet);
  if (params.role) rows = rows.filter(r => r.Role === params.role);
  return {ok: true, data: rows};
}

// ── GET ANALYTICS ─────────────────────────────────────────
function getAnalytics() {
  const clock  = sheetToObjects(getSheet(SHEET_NAME_CLOCK));
  const daily  = sheetToObjects(getSheet(SHEET_NAME_DAILY));
  const prog   = sheetToObjects(getSheet(SHEET_NAME_PROG));

  const totalReports = daily.length;
  const totalHours   = daily.reduce((s,r) => s + (parseFloat(r.Hours)||0), 0);
  const totalWins    = daily.filter(r => r.Win).length;
  const foodBankDays = daily.filter(r => r.Foodbank === "yes").length;
  const lateArrivals = clock.filter(r => r.IsLate === "YES").length;

  // Skills tally
  const skillCount = {};
  daily.forEach(r => {
    if (r.Skills) r.Skills.split(", ").forEach(s => {
      skillCount[s] = (skillCount[s]||0) + 1;
    });
  });

  // By role
  const roles = ["vd","cpd","smm","wc"];
  const byRole = {};
  roles.forEach(role => {
    const rDays   = daily.filter(r => r.Role === role);
    const rClock  = clock.filter(r => r.Role === role);
    const rProg   = prog.filter(r => r.Role === role);
    byRole[role]  = {
      reports:    rDays.length,
      hours:      rDays.reduce((s,r) => s+(parseFloat(r.Hours)||0), 0),
      clockIns:   rClock.length,
      late:       rClock.filter(r => r.IsLate==="YES").length,
      deliverables: rProg.map(r => ({item:r.Item, pct:r.Percentage}))
    };
  });

  return {ok:true, data:{totalReports,totalHours,totalWins,foodBankDays,lateArrivals,skillCount,byRole}};
}

// ── GENERATE REPORT (Google Doc) ──────────────────────────
function generateReport(params) {
  const type    = params.type || "weekly"; // "weekly" | "individual" | "custom"
  const weekNum = params.weekNum;
  const role    = params.role || null;

  const clock  = sheetToObjects(getSheet(SHEET_NAME_CLOCK));
  const daily  = sheetToObjects(getSheet(SHEET_NAME_DAILY));
  const prog   = sheetToObjects(getSheet(SHEET_NAME_PROG));

  const ROLE_LABELS = {
    vd:"Volunteer Services Director", cpd:"Community Programs Director",
    smm:"Social Media Community Manager", wc:"Wellness Program Coordinator"
  };

  // Get or create the reports folder in Drive
  let folder;
  const folders = DriveApp.getFoldersByName(REPORT_FOLDER);
  folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(REPORT_FOLDER);

  const now       = new Date();
  const dateStr   = Utilities.formatDate(now, "America/Toronto", "yyyy-MM-dd HH:mm");
  const titleBase = type === "weekly"
    ? "CSJ Week " + weekNum + " Report — " + dateStr
    : (role ? "CSJ " + (ROLE_LABELS[role]||role) + " — " + dateStr : "CSJ Custom Report — " + dateStr);

  const doc  = DocumentApp.create(titleBase);
  const body = doc.getBody();

  // Style helpers
  const addHeading = (text, level) => {
    const p = body.appendParagraph(text);
    p.setHeading(level === 1 ? DocumentApp.ParagraphHeading.HEADING1
      : level === 2 ? DocumentApp.ParagraphHeading.HEADING2
      : DocumentApp.ParagraphHeading.HEADING3);
    return p;
  };
  const addPara = (text) => body.appendParagraph(text);
  const addHR   = () => {
    const p = body.appendParagraph("─────────────────────────────────────────────────────");
    p.setAttributes({[DocumentApp.Attribute.FONT_SIZE]: 8, [DocumentApp.Attribute.FOREGROUND_COLOR]: "#888888"});
  };

  // ── REPORT HEADER ──
  body.appendParagraph("FRUITFUL COMMUNITIES")
    .setHeading(DocumentApp.ParagraphHeading.TITLE);
  body.appendParagraph("Canada Summer Jobs 2026 — " + (type === "weekly" ? "Week " + weekNum + " Report" : "Staff Report"))
    .setHeading(DocumentApp.ParagraphHeading.SUBTITLE);
  addPara("Generated: " + dateStr + " EST");
  addHR();

  // Determine which roles to include
  const targetRoles = role ? [role] : ["vd","cpd","smm","wc"];

  targetRoles.forEach(r => {
    const label    = ROLE_LABELS[r] || r;
    const rDaily   = daily.filter(d => d.Role === r && (!weekNum || String(d.WeekNum) === String(weekNum)));
    const rClock   = clock.filter(c => c.Role === r && (!weekNum || String(c.WeekNum) === String(weekNum)));
    const rProg    = prog.filter(p => p.Role === r);

    if (!rDaily.length && !rClock.length) return;

    addHeading(label, 1);

    // Get unique dates
    const dates = [...new Set([...rDaily.map(d=>d.Date), ...rClock.map(c=>c.Date)])].sort();

    dates.forEach(date => {
      const dayReport  = rDaily.find(d => d.Date === date);
      const clockEntry = rClock.find(c => c.Date === date);
      const dayType    = clockEntry ? clockEntry.DayType : (dayReport ? dayReport.DayType : "");

      addHeading(dayType + "  " + date, 2);

      if (clockEntry) {
        const hoursVal = parseFloat(clockEntry.Hours) || 0;
        addPara("Clock In: " + (clockEntry.ClockIn||"—") + "   |   Clock Out: " + (clockEntry.ClockOut||"—") + "   |   Hours: " + hoursVal.toFixed(1) + (clockEntry.IsLate==="YES" ? "   ⚠ Late arrival" : ""));
      }

      if (dayReport) {
        if (dayReport.Activities)  { addHeading("Activities", 3); addPara(dayReport.Activities); }
        if (dayReport.Progress)    { addHeading("Progress", 3);   addPara(dayReport.Progress); }
        if (dayReport.Challenges)  { addHeading("Challenges", 3); addPara(dayReport.Challenges); }
        if (dayReport.Win)         { addHeading("Win of the Day", 3); addPara("★  " + dayReport.Win); }
        if (dayReport.Skills)      { addPara("Skills used: " + dayReport.Skills); }
        if (dayReport.Tomorrow)    { addPara("Next shift priorities: " + dayReport.Tomorrow); }
        if (dayReport.Foodbank === "yes") addPara("✓ Food bank served"); 
      }
      addHR();
    });

    // Week totals
    const totalHrs  = rClock.reduce((s,c) => s+(parseFloat(c.Hours)||0), 0);
    const lateCount = rClock.filter(c => c.IsLate==="YES").length;
    const fbCount   = rDaily.filter(d => d.Foodbank==="yes").length;
    const wins      = rDaily.filter(d => d.Win).length;
    addHeading("Summary", 2);
    addPara("Total hours: " + totalHrs.toFixed(1) + "   |   Days worked: " + dates.length + "   |   Food bank days: " + fbCount + "   |   Wins recorded: " + wins + (lateCount ? "   |   Late arrivals: " + lateCount : ""));

    // Deliverables
    if (rProg.length) {
      addHeading("Deliverables Progress", 2);
      rProg.forEach(p => {
        const pct = parseInt(p.Percentage) || 0;
        const bar = "█".repeat(Math.round(pct/10)) + "░".repeat(10-Math.round(pct/10));
        addPara(bar + "  " + pct + "%   " + p.Item);
      });
    }

    body.appendPageBreak();
  });

  // Move doc to reports folder
  const file = DriveApp.getFileById(doc.getId());
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  doc.saveAndClose();

  // Email Deborah a link
  try {
    MailApp.sendEmail({
      to: REPORT_EMAIL,
      subject: "CSJ Report Ready: " + titleBase,
      body: "Your report has been generated and saved to Google Drive.\n\nView it here: " + doc.getUrl() + "\n\nFolder: " + REPORT_FOLDER
    });
  } catch(mailErr) {
    // Email is best-effort — don't fail the whole function
  }

  return {ok: true, url: doc.getUrl(), title: titleBase};
}

// ── SCHEDULED WEEKLY TRIGGER ──────────────────────────────
// Set this to run automatically every Saturday at 6:30pm
// Go to: Apps Script > Triggers > Add Trigger
// Choose: generateWeeklyReports | Time-driven | Week timer | Saturday | 6pm-7pm
function generateWeeklyReports() {
  const today   = new Date();
  const start   = new Date("2026-06-30"); // first Tuesday after June 29 orientation
  const diff    = Math.floor((today - start) / (7*24*60*60*1000));
  const weekNum = (diff >= 0 && diff < 9) ? diff + 1 : null;
  if (!weekNum) return; // Not during program period

  generateReport({type:"weekly", weekNum: String(weekNum)});
}