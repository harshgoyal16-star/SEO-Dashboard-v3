/***************************************************
 * KEYWORD REPOSITORY
 ***************************************************/

function getAllKeywords() {

  const sheet = getRankingSheet();

  const lastRow = sheet.getLastRow();

  if (lastRow <= 1)
    return [];

  return sheet
    .getRange(2, 1, lastRow - 1, 8)
    .getValues();

}


/***************************************************
 * LATEST DATE
 ***************************************************/

function getLatestRankingDate() {

  const data = getAllKeywords();

  if (data.length === 0)
    return "";

  let latest = "";

  data.forEach(r => {

    const d = Utilities.formatDate(
      new Date(r[1]),
      CONFIG.TIMEZONE,
      "yyyy-MM-dd"
    );

    if (d > latest)
      latest = d;

  });

  return latest;

}


/***************************************************
 * FILTER BY DATE
 ***************************************************/

function getKeywordsByDate(date) {

  return getAllKeywords().filter(r => {

    const d = Utilities.formatDate(
      new Date(r[1]),
      CONFIG.TIMEZONE,
      "yyyy-MM-dd"
    );

    return d === date;

  });

}


/***************************************************
 * FILTER BY DOMAIN
 ***************************************************/

function getKeywordsByDomain(domain) {

  return getAllKeywords().filter(r => r[0] == domain);

}


/***************************************************
 * FILTER BY WEEK
 ***************************************************/

function getKeywordsByWeek(week) {

  return getAllKeywords().filter(r => r[2] == week);

}