var _ = require('underscore'),
  moment = require('moment');

function messages(options) {
  var defaults = {
    dateFormat : 'Do MMM YY'
  };

  this.config = _.extend({}, defaults, options);
}

messages.prototype.datasetReminder = function (dataSet, options) {

  this.config = _.extend({}, this.config, options);

  this.lastUpdated = function (dataSet) {
    return [
      'The data set ',
      dataSet.name,
      ' was last updated on ',
      moment(dataSet['last-updated']).format(this.config.dateFormat)
    ].join('');
  };

  this.daysOutOfDate = function (dataSet) {
    return moment().diff(dataSet['last-updated'], 'days');
  };

  var message = [
    this.lastUpdated(dataSet),
    ' and is ',
    this.daysOutOfDate(dataSet),
    ' days out of date. ',
    'Please upload the data at your earliest convenience.'
  ].join('');

  return message;

};

module.exports = messages;
