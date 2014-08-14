var Q = require('q'),
  log = require('../lib/logger'),
  request = require('request');

module.exports = function requestPromise (base, url, json) {
  json = (json) ? true : false;
  var deferred = Q.defer();

  if (base && url) {
    request({
      url: base + url,
      json: json
    }, function (err, res, body) {
      if (err) {
        return deferred.reject(err);
      } else if (res.statusCode !== 200) {
        log.info('Unexpected status code: ' + res.statusCode);
        err = new Error('Unexpected status code: ' + res.statusCode);
        err.res = res;
        return deferred.reject(err);
      }
      deferred.resolve(body);
    });
  } else {
    deferred.reject(
      new Error('Please provide a base url and slug to query')
    );
  }

  return deferred.promise;
};
