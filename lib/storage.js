var log = require('../lib/logger'),
    _ = require('underscore'),
    config = require('../config');

var redis = process.env.NODE_ENV === 'test' ? require('fakeredis') : require('redis');

function Storage(options) {

  var defaults = {
    redis: {
      port: config.redis.port,
      host: config.redis.host,
      auth: config.redis.auth
    }
  };

  this.config = _.extend({}, defaults, options);

  log.storage('Starting redis client on port', config.redis.port, 'and host', config.redis.host);

  var client = redis.createClient();

  client.on('error', function (err) {
    log.error('Error', err);
  });

  return client;

}

module.exports = Storage;
