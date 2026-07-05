/***************************************************
 * SUMMARY - KEYWORD LATEST
 ***************************************************/

function generateKeywordLatest() {

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const rankingSheet = ss.getSheetByName(CONFIG.RANKING_SHEET);
  let latestSheet = ss.getSheetByName(CONFIG.KEYWORD_LATEST_SHEET);

if (!latestSheet) {
  latestSheet = ss.insertSheet(CONFIG.KEYWORD_LATEST_SHEET);
}

  const data = rankingSheet.getDataRange().getValues();

  if (data.length <= 1) {
    writeLog("Rankings sheet is empty.");
    return;
  }

  // Clear old data
  latestSheet.clearContents();

  latestSheet.appendRow([
    "Domain",
    "Year",
    "Week_No",
    "Week",
    "Date",
    "Query",
    "Clicks",
    "Impressions",
    "CTR",
    "Position"
  ]);

  const latestMap = new Map();

  for (let i = 1; i < data.length; i++) {

    const domain = data[i][0];
    const date = formatDate(new Date(data[i][1]));
    const week = data[i][2];
    const query = data[i][3];

    const key = domain + "|" + week + "|" + query;

    const existing = latestMap.get(key);

    if (!existing || new Date(date) > new Date(existing.date)) {

      latestMap.set(key, {

        domain: domain,

        date: date,

        week: week,

        year: week.split("-W")[0],

        weekNo: Number(week.split("-W")[1]),

        query: query,

        clicks: Number(data[i][4]),

        impressions: Number(data[i][5]),

        ctr: Number(data[i][6]),

        position: Number(data[i][7])

      });

    }

  }

  const output = [];

  latestMap.forEach(function(r){

    output.push([

      r.domain,

      r.year,

      r.weekNo,

      r.week,

      r.date,

      r.query,

      r.clicks,

      r.impressions,

      r.ctr,

      r.position

    ]);

  });

  output.sort(function(a, b) {

  if (String(a[0]) !== String(b[0]))
    return String(a[0]).localeCompare(String(b[0]));

  if (Number(a[1]) !== Number(b[1]))
    return Number(a[1]) - Number(b[1]);

  if (Number(a[2]) !== Number(b[2]))
    return Number(a[2]) - Number(b[2]);

  return String(a[5] || "").localeCompare(String(b[5] || ""));

});

  if(output.length){

    latestSheet.getRange(

      2,
      1,
      output.length,
      output[0].length

    ).setValues(output);

  }

  writeLog(output.length + " rows written to Keyword_Latest");

}
/***************************************************
 * WEEKLY SUMMARY
 ***************************************************/

function generateWeeklySummary() {

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const source = ss.getSheetByName(CONFIG.KEYWORD_LATEST_SHEET);
  const target = ss.getSheetByName(CONFIG.WEEKLY_SUMMARY_SHEET);

  const data = source.getDataRange().getValues();

  if (data.length <= 1) {
    writeLog("Keyword_Latest is empty.");
    return;
  }

  target.clearContents();

  target.appendRow([
  "Domain",
  "Query",
  "Previous Week",
  "Current Week",
  "Previous Position",
  "Current Position",
  "Change",
  "Status",
  "Search Volume",
  "Impact Score"
]);

  const summary = new Map();

  for (let i = 1; i < data.length; i++) {

    const domain = data[i][0];
    const week = data[i][3];

    const clicks = Number(data[i][6]) || 0;
    const impressions = Number(data[i][7]) || 0;
    const position = Number(data[i][9]) || 0;

    const key = domain + "|" + week;

    if (!summary.has(key)) {

      summary.set(key, {

        domain,
        week,

        keywords: 0,

        clicks: 0,

        impressions: 0,

        positionSum: 0,

        top3: 0,
        top10: 0,
        top20: 0,
        top50: 0,
        top100: 0

      });

    }

    const s = summary.get(key);

    s.keywords++;

    s.clicks += clicks;

    s.impressions += impressions;

    s.positionSum += position;

    if (position <= 3) s.top3++;

    if (position <= 10) s.top10++;

    if (position <= 20) s.top20++;

    if (position <= 50) s.top50++;

    if (position <= 100) s.top100++;

  }

  const output = [];

  summary.forEach(function(s) {

    output.push([

      s.domain,

      s.week,

      s.keywords,

      s.clicks,

      s.impressions,

      s.impressions > 0
  ? (s.clicks / s.impressions) * 100
  : 0,

      s.keywords > 0
        ? s.positionSum / s.keywords
        : 0,

      s.top3,

      s.top10,

      s.top20,

      s.top50,

      s.top100

    ]);

  });

  output.sort(function(a, b) {

    if (a[0] !== b[0])
      return String(a[0]).localeCompare(String(b[0]));

    return String(a[1]).localeCompare(String(b[1]));

  });

  if (output.length) {

    target.getRange(

      2,
      1,
      output.length,
      output[0].length

    ).setValues(output);

  }

  writeLog(output.length + " weekly summary rows generated");

}
/***************************************************
 * KEYWORD MOVEMENT
 ***************************************************/

