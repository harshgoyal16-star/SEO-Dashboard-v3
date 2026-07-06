/***************************************************
 * MAIN IMPORT
 ***************************************************/

function runSEOImport() {

  writeLog("IMPORT STARTED");

  const sites = getActiveSites();

  // Read existing keys ONLY ONCE
  const existingKeys = getExistingKeys();

  let totalFetched = 0;
  let totalInserted = 0;

  sites.forEach(site => {

    try {

      writeLog("Processing : " + site.domain);

      const rows = fetchSiteData(site);

      totalFetched += rows.length;

      const inserted = saveRows(rows, existingKeys);

      totalInserted += inserted;

      writeLog(site.domain + " : " + inserted + " new rows");

    } catch(err) {

      writeLog(site.domain + " FAILED : " + err);

    }

  });

  writeLog("IMPORT COMPLETED");
  writeLog("Fetched : " + totalFetched);
  writeLog("Inserted : " + totalInserted);

}
function runAllReports() {

    const start = new Date();

    try {

        writeLog("======================================");
        writeLog("SEO DASHBOARD v3 PIPELINE START");
        writeLog("======================================");

        Repository.clearCache();

        writeLog("1/9 Search Console Import");
        runSEOImport();

        writeLog("2/9 Keyword Latest");
        generateKeywordLatest();

        writeLog("3/9 Weekly Summary");
        generateWeeklySummary();

        writeLog("4/9 Keyword Movement");
        generateKeywordMovement();

        writeLog("5/9 KPI");
        calculateKPIs();

        writeLog("6/9 Dashboard Data");
        generateDashboardData();

        writeLog("7/9 Analytics");
        generateAnalytics();

        writeLog("8/9 Opportunity Report");
        generateOpportunityReport();

        writeLog("9/9 Executive Dashboard");
        generateDashboard();

        const seconds = ((new Date()) - start) / 1000;

        writeLog("--------------------------------------");
        writeLog("PIPELINE COMPLETED SUCCESSFULLY");
        writeLog("Execution Time : " + seconds.toFixed(2) + " sec");
        writeLog("======================================");

    } catch (err) {

        writeLog("PIPELINE FAILED");
        writeLog(err.stack || err);

        throw err;

    }

}