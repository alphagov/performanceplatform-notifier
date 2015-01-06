var _ = require('underscore'),
  supportedModuleTypes = ['kpi', 'single_timeseries', 'user_satisfaction_graph'];

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

function getTextUpdate(module) {
  var textUpdate = [],
    timeSeriesUpdate;
  if (module['module-type'] === 'grouped_timeseries') {
    _.each(module.data, function (timeSeries) {
      textUpdate.push(timeSeries.label);
      timeSeriesUpdate = processTimeSeries(timeSeries.values);
      textUpdate = textUpdate.concat(timeSeriesUpdate);
    });
    return textUpdate;
  } else {
    return processTimeSeries(module.data);
  }
}

module.exports = function (modules) {

  return _.filter(modules, function (module) {
    if (_.contains(supportedModuleTypes, module['module-type'])) {
      module.textUpdate = getTextUpdate(module);
      return true;
    }
  });

};
