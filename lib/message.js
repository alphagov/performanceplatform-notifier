var _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  Mustache = require('mustache'),
  moment = require('moment'),
  appConfig = require('../config');

function readTemplateSync (templateName) {
  return fs.readFileSync(
    path.resolve(__dirname, './templates/' + templateName)
  ).toString('utf8');
}

function Messages(options) {
  var defaults = {
    dateFormat : 'DD MMMM YYYY'
  };

  this.config = _.extend({}, defaults, options);
  this.templates = {
    reminder: readTemplateSync('reminder.mus'),
    reminderSubject: 'NOTIFICATION: "{{dataSet.name}}" is OUT OF DATE.',

    summary: {
      subject: 'Data summary for \'{{{ dashboard.title }}}\' dashboard',
      text: readTemplateSync('summary.mus')
    }
  };
}

Messages.prototype.dashboardSummary = function (dashboard) {
  return {
    subject: Mustache.render(this.templates.summary.subject, {
      dashboard: dashboard
    }),
    text: Mustache.render(this.templates.summary.text, {
      dashboard: dashboard
    })
  };
};

Messages.prototype.dataSetReminder = function (dataSet, dashboards, options) {
  var config = _.extend({}, this.config, options),
      lastUpdatedRaw = moment(dataSet['last-updated']).utc();

  return Mustache.render(this.templates.reminder, {
    dataSet: dataSet,
    dashboards: dashboards,
    lastUpdated: lastUpdatedRaw.format(config.dateFormat),
    outOfDate: lastUpdatedRaw.add(dataSet['max-age-expected'], 's').fromNow(true),
    adminAppUrl: appConfig.adminAppUrl,
    notificationsEmail: appConfig.notificationsEmail
  });
};

Messages.prototype.dataSetReminderSubject = function (dataSet) {
  return Mustache.render(this.templates.reminderSubject, {
    dataSet: dataSet
  });
};

module.exports = Messages;
