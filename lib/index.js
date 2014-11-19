var email = new (require('./emailer'))(require('../blacklist')),
  backdrop = new (require('./integrations/backdrop'))(),
  stagecraft = new (require('./integrations/stagecraft'))(),
  message = new (require('./message'))(),
  log = require('./logger'),
  Q = require('q'),
  appConfig = require('../config');

// Query backdrop for out of date datasets
backdrop.getDataSets()
  .then(function (sets) {
    return sets.reduce(function (promise, set) {

      return promise.then(function () {

        // check if dataSet needs an email sending
        return backdrop.needsEmail(set)
          .then(function (needsEmail) {
            if (needsEmail) {
              //send email
              return Q.allSettled([
                stagecraft.queryEmail(set),
                stagecraft.dashboardsForDataSet(set)
              ]).then(function (results) {
                var emails = results[0].value,
                    dashboards = results[1].value,
                    text = message.dataSetReminder(set, dashboards);

                set.recipientCount = emails.length;

                return Q.ninvoke(email, 'send', {
                  // to: emails.toString(),
                  to:appConfig.emailTestList,
                  subject: message.dataSetReminderSubject(set),
                  text: text
                });
              });
            } else {
              log.warn('Skipping data set', set);
              return Q.reject();
            }
          })
          .then(function () {
            //write to backdrop that dataset has been emailed
            return backdrop.emailSent(set);
          })
          .fail(function () {});
      });
    }, new Q());
  })
  .then(function () {
    log.info('ALL DONE!');
  })
  .done();
