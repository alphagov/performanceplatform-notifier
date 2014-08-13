var _ = require('underscore'),
  request = require('request'),
  logger = require('../lib/logger');

function Querist(options) {

  var defaults = {
    'baseUrl' : 'https://www.performance.service.gov.uk/'
  };

  this.config = _.extend({}, defaults, options);

}

Querist.prototype.get = function (slug, callback) {
  logger.info('getting', this.config.baseUrl + slug, 'with callback', callback);

  var requestPath = this.config.baseUrl + slug,
      _request = request.get(requestPath);

  _request.on('response', function (data) {
    return data;
  });


};

module.exports = Querist;
