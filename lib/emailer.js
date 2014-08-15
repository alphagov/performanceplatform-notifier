var logger = require('../lib/logger'),
    nodemailer = require('nodemailer'),
    ses = require('nodemailer-ses-transport'),
    config = require('../config');

function Emailer() {
  this.transporter = nodemailer.createTransport(ses({
    accessKeyId: config.amazonAWS.accessKeyId,
    secretAccessKey: config.amazonAWS.secretAccessKey
  }));
}

Emailer.prototype.send = function (emailConfig) {
  logger.info('sending email to',
    emailConfig.to, 'with', emailConfig.subject, 'and body', emailConfig.text);

  this.transporter.sendMail({
    from: config.notificationsEmail,
    to: emailConfig.to,
    subject: emailConfig.subject,
    text: emailConfig.text
  });
};

module.exports = Emailer;
