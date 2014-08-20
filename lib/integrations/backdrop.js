var _ = require('underscore'),
  log = require('../logger'),
  Query = require('../querist');


function Backdrop(options) {

  var defaults = {
    baseUrl : 'https://www.performance.service.gov.uk'
  };

  this.config = _.extend({}, defaults, options);

}

Backdrop.prototype.getDataSets = function (base) {

  // Default to production
  base = base || this.config.baseUrl;

  var client = new Query({
    baseUrl: base
  });

  log.info('Querying backdrop for _status/data-sets/');
  return client.get(
    '/_status/data-sets/'
  );

};


module.exports = Backdrop;
