var log = require('./logger'),
    summaryConfig = require('../summaries.json');

log.info('Sending weekly summary email');

for (var i = 0; i < summaryConfig.length; i++) {
  var dashboardSlug = summaryConfig[i].dashboard;
  log.info('Creating summary email for ' + dashboardSlug + ' dashboard');
  for (var j = 0; j < summaryConfig[i].recipients.length; j++) {
    var recipient = summaryConfig[i].recipients[j];
    log.info('Sending email to ' + recipient + ' for ' + dashboardSlug + ' dashboard');
  }
}
