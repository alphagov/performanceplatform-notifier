var email = new (require('./emailer'))(),
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
              return stagecraft.queryEmail(set)
                .then(function (/* emails */) {
                  return Q.ninvoke(email, 'send', {
                    // to: emails.toString(),
                    to:appConfig.emailTestList,
                    subject: message.generateTitle(set),
                    text: message.dataSetReminder(set)
                  });
                });
            } else {
              log.warn('Skipping data set', set);
              return Q.reject();
            }
          })
          .then(function () {
            //write to backdrop that dataset has been emailed
            return backdrop.emailSent(set.name);
          })
          .fail(function () {});
      });
    }, new Q());
  })
  .then(function () {
    log.info('ALL DONE!');
  })
  .done();
