var _ = require('underscore'),
  log = require('../logger'),
  Query = require('../querist'),
  appConfig = require('../../config');


function Stagecraft(options) {

  var defaults = {
    baseUrl : appConfig.stagecraft.baseUrl,
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
      var emails;
      if (data.length) {
        emails = _.pluck(data, 'email');
        log.info('Found', emails, 'for', dataSet.name);
      } else {
        log.warn('No emails found for ' + dataSet.name);
        emails = appConfig.notificationsEmail;
      }
      return emails;
    });

};



module.exports = Stagecraft;
