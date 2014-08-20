var email = new (require('./emailer'))(),
  backdrop = new (require('./integrations/backdrop'))(),
  config = require('../config');

backdrop.getDataSets().then(function (data) {
  email.send({
    to: config.notificationsEmail,
    subject: 'Datasets out of date',
    text: 'There are ' + data.message + '\n\n' + JSON.stringify(data.data_sets)
  });
});
