/***************************************************
 * EXECUTIVE DASHBOARD
 * SEO Dashboard v3.0
 ***************************************************/

function generateDashboard() {

    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

    const dashboard = ss.getSheetByName(CONFIG.DASHBOARD_SHEET);
    const dataSheet = ss.getSheetByName(CONFIG.DASHBOARD_DATA_SHEET);
    const movementSheet = ss.getSheetByName(CONFIG.KEYWORD_MOVEMENT_SHEET);

    dashboard.clear();

    dashboard.setFrozenRows(4);

    dashboard.getRange("A1").setValue("SEO DASHBOARD v3.0");
    dashboard.getRange("A2").setValue("Generated");
    dashboard.getRange("B2").setValue(new Date());

    dashboard.getRange("A1:H1")
        .merge()
        .setFontSize(20)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")
        .setBackground("#1F4E78")
        .setFontColor("white");

    dashboard.getRange("A2:B2")
        .setFontWeight("bold");

    //--------------------------------------------------
    // KPI
    //--------------------------------------------------

    const data = dataSheet.getDataRange().getValues();

    if (data.length <= 1) {
        writeLog("Dashboard_Data empty");
        return;
    }

    const latest = data[data.length - 1];

    const kpi = [
        ["Total Keywords", latest[3]],
        ["Clicks", latest[4]],
        ["Impressions", latest[5]],
        ["CTR", latest[6]],
        ["Avg Position", latest[7]],
        ["Top 3", latest[8]],
        ["Top 10", latest[9]],
        ["Top 20", latest[10]],
        ["Top 50", latest[11]],
        ["Top 100", latest[12]]
    ];

    dashboard.getRange(4, 1).setValue("EXECUTIVE KPI")
        .setFontWeight("bold")
        .setBackground("#D9EAD3");

    dashboard.getRange(5, 1, kpi.length, 2).setValues(kpi);

    //--------------------------------------------------
    // DOMAIN SUMMARY
    //--------------------------------------------------

    const startRow = 17;

    dashboard.getRange(startRow, 1)
        .setValue("DOMAIN SUMMARY")
        .setFontWeight("bold")
        .setBackground("#D9EAD3");

    dashboard.getRange(startRow + 1, 1, 1, data[0].length)
        .setValues([data[0]])
        .setFontWeight("bold")
        .setBackground("#EDEDED");

    dashboard.getRange(
        startRow + 2,
        1,
        data.length - 1,
        data[0].length
    ).setValues(data.slice(1));

    //--------------------------------------------------
    // TOP WINNERS
    //--------------------------------------------------

    const movement = movementSheet.getDataRange().getValues();

    const improved = movement
        .slice(1)
        .filter(r => r[7] === "Improved")
        .sort((a, b) => Number(b[6]) - Number(a[6]))
        .slice(0, 20);

    let row = startRow + data.length + 4;

    dashboard.getRange(row++, 1)
        .setValue("TOP 20 WINNERS")
        .setFontWeight("bold")
        .setBackground("#D9EAD3");

    dashboard.getRange(row++, 1, 1, 4).setValues([[
        "Domain",
        "Keyword",
        "Old Pos",
        "New Pos"
    ]]);

    if (improved.length) {

        dashboard.getRange(
            row,
            1,
            improved.length,
            4
        ).setValues(

            improved.map(r => [
                r[0],
                r[1],
                r[4],
                r[5]
            ])

        );

    }

    //--------------------------------------------------
    // TOP LOSERS
    //--------------------------------------------------

    row += improved.length + 3;

    const declined = movement
        .slice(1)
        .filter(r => r[7] == "Declined")
        .sort((a, b) => Number(a[6]) - Number(b[6]))
        .slice(0, 20);

    dashboard.getRange(row++, 1)
        .setValue("TOP 20 LOSERS")
        .setFontWeight("bold")
        .setBackground("#F4CCCC");

    dashboard.getRange(row++, 1, 1, 4).setValues([[
        "Domain",
        "Keyword",
        "Old Pos",
        "New Pos"
    ]]);

    if (declined.length) {

        dashboard.getRange(
            row,
            1,
            declined.length,
            4
        ).setValues(

            declined.map(r => [
                r[0],
                r[1],
                r[4],
                r[5]
            ])

        );

    }

    dashboard.autoResizeColumns(1, 18);

    writeLog("Dashboard Generated");

}