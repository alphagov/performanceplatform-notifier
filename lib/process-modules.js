var _ = require('underscore'),
  Module = require('performanceplatform-client.js').Module,
  Delta = require('performanceplatform-client.js').Delta;

function processTimeSeries(timeSeriesData) {
  var latestDatum = timeSeriesData[0],
    secondLatestDatum = timeSeriesData[1],
    textUpdate = [];

  textUpdate.push([
    latestDatum.formatted_start_at + ' to ' + latestDatum.formatted_end_at,
    latestDatum.formatted_value
  ].join(' = '));
  textUpdate.push([
    secondLatestDatum.formatted_start_at + ' to ' + secondLatestDatum.formatted_end_at,
    secondLatestDatum.formatted_value
  ].join(' = '));

  if (latestDatum.formatted_change_from_previous &&
    latestDatum.formatted_change_from_previous.change) {
    textUpdate.push([
      'Total change = ',
      latestDatum.formatted_change_from_previous.change
    ].join(''));
  }
  return textUpdate;
}

function getTextUpdate(moduleData) {
  var formattedModule = new Delta(moduleData);
  return processTimeSeries(formattedModule.data);
}

module.exports = function (modules) {
  var supported = _.without(Module.prototype.supported, 'grouped_timeseries', 'realtime');
  return _.filter(modules, function (module) {
    if (_.contains(supported, module.moduleConfig['module-type'])) {
      module.textUpdate = getTextUpdate(module);
      return true;
    }
  });

};
