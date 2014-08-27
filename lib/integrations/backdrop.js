var _ = require('underscore'),
  log = require('../logger'),
  Query = require('../querist'),
  appConfig = require('../../config'),
  moment = require('moment');


function Backdrop(options) {

  var defaults = {
    baseUrl : appConfig.backdrop.baseUrl,
    auth: {
      bearer: appConfig.backdrop.bearer
    }
  };

  this.config = _.extend({}, defaults, options);

}

Backdrop.prototype.getDataSets = function () {

  var client = new Query({
    baseUrl: this.config.baseUrl
  });

  log.info('Querying backdrop for _status/data-sets/');

  return client.get(
    '_status/data-sets/'
  );
};

Backdrop.prototype.emailSent = function (dataSet) {
  var client = new Query({
    baseUrl: this.config.baseUrl
  }),
  timestamp = new moment().utc().format();

  log.info('Posting data too data/performance-platform/notifier with the dataSet: ' + dataSet);

  return client.post('data/performance-platform/notifier',
    _.extend({ json: {data_set: dataSet, _timestamp: timestamp} }, this.config));
};

Backdrop.prototype.lastEmailSent = function (dataSet) {
  var client = new Query({
    baseUrl: this.config.baseUrl
  });

  log.info('Querying backdrop for _status/data-sets/');

  return client.get(
    'data/performance-platform/notifier', {
      qs: {
        sort_by: '_timestamp:descending',
        limit: 1,
        filter_by: 'data_set:' + dataSet
      }
    }
  );
};

module.exports = Backdrop;
