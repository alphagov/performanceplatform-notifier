var Dashboard = require('performanceplatform-client.js'),
    email = new (require('./emailer'))(require('../blacklist')),
    log = require('./logger'),
    message = new (require('./message'))(),
    Q = require('q'),
    summaryConfig = require('../summaries.json');

function handleError (err) {
  if (err) {
    log.error(err);
  }
}

function sendDashboardEmail (config) {
  var dashboard = new Dashboard();

  return dashboard.getConfig(config.dashboard).
    then(function (dashboardConfig) {
      var emailSubject = message.dashboardSummary(dashboardConfig).subject,
          emailText = message.dashboardSummary(dashboardConfig).text;

      for (var j = 0; j < config.recipients.length; j++) {
        var recipient = config.recipients[j];
        email.send({
          'to': [recipient],
          'subject': emailSubject,
          'text': emailText
        }, handleError);
      }

    }, handleError);
}

module.exports = function () {
  var promises = [];

  for (var i = 0; i < summaryConfig.length; i++) {
    var dashboardSummaryConfig = summaryConfig[i];
    promises.push(sendDashboardEmail(dashboardSummaryConfig));
  }

  return Q.all(promises);
};
