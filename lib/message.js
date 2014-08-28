var _ = require('underscore'),
  moment = require('moment'),
  appConfig = require('../config');

function Messages(options) {

  var defaults = {
    dateFormat : 'DD MMMM YYYY'
  };

  this.config = _.extend({}, defaults, options);
}



Messages.prototype.dataSetReminder = function (dataSet, options) {
  var config = _.extend({}, this.config, options),
      lastUpdated = moment(dataSet['last-updated']).utc().format(config.dateFormat),
      outOfDate = moment(dataSet['last-updated']).utc().add(dataSet['max-age-expected'], 's')
        .fromNow(true);

  this.lastUpdated = function () {
    return [
      'The data set ',
      dataSet.name,
      ' was last updated on ',
      lastUpdated
    ].join('');
  };

  var message = [
    '\n',
    '===========================================================',
    '\n',
    this.generateTitle(dataSet),
    '\n',
    '===========================================================',
    '\n\n',
    this.lastUpdated(),
    ' and is now ',
    outOfDate,
    ' out of date.',
    '\n\n',
    'Data set: ',
    dataSet.name,
    '\n',
    'Last updated: ',
    lastUpdated,
    '\n',
    'Period out of date: ',
    outOfDate,
    '\n',
    '\n',
    '===========================================================',
    '\n',
    'PLEASE UPLOAD THE DATA AT YOUR EARLIEST CONVENIENCE',
    '\n',
    '===========================================================',
    '\n',
    '\n',
    'Login to upload the data at: ',
    appConfig.adminAppUrl,
    '\n',
    '\n',
    '===========================================================',
    '\n\n',
    'This is a notification email from the Performance Platform.',
    '\n\n',
    'You have received this email because you requested this notification to be sent to you.',
    '\n\n',
    'You can unsubscribe from alerts by sending an email to: ',
    appConfig.notificationsEmail
  ].join('');

  return message;
};

Messages.prototype.generateTitle = function (dataSet) {
  return 'NOTIFICATION: "' + dataSet.name + '" is OUT OF DATE.';
};

module.exports = Messages;
