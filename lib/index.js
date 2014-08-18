var email = new (require('./emailer'))(),
    Query = require('./querist'),
    config = require('../config'),
    moment = require('moment'),
    _ = require('underscore'),
    Q = require('q'),
    log = require('./logger');

var backdrop = new Query(),
    stagecraft = new Query({
      baseUrl: config.stagecraft.baseUrl
    }),
    sets = {};

log.info('Querying backdrop for _status/data-sets/');
backdrop.get('_status/data-sets/').then(function (body) {
  var promiseQ = [],
      options = {
        auth: {
          bearer: config.stagecraft.bearer
        }
      };

  if (body && body.data_sets) {
    _.each(body.data_sets, function (dataSet) {
      sets[dataSet.name] = dataSet;

      // set the data set message (move to a module)
      sets[dataSet.name].message = 'The data set ' + dataSet.name + ' was last updated on ' +
        moment(dataSet['last-updated']).format('Do MMM YY') + ' and is ' +
        moment().diff(dataSet['last-updated'], 'days') +
        ' days out of date. Please upload the data at your earliest convenience.';

      log.info('Querying stagecraft for ' + 'data-sets/' + dataSet.name + '/users');
      promiseQ.push(stagecraft.get('data-sets/' + dataSet.name + '/users', options)
        .then(function (emails) {
          if (emails.length) {
            sets[dataSet.name].emails = emails;
          }
        }).fail(function (err) {
          throw err;
        }));
    });
  }
  return Q.all(promiseQ);
}).then(function () {
  _.each(sets, function (dataSet) {
    if (dataSet.emails) {
      email.send({
        // to: dataSet.emails.toString(),
        to: config.notificationsEmail,
        subject: 'NOTIFICATION: ' + dataSet.name + ' is out of date',
        text: dataSet.message
      });
    }
  });
}).fail(function (err) {
  throw err;
});
