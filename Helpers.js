/***************************************************
 * HELPERS
 ***************************************************/

function formatDate(date){
  return Utilities.formatDate(
      date,
      CONFIG.TIMEZONE,
      "yyyy-MM-dd"
  );
}

function getDateRange() {

  const end = new Date();
  end.setDate(end.getDate() - CONFIG.DAYS_DELAY);

  const start = new Date();
  start.setDate(start.getDate() - CONFIG.DAYS_BACK);

  return {
    startDate: formatDate(start),
    endDate: formatDate(end)
  };

}
// =========================
// ISO WEEK FUNCTION
// =========================

function getISOWeek(dateString){

  const date = new Date(dateString);

  date.setHours(0,0,0,0);

  date.setDate(date.getDate()+3-(date.getDay()+6)%7);

  const week1=new Date(date.getFullYear(),0,4);

  return date.getFullYear()+"-W"+

  String(

      1+

      Math.round(

      ((date-week1)/86400000

      -3

      +(week1.getDay()+6)%7)/7

      )

  ).padStart(2,'0');

}
function getLogSheet() {
  return SpreadsheetApp
    .openById(CONFIG.SPREADSHEET_ID)
    .getSheetByName(CONFIG.LOG_SHEET);
}
// =========================
// LOG FUNCTION
// =========================

function writeLog(message) {

  getLogSheet().appendRow([
    new Date(),
    "'" + String(message)   // Force text
  ]);

}


// =========================
// READ SETTINGS
// =========================

function getActiveSites() {

  const sheet = SpreadsheetApp
    .openById(CONFIG.SPREADSHEET_ID)
    .getSheetByName(CONFIG.SETTINGS_SHEET);

  const lastRow = sheet.getLastRow();

  if (lastRow <= 1)
    return [];

  const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();

  const sites = [];

  for (let i = 0; i < data.length; i++) {

    const domain = String(data[i][0] || "").trim();
    const property = String(data[i][1] || "").trim();
    const active = String(data[i][2] || "").trim().toUpperCase();

    if (domain && property && active === "YES") {

      sites.push({
        domain,
        property
      });

    }

  }

  return sites;

}
function getToday() {
  return formatDate(new Date());
}