function generateKeywordMovement() {

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const source = ss.getSheetByName(CONFIG.KEYWORD_LATEST_SHEET);
  const target = ss.getSheetByName(CONFIG.KEYWORD_MOVEMENT_SHEET);

  const data = source.getDataRange().getValues();

  if (data.length <= 1) {
    writeLog("Keyword_Latest is empty.");
    return;
  }

  target.clearContents();

  target.appendRow([
    "Domain",
    "Query",
    "Previous Week",
    "Current Week",
    "Previous Position",
    "Current Position",
    "Change",
    "Status"
  ]);

  // Group rows by domain
  const domainMap = new Map();

  for (let i = 1; i < data.length; i++) {

    const domain = data[i][0];

    if (!domainMap.has(domain))
      domainMap.set(domain, []);

    domainMap.get(domain).push(data[i]);

  }

  const output = [];

  domainMap.forEach(function(rows, domain) {

    // Find weeks available for this domain
    const weekSet = [...new Set(rows.map(r => r[3]))].sort();

    if (weekSet.length < 2)
      return;

    const previousWeek = weekSet[weekSet.length - 2];
    const currentWeek = weekSet[weekSet.length - 1];

    const previous = new Map();
    const current = new Map();

    rows.forEach(function(r) {

  const week = r[3];
  const query = String(r[5]).trim();

  if (week === previousWeek && !previous.has(query)) {
    previous.set(query, Number(r[9]));
  }

  if (week === currentWeek && !current.has(query)) {
    current.set(query, Number(r[9]));
  }

});

    const allQueries = new Set([
      ...previous.keys(),
      ...current.keys()
    ]);

    allQueries.forEach(function(query) {

      const oldPos = previous.has(query)
        ? previous.get(query)
        : null;

      const newPos = current.has(query)
        ? current.get(query)
        : null;

      let change = "";
let status = "";

if (oldPos == null) {

  status = "New";
  change = "NEW";

}
else if (newPos == null) {

  status = "Lost";
  change = "LOST";

}
else {

  change = +(oldPos - newPos).toFixed(2);

  if (change > 0)
    status = "Improved";
  else if (change < 0)
    status = "Declined";
  else
    status = "No Change";

}

      const searchVolume = getSearchVolume(query);
let impactScore = "";

if (
    typeof change === "number" &&
    !isNaN(searchVolume)
){
    impactScore = Math.abs(change) * searchVolume;
}

output.push([
  domain,
  query,
  previousWeek,
  currentWeek,
  oldPos,
  newPos,
  change,
  status,
  searchVolume,
  impactScore
]);

    });

  });

  output.sort(function(a, b) {

    if (a[0] !== b[0])
      return String(a[0]).localeCompare(String(b[0]));

    if (a[7] !== b[7])
      return String(a[7]).localeCompare(String(b[7]));

    return String(a[1]).localeCompare(String(b[1]));

  });

  if (output.length) {

    target.getRange(
      2,
      1,
      output.length,
      output[0].length
    ).setValues(output);

  }

  writeLog(output.length + " keyword movement rows generated");

}
/***************************************************
 * DASHBOARD DATA
 ***************************************************/
function generateDashboardData() {

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const weeklySheet = ss.getSheetByName(CONFIG.WEEKLY_SUMMARY_SHEET);
  const movementSheet = ss.getSheetByName(CONFIG.KEYWORD_MOVEMENT_SHEET);
  const dashboardSheet = ss.getSheetByName(CONFIG.DASHBOARD_DATA_SHEET);

  dashboardSheet.clearContents();

  dashboardSheet.appendRow([
  "Domain",
  "Week",
  "Import Date",
  "Keywords",
  "Clicks",
  "Impressions",
  "CTR",
  "Avg Position",
  "Top3",
  "Top10",
  "Top20",
  "Top50",
  "Top100",
  "Improved",
  "Declined",
  "New",
  "Lost",
  "No Change"
]);
  const weekly = weeklySheet.getDataRange().getValues();
  const movement = movementSheet.getDataRange().getValues();

  //----------------------------------------------------
  // Count keyword movement
  //----------------------------------------------------

  const movementMap = new Map();

  for (let i = 1; i < movement.length; i++) {

    const domain = movement[i][0];
    const week = movement[i][3];
    const status = movement[i][7];

    const key = domain + "|" + week;

    if (!movementMap.has(key)) {

      movementMap.set(key, {
        Improved: 0,
        Declined: 0,
        New: 0,
        Lost: 0,
        "No Change": 0
      });

    }

    const obj = movementMap.get(key);

    if (obj.hasOwnProperty(status))
      obj[status]++;

  }

  //----------------------------------------------------
  // Merge Weekly Summary
  //----------------------------------------------------

  const output = [];

  for (let i = 1; i < weekly.length; i++) {

    const domain = weekly[i][0];
    const week = weekly[i][1];

    const key = domain + "|" + week;

    const m = movementMap.get(key) || {
      Improved: 0,
      Declined: 0,
      New: 0,
      Lost: 0,
      "No Change": 0
    };

    output.push([

  domain,
  week,
  getToday(),

  weekly[i][2],
  weekly[i][3],
  weekly[i][4],
  Number(weekly[i][5]).toFixed(2),
  Number(weekly[i][6]).toFixed(2),

  weekly[i][7],
  weekly[i][8],
  weekly[i][9],
  weekly[i][10],
  weekly[i][11],

  m.Improved,
  m.Declined,
  m.New,
  m.Lost,
  m["No Change"]

]);
  }

  output.sort(function(a,b){

    if(a[0]!=b[0])
      return String(a[0]).localeCompare(String(b[0]));

    return String(a[1]).localeCompare(String(b[1]));

  });

  dashboardSheet.getRange(
    2,
    1,
    output.length,
    output[0].length
  ).setValues(output);

  writeLog(output.length + " dashboard rows generated");

}