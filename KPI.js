/***************************************************
 * KPI
 ***************************************************/

function calculateKPIs() {

    const latest = getLatestRankingDate();
    const rows = getKeywordsByDate(latest);

    if (!rows.length) {
        writeLog("No ranking data found.");
        return;
    }

    let kpi = {
        keywords: rows.length,
        top3: 0,
        top10: 0,
        top20: 0,
        top50: 0,
        top100: 0,
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: 0
    };

    rows.forEach(function (r) {

        const pos = Number(r[7]) || 0;

        if (pos <= 3) kpi.top3++;
        if (pos <= 10) kpi.top10++;
        if (pos <= 20) kpi.top20++;
        if (pos <= 50) kpi.top50++;
        if (pos <= 100) kpi.top100++;

        kpi.clicks += Number(r[4]) || 0;
        kpi.impressions += Number(r[5]) || 0;
        kpi.ctr += Number(r[6]) || 0;
        kpi.position += pos;

    });

    kpi.avgCTR = kpi.keywords
        ? +(kpi.ctr / kpi.keywords).toFixed(2)
        : 0;

    kpi.avgPosition = kpi.keywords
        ? +(kpi.position / kpi.keywords).toFixed(2)
        : 0;

    const sheet = SpreadsheetApp
        .openById(CONFIG.SPREADSHEET_ID)
        .getSheetByName(CONFIG.DASHBOARD_DATA_SHEET);

    sheet.clear();

    const output = [

        ["Metric", "Value"],

        ["Date", latest],

        ["Total Keywords", kpi.keywords],

        ["Top 3", kpi.top3],

        ["Top 10", kpi.top10],

        ["Top 20", kpi.top20],

        ["Top 50", kpi.top50],

        ["Top 100", kpi.top100],

        ["Clicks", kpi.clicks],

        ["Impressions", kpi.impressions],

        ["Average CTR", kpi.avgCTR],

        ["Average Position", kpi.avgPosition]

    ];

    sheet.getRange(
        1,
        1,
        output.length,
        2
    ).setValues(output);

    sheet.getRange("A1:B1")
        .setFontWeight("bold")
        .setBackground("#1F4E78")
        .setFontColor("white");

    sheet.autoResizeColumns(1, 2);

    writeLog("KPIs calculated");

}