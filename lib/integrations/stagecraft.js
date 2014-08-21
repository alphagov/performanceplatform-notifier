var _ = require('underscore'),
  log = require('../logger'),
  Query = require('../querist'),
  message = require('../message'),
  appConfig = require('../../config');


function Stagecraft(options) {

  var defaults = {
    baseUrl : 'https://stagecraft.production.performance.service.gov.uk/',
    auth: {
      bearer: appConfig.stagecraft.bearer
    }
  };

  this.config = _.extend({}, defaults, options);

}

Stagecraft.prototype.queryEmail = function (dataSet) {

  var client = new Query({
    baseUrl: this.config.baseUrl
  });

  return client.get('data-sets/' + dataSet.name + '/users', this.config)
    .then( function (data) {
      if (data.length) {
        dataSet.emails = data;
      } else {
        log.warn('No emails found for ' + dataSet.name);
        dataSet['emails'] = appConfig.notificationsEmail;
      }
      return dataSet;
    });

};



module.exports = Stagecraft;

// var promiseQ = [],


//   if (body && body.data_sets) {
//     _.each(body.data_sets, function (dataSet) {
//       sets[dataSet.name] = dataSet;

//       // set the data set message (move to a module)
//       sets[dataSet.name].message = message.datasetReminder(dataSet);
//       log.info('Querying stagecraft for ' + 'data-sets/' + dataSet.name + '/users');
//       promiseQ.push(stagecraft.get('data-sets/' + dataSet.name + '/users', options)
//         .then(function (emails) {
//           if (emails.length) {
//             sets[dataSet.name].emails = emails;
//           }
//         }).fail(function (err) {
//           throw err;
//         }));
//     });
//   }
//   return Q.all(promiseQ);
// }).then(function () {
//   _.each(sets, function (dataSet) {
//     if (dataSet.emails) {
//       email.send({
//         // to: dataSet.emails.toString(),
//         to: config.notificationsEmail,
//         subject: 'NOTIFICATION: ' + dataSet.name + ' is out of date',
//         text: dataSet.message
//       });
//     }
//   });
// }).fail(function (err) {
//   throw err;
// }
