var _ = require('underscore');

/*
 * Approx timings for how often we should notify
 * 360 (~5mins)      : every min
 * 4500 (~hourly)    : every hour
 * 90000 (~day)      : every hour
 * 648000 (~week)    : every day
 * 2764800 (~month)  : every other day
 * 8467200 (~quater) : every week
 */
var frequencyMap = {
  360: 60,
  4500: 3600,
  90000: 3600,
  648000: 86400,
  2764800: 172800,
  8467200: 604800
};

module.exports = function (maxAge) {
  var sortedAge = _.map(frequencyMap, function (val, key) {
    return [key, Math.abs(key - maxAge)];
  });

  var reduce = _.reduce(sortedAge, function (memo, val) {
    return (memo[1] < val[1]) ? memo : val;
  })[0];

  return frequencyMap[reduce];
};
