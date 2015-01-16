var _ = require('underscore'),
  Module = require('performanceplatform-client.js').Module,
  Delta = require('performanceplatform-client.js').Delta,
  Table = require('performanceplatform-client.js').Table;

function processTimeSeries (timeSeriesData) {
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

function processGroupedTimeSeries (moduleData) {
  var textUpdate = [],
    formattedModule = new Table(moduleData),
    data = formattedModule.data.reverse(),
    titleSeries = data.pop(),
    totalSeries = data[0],
    latestIdx = titleSeries.length - 1,
    previousIdx = latestIdx - 1,
    isLatestDataMissing = false,
    isPreviousDataMissing = false,
    isAllLatestDataMissing = true,
    isAllPreviousDataMissing = true;

  _.each(data, function (series, idx) {
    var latestVal = series[latestIdx],
      previousVal = series[previousIdx],
      latestLine,
      previousLine;

    textUpdate.push(series[0]); // series title
    latestLine = titleSeries[latestIdx] + ' = ' + formatValue(latestVal, totalSeries[latestIdx],
      (idx > 0));
    previousLine = titleSeries[previousIdx] + ' = ' +
    formatValue(previousVal, totalSeries[previousIdx], (idx > 0));
    textUpdate.push(latestLine);
    textUpdate.push(previousLine);
    if (isDataPointPresent(latestVal) && (isDataPointPresent(previousVal))) {
      textUpdate.push('Total change = ' + getPercentageDelta(previousVal, latestVal));
    } else {
      if (isDataPointPresent(latestVal)) {
        isAllLatestDataMissing = false;
      } else {
        isLatestDataMissing = true;
      }
      if (isDataPointPresent(previousVal)) {
        isAllPreviousDataMissing = false;
      } else {
        isPreviousDataMissing = true;
      }
    }
    textUpdate.push('');
  });
  if (!isAllLatestDataMissing || !isAllPreviousDataMissing) {
    totalsHavePartialData(textUpdate, isLatestDataMissing, isPreviousDataMissing);
  }

  return textUpdate;
}

function totalsHavePartialData (textUpdate, isLatestDataMissing, isPreviousDataMissing) {
  var msg = ' (data is missing)';

  if (isLatestDataMissing) {
    textUpdate[1] += msg;
  }
  if (isPreviousDataMissing) {
    textUpdate[2] += msg;
  }
}

function isDataPointPresent (val) {
  return !_.contains([undefined, null], val);
}

function formatValue (val, total, addPercentage) {
  if (isDataPointPresent(val)) {
    if (addPercentage) {
      val += ' (' + getPercentageProportion(val, total) + ' of total)';
    }
    return val;
  } else {
    return 'no data';
  }
}

/*
 * Calculate the percentage increase / decrease from previous to latest (to 1 decimal place)
 * eg getPercentageDelta(100, 80) = -20%
 * getPercentageDelta(100, 150) = 50%
 */
function getPercentageDelta (previous, latest) {
  var diff = latest - previous;
  return getPercentageProportion(diff, previous);
}

/*
 * Calculate the relative proportion of one number to another, as a percentage
 * eg. getPercentageProportion(5, 20) = 25%;
 */
function getPercentageProportion (smaller, larger) {
  return ((smaller / larger) * 100).toFixed(1) + '%';
}

function getTextUpdate (moduleData) {
  var formattedModule;
  if (moduleData.moduleConfig['module-type'] === 'grouped_timeseries') {
    return processGroupedTimeSeries(moduleData);
  } else {
    formattedModule = new Delta(moduleData);
    return processTimeSeries(formattedModule.data);
  }
}

module.exports = function (modules) {
  var supported = _.without(Module.prototype.supported, 'realtime');
  return _.filter(modules, function (module) {
    if (_.contains(supported, module.moduleConfig['module-type'])) {
      module.textUpdate = getTextUpdate(module);
      return true;
    }
  });
};
