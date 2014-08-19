var _ = require('underscore'),
  request = require('../lib/request-promise');


function Querist(options) {

  var defaults = {
    baseUrl : null
  };

  this.config = _.extend({}, defaults, options);

}

Querist.prototype.get = function (url, options) {
  options = _.extend({
    json: true
  }, options);

  if (this.config.baseUrl) {
    url = [this.config.baseUrl, url].join('');
  }

  return request(url, options);

};

module.exports = Querist;
