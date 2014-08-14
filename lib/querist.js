var _ = require('underscore'),
  request = require('../lib/request-promise');


function Querist(options) {

  var defaults = {
    'baseUrl' : 'https://www.performance.service.gov.uk/'
  };

  this.config = _.extend({}, defaults, options);

}

Querist.prototype.get = function (slug) {

  return request(
    this.config.baseUrl, slug, 'json'
  );

};

module.exports = Querist;
