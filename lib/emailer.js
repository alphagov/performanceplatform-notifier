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

Emailer.prototype.sendEmail = function (to, subject, body) {
  logger.info('sending email to', to, 'with', subject, 'and body', body);

  this.transporter.sendMail({
    from: config.notificationsEmail,
    to: to,
    subject: subject,
    text: body
  });
};

module.exports = Emailer;
