/***************************************************
 * REPOSITORY
 ***************************************************/

const Repository = (() => {

    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

    const cache = {};

    function read(sheetName) {

        if (cache[sheetName])
            return cache[sheetName];

        const sheet = ss.getSheetByName(sheetName);

        if (!sheet)
            return [];

        const data = sheet.getDataRange().getValues();

        cache[sheetName] = data.length > 1
            ? data.slice(1)
            : [];

        return cache[sheetName];

    }

    return {

        getKeywordMovement() {
            return read(CONFIG.KEYWORD_MOVEMENT_SHEET);
        },

        getKeywordLatest() {
            return read(CONFIG.KEYWORD_LATEST_SHEET);
        },

        getWeeklySummary() {
            return read(CONFIG.WEEKLY_SUMMARY_SHEET);
        },

        clearCache() {
            Object.keys(cache).forEach(k => delete cache[k]);
        }

    };

})();