var Dashboard = require('performanceplatform-client.js').Dashboard,
    email = new (require('./emailer'))(require('../blacklist')),
    log = require('./logger'),
    message = new (require('./message'))(),
    Q = require('q'),
    summaryConfig = require('../summaries.json'),
    processModules = require('./process-modules');

function handleError (err) {
  if (err) {
    log.error(err);
  }
}

function sendDashboardEmail (config) {
  var dashboard = new Dashboard(config.dashboard);

  return dashboard.resolve().
    then(function (dashboardConfig) {

      // moduleUpdates is a subset of the modules on dashboardConfig which we
      // know how to render in an email.
      var moduleUpdates = processModules(dashboardConfig.modules);

      var emailSubject = message.dashboardSummary(dashboardConfig).subject,
          emailText = message.dashboardSummary(dashboardConfig, moduleUpdates).text;

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
