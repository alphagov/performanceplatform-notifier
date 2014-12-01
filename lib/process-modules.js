var _ = require('underscore'),
  supportedModuleTypes = ['kpi', 'single_timeseries'];

function getTextUpdate(module) {
  var data = module.data,
    latestDatum = data[0],
    secondLatestDatum = data[1],
    textUpdate = [];

  textUpdate.push([latestDatum.formatted_date_range, latestDatum.formatted_value].join(' = '));
  textUpdate.push([
    secondLatestDatum.formatted_date_range,
    secondLatestDatum.formatted_value
  ].join(' = '));
  textUpdate.push([
    'Total change = ',
    latestDatum.formatted_change_from_previous
  ].join(''));
  return textUpdate;
}

module.exports = function (modules) {

  return _.filter(modules, function (module) {
    if (_.contains(supportedModuleTypes, module['module-type'])) {
      module.textUpdate = getTextUpdate(module);
      return true;
    }
  });

};
