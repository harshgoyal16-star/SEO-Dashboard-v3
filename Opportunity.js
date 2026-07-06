/***************************************************
 * OPPORTUNITY REPORT
 ***************************************************/

function generateOpportunityReport() {

    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

    const latestSheet = ss.getSheetByName(CONFIG.KEYWORD_LATEST_SHEET);

    let target = ss.getSheetByName("Opportunities");

    if (!target)
        target = ss.insertSheet("Opportunities");

    target.clear();

    const data = latestSheet.getDataRange().getValues();

    if (data.length <= 1) {
        writeLog("Keyword_Latest empty");
        return;
    }

    const output = [];

    output.push([
        "Domain",
        "Keyword",
        "Position",
        "Clicks",
        "Impressions",
        "CTR",
        "Opportunity"
    ]);

    for (let i = 1; i < data.length; i++) {

        const pos = Number(data[i][9]);

        let type = "";

        if (pos > 3 && pos <= 10)
            type = "Top 3 Opportunity";
        else if (pos > 10 && pos <= 20)
            type = "Page 1 Opportunity";
        else
            continue;

        output.push([
            data[i][0],
            data[i][5],
            pos,
            data[i][6],
            data[i][7],
            data[i][8],
            type
        ]);

    }

    target.getRange(
        1,
        1,
        output.length,
        output[0].length
    ).setValues(output);

    target.getRange("A1:G1")
        .setFontWeight("bold")
        .setBackground("#1F4E78")
        .setFontColor("white");

    target.autoResizeColumns(1, 7);

    target.setFrozenRows(1);

    writeLog((output.length - 1) + " opportunities generated");

}