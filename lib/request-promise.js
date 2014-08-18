var Q = require('q'),
  log = require('../lib/logger'),
  request = require('request'),
  _ = require('underscore');

module.exports = function requestPromise (base, url, options) {
  var deferred = Q.defer();
  options = options || {};

  if (base && url) {
    options = _.extend({
      url: base + url,
      json: options.json || false
    }, options);

    log.request('Making a request to:', options.url);

    request(options, function (err, res, body) {
      if (err) {
        return deferred.reject(err);
      } else if (res.statusCode !== 200) {
        log.error('Unexpected status code: ' + res.statusCode);
        err = new Error('Unexpected status code: ' + res.statusCode);
        err.res = res;
        return deferred.reject(err);
      }
      return deferred.resolve(body);
    });
  } else {
    deferred.reject(
      new Error('Please provide a base url and slug to query')
    );
  }

  return deferred.promise;
};
