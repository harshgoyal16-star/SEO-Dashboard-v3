/***************************************************
 * SEARCH VOLUME IMPORT
 ***************************************************/

function updateSearchVolumes() {

  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
      .getSheetByName(CONFIG.SEARCH_VOLUME_SHEET);

  const keywordSheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
      .getSheetByName("Keywords");

  const lastRow = keywordSheet.getLastRow();

  if(lastRow<=1){
    Logger.log("No keywords found");
    return;
  }

  const keywords = keywordSheet
      .getRange(2,1,lastRow-1,1)
      .getValues()
      .flat()
      .filter(String);

  Logger.log("Keywords : " + keywords.length);

}
function testKeywords(){

  updateSearchVolumes();

}