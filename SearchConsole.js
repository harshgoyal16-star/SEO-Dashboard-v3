/***************************************************
 * SEARCH CONSOLE
 ***************************************************/

function fetchSiteData(site) {

writeLog("Downloading : " + site.domain);
  const range = getDateRange();

  const property = encodeURIComponent(site.property);

  const url =
    "https://searchconsole.googleapis.com/webmasters/v3/sites/" +
    property +
    "/searchAnalytics/query";

  const payload = {
    startDate: range.startDate,
    endDate: range.endDate,
    dimensions: ["query", "date"],
    rowLimit: CONFIG.ROW_LIMIT
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {

    const response = UrlFetchApp.fetch(url, options);

const code = response.getResponseCode();

if (code !== 200) {
  writeLog(site.domain + " HTTP Error : " + code);
  return [];
}

const json = JSON.parse(response.getContentText());
writeLog("Date Range : " + range.startDate + " to " + range.endDate);

if (json.rows && json.rows.length > 0) {
  writeLog("First Date : " + json.rows[0].keys[1]);
  writeLog("Last Date : " + json.rows[json.rows.length - 1].keys[1]);
}
if (json.error) {

  writeLog(site.domain + " API Error : " + json.error.message);

  return [];

}

    if (!json.rows || json.rows.length === 0) {

      writeLog(site.domain + " : No Data");

      return [];

    }

    const output = json.rows.map(r => ({
  domain: site.domain,
  date: r.keys[1],
  week: getISOWeek(r.keys[1]),
  query: r.keys[0],
  clicks: r.clicks || 0,
  impressions: r.impressions || 0,
  ctr: r.ctr || 0,
  position: r.position || 0
}));

    writeLog(site.domain + " : " + output.length + " rows");

    return output;

  }
  catch (err) {

  writeLog(site.domain + " ERROR : " + (err.stack || err));

  return [];

}

}
function testProperties() {

  const sites = getActiveSites();

  sites.forEach(site => {

    const property = encodeURIComponent(site.property);

    const url =
      "https://searchconsole.googleapis.com/webmasters/v3/sites/" +
      property +
      "/searchAnalytics/query";

    const payload = {
      startDate: "2026-06-20",
      endDate: "2026-06-25",
      rowLimit: 1
    };

    const response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + ScriptApp.getOAuthToken()
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    Logger.log(site.property);
    Logger.log(response.getResponseCode());
    Logger.log(response.getContentText());

  });

}
function testFetch() {

  const sites = getActiveSites();

  const rows = fetchSiteData(sites[0]);

  Logger.log("Total Rows : " + rows.length);

}
function getSearchVolume(query) {

  // Read SearchVolume sheet

  // Find matching keyword

  // Return search volume

}