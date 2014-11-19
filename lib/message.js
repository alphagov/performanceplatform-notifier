var _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  Mustache = require('mustache'),
  moment = require('moment'),
  appConfig = require('../config');

function Messages(options) {
  var defaults = {
    dateFormat : 'DD MMMM YYYY'
  };

  this.config = _.extend({}, defaults, options);
  this.templates = {
    reminder: fs.readFileSync(
      path.resolve(__dirname, './templates/reminder.mus')
    ).toString('utf8'),
    reminderSubject: 'NOTIFICATION: "{{dataSet.name}}" is OUT OF DATE.'
  };
}

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
