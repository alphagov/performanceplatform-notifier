var logger = require('../lib/logger');

function Emailer(options) {
  logger.info('creating a new instance of Emailer');
  this.options = options || {};
}

Emailer.prototype.sendEmail = function () {
  return this.options.message;
};

module.exports = Emailer;
