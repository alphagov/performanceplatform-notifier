var log = require('../lib/logger'),
    nodemailer = require('nodemailer'),
    config = require('../config');

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
  log.email('Emailing: ', emailConfig.to, 'Subject: ', emailConfig.subject);

  if (this._blacklist.indexOf(emailConfig.to.toLowerCase()) >= 0) {
    log.info('Email not sent, ' + emailConfig.to + ', is in blacklist.');
  } else {
    this.transporter.sendMail({
      from: config.notificationsEmail,
      to: emailConfig.to,
      subject: emailConfig.subject,
      text: emailConfig.text
    }, callback);
  }
};

module.exports = Emailer;
