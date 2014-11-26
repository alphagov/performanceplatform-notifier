var _ = require('underscore');

/*
 * Approx timings for how often we should notify
 * 360 (~5mins)       : every 58mins
 * 4500 (~hourly)     : every 58mins
 * 90000 (~day)       : every 58mins
 * 648000 (~week)     : every day
 * 2764800 (~month)   : every other day
 * 8467200 (~quarter) : every week
 */
var frequencyMap = {
  360: 3480,
  4500: 3480,
  90000: 3480,
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
