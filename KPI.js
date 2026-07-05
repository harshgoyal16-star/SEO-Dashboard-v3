/***************************************************
 * KPI
 ***************************************************/

function calculateKPIs() {

  const latest = getLatestRankingDate();
  const rows = getKeywordsByDate(latest);

  let top3 = 0;
  let top10 = 0;
  let top20 = 0;
  let top50 = 0;
  let top100 = 0;

  let clicks = 0;
  let impressions = 0;
  let ctr = 0;
  let position = 0;

  rows.forEach(r => {

    const pos = Number(r[7]);

    if (pos <= 3) top3++;
    if (pos <= 10) top10++;
    if (pos <= 20) top20++;
    if (pos <= 50) top50++;
    if (pos <= 100) top100++;

    clicks += Number(r[4]);
    impressions += Number(r[5]);
    ctr += Number(r[6]);
    position += pos;

  });

  const avgCTR = rows.length ? ctr / rows.length : 0;
  const avgPosition = rows.length ? position / rows.length : 0;

  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    .getSheetByName(CONFIG.DASHBOARD_DATA_SHEET);

  sheet.clearContents();

  const data = [
    ["Metric","Value"],
    ["Date",latest],
    ["Total Keywords",rows.length],
    ["Top 3",top3],
    ["Top 10",top10],
    ["Top 20",top20],
    ["Top 50",top50],
    ["Top 100",top100],
    ["Clicks",clicks],
    ["Impressions",impressions],
    ["Average CTR",avgCTR],
    ["Average Position",avgPosition]
  ];

  sheet.getRange(1,1,data.length,2).setValues(data);

  writeLog("Dashboard KPIs updated");

}