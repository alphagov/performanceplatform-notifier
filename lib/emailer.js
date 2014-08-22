var log = require('../lib/logger'),
    nodemailer = require('nodemailer'),
    config = require('../config');

var transport = config.safeMode ?
  require('nodemailer-stub-transport') : require('nodemailer-ses-transport');

function Emailer() {
  this.transporter = nodemailer.createTransport(transport({
    accessKeyId: config.amazonAWS.accessKeyId,
    secretAccessKey: config.amazonAWS.secretAccessKey
  }));
}

Emailer.prototype.send = function (emailConfig) {
  log.email('Emailing: ', emailConfig.to, 'Subject: ', emailConfig.subject);
  var callback = config.safeMode ?
    function (err, info) {
      if (!err) {
        log.info('email sent', info.response.toString());
      }
    } : function () {};

  this.transporter.sendMail({
    from: config.notificationsEmail,
    to: emailConfig.to,
    subject: emailConfig.subject,
    text: emailConfig.text
  }, callback);
};

module.exports = Emailer;
