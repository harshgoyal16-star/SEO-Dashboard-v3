/***************************************************
 * GOOGLE ADS CONFIG
 ***************************************************/

const ADS = {

  DEVELOPER_TOKEN: "pGoC5ECDNNpnY0eD2zrQmA",

    const CLIENT_ID = "YOUR_CLIENT_ID";
    const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
    const REFRESH_TOKEN = "YOUR_REFRESH_TOKEN";

  CUSTOMER_ID: "3690157950",

  LOGIN_CUSTOMER_ID: "3690157950",

  API_VERSION: "v21"

};


/***************************************************
 * GET ACCESS TOKEN
 ***************************************************/

function getGoogleAdsAccessToken() {

  const response = UrlFetchApp.fetch(
    "https://oauth2.googleapis.com/token",
    {
      method: "post",
      payload: {
        client_id: ADS.CLIENT_ID,
        client_secret: ADS.CLIENT_SECRET,
        refresh_token: ADS.REFRESH_TOKEN,
        grant_type: "refresh_token"
      }
    }
  );

  return JSON.parse(response.getContentText()).access_token;

}


/***************************************************
 * RUN GAQL QUERY
 ***************************************************/

function googleAdsQuery(query) {

  const token = getGoogleAdsAccessToken();

  const url =
    "https://googleads.googleapis.com/" +
    ADS.API_VERSION +
    "/customers/" +
    ADS.CUSTOMER_ID +
    "/googleAds:searchStream";

  const response = UrlFetchApp.fetch(url, {

    method: "post",

    contentType: "application/json",

    headers: {

      Authorization: "Bearer " + token,

      "developer-token": ADS.DEVELOPER_TOKEN,

      "login-customer-id": ADS.LOGIN_CUSTOMER_ID

    },

    payload: JSON.stringify({

      query: query

    }),

    muteHttpExceptions: true

  });

  Logger.log(response.getResponseCode());

  Logger.log(response.getContentText());

  return JSON.parse(response.getContentText());

}
function testGoogleAds() {

  const token = getGoogleAdsAccessToken();

  const url =
    "https://googleads.googleapis.com/v21/customers/" +
    ADS.CUSTOMER_ID +
    ":generateKeywordHistoricalMetrics";

  const payload = {

    keywords: [
      "school erp"
    ],

    geoTargetConstants: [
      "geoTargetConstants/2356"      // India
    ],

    language: "languageConstants/1000",

    keywordPlanNetwork: "GOOGLE_SEARCH"
  };

  const response = UrlFetchApp.fetch(url, {

    method: "post",

    contentType: "application/json",

    headers: {

      Authorization: "Bearer " + token,

      "developer-token": ADS.DEVELOPER_TOKEN,

      "login-customer-id": ADS.LOGIN_CUSTOMER_ID

    },

    payload: JSON.stringify(payload),

    muteHttpExceptions: true

  });

  Logger.log(response.getResponseCode());

  Logger.log(response.getContentText());

}