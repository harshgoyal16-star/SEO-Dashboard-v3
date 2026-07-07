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
function runPipeline1() {

    writeLog("===== PIPELINE 1 START =====");

    runSEOImport();

    generateKeywordLatest();

    generateWeeklySummary();

    generateKeywordMovement();

    writeLog("===== PIPELINE 1 END =====");

}
function runPipeline2() {

    writeLog("===== PIPELINE 2 START =====");

    calculateKPIs();

    generateDashboardData();

    generateAnalytics();

    generateDashboard();

    writeLog("===== PIPELINE 2 END =====");

}