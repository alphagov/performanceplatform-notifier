var log = require('../lib/logger'),
    nodemailer = require('nodemailer'),
    config = require('../config'),
    _ = require('underscore');

var transport = config.safeMode ?
  require('nodemailer-stub-transport') : require('nodemailer-ses-transport');

function Emailer(blacklist) {
  this.setBlacklist(blacklist);

  this.transporter = nodemailer.createTransport(transport({
    accessKeyId: config.amazonAWS.accessKeyId,
    secretAccessKey: config.amazonAWS.secretAccessKey
  }));
}

Emailer.prototype.setBlacklist = function (blacklist) {
  blacklist = blacklist || [];
  this._blacklist = blacklist.map(function (email) {
    return email.toLowerCase();
  });
};

Emailer.prototype.send = function (emailConfig, callback) {
  var emails = _.filter(emailConfig.to, _.bind(function (email) {
    if (this._blacklist.indexOf(email.toLowerCase()) === -1) {
      return true;
    } else {
      log.info('Email not sent for, ' + email + ', is in the blacklist.');
    }
  }, this));

  log.email('Emailing: ', emails, 'Subject: ', emailConfig.subject);

  if (emails.length > 0) {
    this.transporter.sendMail({
      from: config.notificationsEmail,
      to: emails.toString(),
      subject: emailConfig.subject,
      text: emailConfig.text
    }, callback);
  }
};

module.exports = Emailer;
