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

    const summary = {
        keywords: 0,
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: 0,
        top3: 0,
        top10: 0,
        top20: 0,
        top50: 0,
        top100: 0
    };

    for (let i = 1; i < data.length; i++) {

        summary.keywords += Number(data[i][3]) || 0;
        summary.clicks += Number(data[i][4]) || 0;
        summary.impressions += Number(data[i][5]) || 0;
        summary.ctr += Number(data[i][6]) || 0;
        summary.position += Number(data[i][7]) || 0;

        summary.top3 += Number(data[i][8]) || 0;
        summary.top10 += Number(data[i][9]) || 0;
        summary.top20 += Number(data[i][10]) || 0;
        summary.top50 += Number(data[i][11]) || 0;
        summary.top100 += Number(data[i][12]) || 0;

    }

    const count = data.length - 1;

    const kpi = [
        ["Total Keywords", summary.keywords],
        ["Clicks", summary.clicks],
        ["Impressions", summary.impressions],
        ["CTR", (summary.ctr / count).toFixed(2)],
        ["Avg Position", (summary.position / count).toFixed(2)],
        ["Top 3", summary.top3],
        ["Top 10", summary.top10],
        ["Top 20", summary.top20],
        ["Top 50", summary.top50],
        ["Top 100", summary.top100]
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