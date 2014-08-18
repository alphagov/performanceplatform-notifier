var _ = require('underscore'),
  request = require('../lib/request-promise');


function Querist(options) {

  var defaults = {
    baseUrl : 'https://www.performance.service.gov.uk/'
  };

  this.config = _.extend({}, defaults, options);

}

Querist.prototype.get = function (slug, options) {
  options = _.extend({
    json: true
  }, options);

  return request(
    this.config.baseUrl, slug, options
  );

};

module.exports = Querist;
