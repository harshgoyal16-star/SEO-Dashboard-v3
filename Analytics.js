/***************************************************
 * ANALYTICS v3
 ***************************************************/

function generateAnalytics() {

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const movementSheet = ss.getSheetByName(CONFIG.KEYWORD_MOVEMENT_SHEET);
    const dashboardSheet = ss.getSheetByName(CONFIG.ANALYTICS_SHEET);

  const values = movementSheet.getDataRange().getValues();

  if (values.length <= 1) {
    writeLog("Keyword Movement empty");
    return;
  }

    const rows = values.slice(1);
    const summary = {
        improved: 0,
        declined: 0,
        newKeywords: 0,
        lostKeywords: 0
    };

  const improved = [];
  const declined = [];
  const newKeywords = [];
  const lostKeywords = [];

  const enteredTop3 = [];
  const enteredTop10 = [];
  const droppedTop3 = [];
  const droppedTop10 = [];

  rows.forEach(function(r){

    const oldPos = Number(r[4]);
    const newPos = Number(r[5]);
    const change = Number(r[6]);
    const status = String(r[7]);

      switch (status) {

          case "Improved":
              summary.improved++;
              improved.push(r);
              break;

          case "Declined":
              summary.declined++;
              declined.push(r);
              break;

          case "New":
              summary.newKeywords++;
              newKeywords.push(r);
              break;

          case "Lost":
              summary.lostKeywords++;
              lostKeywords.push(r);
              break;

      }

    if(!isNaN(oldPos) && !isNaN(newPos)){

      if(oldPos > 3 && newPos <= 3)
        enteredTop3.push(r);

      if(oldPos > 10 && newPos <= 10)
        enteredTop10.push(r);

      if(oldPos <= 3 && newPos > 3)
        droppedTop3.push(r);

      if(oldPos <= 10 && newPos > 10)
        droppedTop10.push(r);

    }

  });

  improved.sort((a,b)=>Number(b[6])-Number(a[6]));
  declined.sort((a,b)=>Number(a[6])-Number(b[6]));

    newKeywords.sort((a, b) => String(a[1]).localeCompare(String(b[1])));
    lostKeywords.sort((a, b) => String(a[1]).localeCompare(String(b[1])));
  const output = [];

    output.push(["SEO DASHBOARD v3"]);
    output.push(["Generated", new Date()]);
    output.push([]);

    output.push(["SUMMARY"]);
    output.push(["Improved", summary.improved]);
    output.push(["Declined", summary.declined]);
    output.push(["New", summary.newKeywords]);
    output.push(["Lost", summary.lostKeywords]);
    output.push([]);

  /***************************************************
 * TOP 20 WINNERS
 ***************************************************/

output.push(["TOP 20 WINNERS"]);
output.push(["Keyword","Old","New","Change"]);

improved.slice(0,20).forEach(function(r){

  output.push([
    r[1],
    r[4],
    r[5],
    r[6]
  ]);

});

output.push([]);

/***************************************************
 * TOP 20 LOSERS
 ***************************************************/

output.push(["TOP 20 LOSERS"]);
output.push(["Keyword","Old","New","Change"]);

declined.slice(0,20).forEach(function(r){

  output.push([
    r[1],
    r[4],
    r[5],
    r[6]
  ]);

});

output.push([]);

/***************************************************
 * NEW KEYWORDS
 ***************************************************/

output.push(["NEW KEYWORDS"]);
output.push(["Domain","Keyword"]);

newKeywords.forEach(function(r){

  output.push([
    r[0],
    r[1]
  ]);

});

output.push([]);

/***************************************************
 * LOST KEYWORDS
 ***************************************************/

output.push(["LOST KEYWORDS"]);
output.push(["Domain","Keyword"]);

lostKeywords.forEach(function(r){

  output.push([
    r[0],
    r[1]
  ]);

});

output.push([]);

/***************************************************
 * ENTERED TOP 3
 ***************************************************/

output.push(["ENTERED TOP 3"]);
output.push(["Keyword","Old","New"]);

enteredTop3.forEach(function(r){

  output.push([
    r[1],
    r[4],
    r[5]
  ]);

});

output.push([]);

/***************************************************
 * ENTERED TOP 10
 ***************************************************/

output.push(["ENTERED TOP 10"]);
output.push(["Keyword","Old","New"]);

enteredTop10.forEach(function(r){

  output.push([
    r[1],
    r[4],
    r[5]
  ]);

});

output.push([]);

/***************************************************
 * DROPPED FROM TOP 3
 ***************************************************/

output.push(["DROPPED FROM TOP 3"]);
output.push(["Keyword","Old","New"]);

droppedTop3.forEach(function(r){

  output.push([
    r[1],
    r[4],
    r[5]
  ]);

});

output.push([]);

/***************************************************
 * DROPPED FROM TOP 10
 ***************************************************/

output.push(["DROPPED FROM TOP 10"]);
output.push(["Keyword","Old","New"]);

droppedTop10.forEach(function(r){

  output.push([
    r[1],
    r[4],
    r[5]
  ]);

});

output.push([]);

/***************************************************
 * WRITE DASHBOARD
 ***************************************************/

// Find maximum columns
let maxCols = 0;

output.forEach(function(r){

  if(r.length > maxCols)
    maxCols = r.length;

});

// Make all rows equal length
const finalOutput = output.map(function(r){

  while(r.length < maxCols)
    r.push("");

  return r;

});

// Write once (FAST)
dashboardSheet.clearContents();

dashboardSheet
  .getRange(
    1,
    1,
    finalOutput.length,
    maxCols
  )
    .setValues(finalOutput);
    dashboardSheet.getRange("A1:D1")
        .setFontWeight("bold")
        .setBackground("#1F4E78")
        .setFontColor("white");

    dashboardSheet.autoResizeColumns(1, maxCols);

    dashboardSheet.setFrozenRows(1);

    writeLog(
        "Analytics generated | Improved: " + summary.improved +
        " | Declined: " + summary.declined +
        " | New: " + summary.newKeywords +
        " | Lost: " + summary.lostKeywords
    );

}