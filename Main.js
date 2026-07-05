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

  writeLog("*** SEO PIPELINE START ***");
  writeLog("SEO PIPELINE STARTED");

  try {

    writeLog("1. Search Console Import");
    runSEOImport();

    writeLog("2. Keyword Latest");
    generateKeywordLatest();

    writeLog("3. Weekly Summary");
    generateWeeklySummary();

    writeLog("4. Keyword Movement");
    generateKeywordMovement();

    writeLog("5. Dashboard Data");
    generateDashboardData();

    writeLog("6. Analytics");
    generateAnalytics();

    writeLog("7. DashboardV3");
generateDashboardV3();

    const seconds = ((new Date()) - start) / 1000;

    writeLog("SEO PIPELINE COMPLETED");
    writeLog("Execution Time : " + seconds.toFixed(2) + " sec");
    writeLog("*** SEO PIPELINE END ***");

  } catch(err) {

    writeLog("PIPELINE FAILED");
    writeLog(err.stack || err);

    throw err;

  }

}