/***************************************************
 * EXECUTIVE DASHBOARD
 * SEO Dashboard v3.0
 ***************************************************/

function generateDashboard() {

    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

    const dashboard = ss.getSheetByName(CONFIG.DASHBOARD_SHEET);
    const dataSheet = ss.getSheetByName(CONFIG.DASHBOARD_DATA_SHEET);

    dashboard.clear();

    // ===== TITLE =====
    dashboard.getRange("A1").setValue("SEO DASHBOARD v3.0");

    dashboard.getRange("A2").setValue("Generated");

    dashboard.getRange("B2").setValue(new Date());

    dashboard.getRange("A1:B2")
        .setFontWeight("bold");

    dashboard.getRange("A1")
        .setFontSize(20);

    // ===== COPY DASHBOARD DATA =====

    const values = dataSheet.getDataRange().getValues();

    if (values.length > 0) {

        dashboard.getRange(
            5,
            1,
            values.length,
            values[0].length
        ).setValues(values);

    }

    // ===== FORMAT =====

    dashboard.autoResizeColumns(
        1,
        Math.max(values[0].length, 8)
    );

    dashboard.setFrozenRows(5);

    dashboard.getRange("A5:J5")
        .setFontWeight("bold");

    writeLog("Executive Dashboard Generated");

}