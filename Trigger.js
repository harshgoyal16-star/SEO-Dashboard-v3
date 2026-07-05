/***************************************************
 * CREATE DAILY TRIGGER
 ***************************************************/

function createDailyTrigger() {

  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });

  ScriptApp.newTrigger("runAllReports")
    .timeBased()
    .everyDays(1)
    .atHour(CONFIG.IMPORT_HOUR)
    .create();

  writeLog("Daily Trigger Created");

}