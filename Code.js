const SPREADSHEET_ID = '1Ya3MOX5ALkSGc9n77lc2hhUiCB078VZViI7bN8uqyz8';

function testKCMT() {

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Rankings");

  // Yesterday
const end = new Date();
end.setDate(end.getDate() - 3);

const start = new Date();
start.setDate(start.getDate() - 9);

  const startDate = Utilities.formatDate(start, "Asia/Kolkata", "yyyy-MM-dd");
  const endDate = Utilities.formatDate(end, "Asia/Kolkata", "yyyy-MM-dd");

  const property = encodeURIComponent("sc-domain:kcmt.in");

  const url =
    "https://searchconsole.googleapis.com/webmasters/v3/sites/" +
    property +
    "/searchAnalytics/query";

  const payload = {
    startDate: startDate,
    endDate: endDate,
    dimensions: ["query","date"],
    rowLimit: 25000
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);

  Logger.log(response.getContentText());
  const json = JSON.parse(response.getContentText());

Logger.log(json.rows);

}
function saveKCMT() {

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Rankings");

  const end = new Date();
  end.setDate(end.getDate() - 3);

  const start = new Date();
  start.setDate(start.getDate() - 9);

  const startDate = Utilities.formatDate(start, "Asia/Kolkata", "yyyy-MM-dd");
  const endDate = Utilities.formatDate(end, "Asia/Kolkata", "yyyy-MM-dd");

  const property = encodeURIComponent("sc-domain:kcmt.in");

  const url =
    "https://searchconsole.googleapis.com/webmasters/v3/sites/" +
    property +
    "/searchAnalytics/query";

  const payload = {
    startDate: startDate,
    endDate: endDate,
    dimensions: ["query", "date"],
    rowLimit: 25000
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    },
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);

  const json = JSON.parse(response.getContentText());

  if (!json.rows) return;

  let output = [];

  json.rows.forEach(r => {

    output.push([
      "kcmt.in",
      r.keys[1],
      getISOWeek(r.keys[1]),
      r.keys[0],
      r.clicks,
      r.impressions,
      r.ctr,
      r.position
    ]);

  });

  sheet.getRange(
      sheet.getLastRow()+1,
      1,
      output.length,
      output[0].length
  ).setValues(output);

}
function getISOWeek(dateString){

  const date = new Date(dateString);

  const firstDay = new Date(date.getFullYear(),0,1);

  const week = Math.ceil((((date-firstDay)/86400000)+firstDay.getDay()+1)/7);

  return date.getFullYear()+"-W"+("0"+week).slice(-2);

}
function testSettings(){

  Logger.log(getActiveSites());

}