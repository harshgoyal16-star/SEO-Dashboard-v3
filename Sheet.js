/***************************************************
 * SHEET FUNCTIONS
 ***************************************************/

function getRankingSheet() {
  return SpreadsheetApp
    .openById(CONFIG.SPREADSHEET_ID)
    .getSheetByName(CONFIG.RANKING_SHEET);
}

/***************************************************
 * LOAD EXISTING KEYS
 ***************************************************/

function getExistingKeys() {

  const sheet = getRankingSheet();

  const lastRow = sheet.getLastRow();

  const keys = new Set();

  if (lastRow <= 1)
    return keys;

  const values = sheet.getRange(2,1,lastRow-1,4).getValues();

  values.forEach(r => {

    const d = Utilities.formatDate(
      new Date(r[1]),
      CONFIG.TIMEZONE,
      "yyyy-MM-dd"
    );

    keys.add(
      r[0] + "|" +
      d + "|" +
      r[3]
    );

  });

  return keys;

}

/***************************************************
 * SAVE ROWS
 ***************************************************/

function saveRows(rows, existingKeys){

  if(rows.length===0)
    return 0;

  const output=[];

  rows.forEach(r => {

    const key =
      r.domain + "|" +
      r.date + "|" +
      r.query;

    if(existingKeys.has(key))
      return;

    existingKeys.add(key);

    output.push([
      r.domain,
      r.date,
      r.week,
      r.query,
      r.clicks,
      r.impressions,
      r.ctr,
      r.position
    ]);

  });

  if(output.length===0)
    return 0;

  const sheet=getRankingSheet();

  sheet.getRange(
      sheet.getLastRow()+1,
      1,
      output.length,
      output[0].length
  ).setValues(output);

  return output.length;

}
function getDashboardSheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    .getSheetByName(CONFIG.DASHBOARD_DATA_SHEET);
}

function getKeywordLatestSheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    .getSheetByName(CONFIG.KEYWORD_LATEST_SHEET);
}

function getKeywordMovementSheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    .getSheetByName(CONFIG.KEYWORD_MOVEMENT_SHEET);
}

function getWeeklySummarySheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    .getSheetByName(CONFIG.WEEKLY_SUMMARY_SHEET);
}