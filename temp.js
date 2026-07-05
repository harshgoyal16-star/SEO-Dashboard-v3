function listSheets() {

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  ss.getSheets().forEach(function(s) {
    Logger.log("[" + s.getName() + "]");
  });

}