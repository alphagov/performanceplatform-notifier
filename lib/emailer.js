function Emailer(options) {
  this.options = options || {};
}

Emailer.prototype.sendEmail = function() {
  return this.options.message;
};

module.exports = Emailer;
