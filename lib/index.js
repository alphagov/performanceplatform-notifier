var email = new (require('./emailer'))();
var Query = require('./querist');
var config = require('../config');

var query = new Query();

query.get('_status/data-sets/', 'json').then(function (body) {
  email.send({
    to: config.notificationsEmail,
    subject: 'Datasets out of date',
    text: 'There are ' + body.message + '\n\n' + JSON.stringify(body.data_sets)
  });
});
