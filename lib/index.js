var email = new (require('./emailer'))(),
  backdrop = new (require('./integrations/backdrop'))(),
  stagecraft = new (require('./integrations/stagecraft'))(),
  message = new (require('./message'))(),
  Q = require('q'),
  queue = [];

// Query backdrop for out of date datasets
backdrop.getDataSets().then(function (data) {
  // console.log('datasets', data);
  // Got some datasets, now find emails for them
  data.data_sets.forEach( function (dataSet) {
    console.log('this dataSet', dataSet);
    // Set email message
    // dataSet.message = message.dataSetReminder(dataSet);

    // Queue up email query for this dataset
    queue.push(stagecraft.queryEmail(dataSet));
  });

  // When all the email queries are finished, send some notifications
  return Q.all(queue).then( function (dataSets) {
    console.log(dataSets);
    // email.send({
    //   to: config.notificationsEmail,
    //   subject: 'Datasets out of date',
    //   text: 'There are ' + data.message + '\n\n' + JSON.stringify(data.data_sets)
    // });
  });
}).fail(function (err) {
  throw err;
});




