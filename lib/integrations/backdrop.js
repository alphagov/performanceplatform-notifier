var _ = require('underscore'),
  log = require('../logger'),
  Query = require('../querist'),
  appConfig = require('../../config'),
  moment = require('moment'),
  frequency = require('../frequency');


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
  ).then(function (data) {
    if (data.data_sets.length) {
      return data.data_sets;
    } else {
      return false;
    }
  }, function (err) {
    throw err;
  });
};

Backdrop.prototype.emailSent = function (dataSet) {
  var client = new Query({
    baseUrl: this.config.baseUrl
  }),
  timestamp = new moment().utc().format();

  log.info('Posting data too data/performance-platform/notifier with the dataSet: ' + dataSet);

  return client.post('data/performance-platform/notifier',
    _.extend({
      json: {
        data_set: dataSet.name,
        _timestamp: timestamp,
        seconds_out_of_date: dataSet['seconds-out-of-date'],
        recipient_count: dataSet.recipientCount
      }
    }, this.config));
};

Backdrop.prototype.needsEmail = function (dataSet) {
  var client = new Query({
    baseUrl: this.config.baseUrl
  });

  log.info('Querying backdrop for data/performance-platform/notifier for dataSet: ', dataSet.name);

  return client.get(
    'data/performance-platform/notifier', {
      qs: {
        sort_by: '_timestamp:descending',
        limit: 1,
        filter_by: 'data_set:' + dataSet.name
      }
    }
  ).then(function (data) {
    if (data.data.length) {
      var backdropResponse = data.data[0];
      var limit = moment(backdropResponse._timestamp)
        .add(frequency(dataSet['max-age-expected']), 's');

      if (limit.isBefore(moment().utc())) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }, function (err) {
    throw err;
  });
};

module.exports = Backdrop;
