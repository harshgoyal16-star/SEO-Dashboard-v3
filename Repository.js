/***************************************************
 * REPOSITORY
 ***************************************************/

const Repository = {

  getKeywordMovement() {

    const sheet = SpreadsheetApp
      .openById(CONFIG.SPREADSHEET_ID)
      .getSheetByName(CONFIG.KEYWORD_MOVEMENT_SHEET);

    const data = sheet.getDataRange().getValues();

    if (data.length <= 1)
      return [];

    return data.slice(1);

  },

  getKeywordLatest() {

    const sheet = SpreadsheetApp
      .openById(CONFIG.SPREADSHEET_ID)
      .getSheetByName(CONFIG.KEYWORD_LATEST_SHEET);

    const data = sheet.getDataRange().getValues();

    if (data.length <= 1)
      return [];

    return data.slice(1);

  },

  getWeeklySummary() {

    const sheet = SpreadsheetApp
      .openById(CONFIG.SPREADSHEET_ID)
      .getSheetByName(CONFIG.WEEKLY_SUMMARY_SHEET);

    const data = sheet.getDataRange().getValues();

    if (data.length <= 1)
      return [];

    return data.slice(1);

  }

};