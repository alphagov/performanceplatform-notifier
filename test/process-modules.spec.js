describe('Process summary modules', function () {
  var _ = require('underscore'),
    processModules = require('../lib/process-modules.js'),
    modules = [];
  modules.push(require('../node_modules/performanceplatform-client.js' +
  '/test/fixtures/module-config-kpi.json'));
  modules.push(require('../node_modules/performanceplatform-client.js' +
  '/test/fixtures/module-config-single-time-series.json'));
  modules.push(require('../node_modules/performanceplatform-client.js' +
  '/test/fixtures/module-config-user-satisfaction-graph.json'));
  modules.push(require('../node_modules/performanceplatform-client.js' +
  '/test/fixtures/module-config-grouped-time-series.json'));

  describe('Complete data', function () {

    beforeEach(function () {
      this.modules = JSON.parse(JSON.stringify(modules));
      this.processed = processModules(this.modules);
    });

    it('returns an array of modules', function () {
      this.processed.length.should.equal(4);
    });

    it('should return modules with title property', function () {
      var module = this.processed[0];
      module.moduleConfig.title.should.equal('Transactions per year');
    });

    it('should return a textUpdate for a KPI module', function () {
      var module = this.processed[0];
      module.textUpdate.should.eql([
        '1 July 2013 to 30 June 2014 = 45.8m',
        '1 April 2013 to 31 March 2014 = 46m',
        'Total change = −0.27%'
      ]);
    });

    it('should return a textUpdate for a single time series module', function () {
      var module = this.processed[1];
      module.textUpdate.should.eql([
        '1 November 2014 to 30 November 2014 = 82.9%',
        '1 October 2014 to 31 October 2014 = 74.3%',
        'Total change = +11.57%'
      ]);
    });

    it('should return a textUpdate for a user satisfaction module', function () {
      var module = this.processed[2];
      module.textUpdate.should.eql([
        '12 January 2015 to 18 January 2015 = 85.8%',
        '5 January 2015 to 11 January 2015 = 86.2%',
        'Total change = −0.46%'
      ]);
    });

    it('should return a textUpdate for a grouped time series module', function () {
      var module = this.processed[3];
      module.textUpdate.should.eql([

        'Totals',
        'December 2014 = 3705269',
        'November 2014 = 3158941',
        'Total change = 17.3%',
        '',
        'DVLA centre',
        'December 2014 = 13033 (0.4% of total)',
        'November 2014 = 13720 (0.4% of total)',
        'Total change = -5.0%',
        '',
        'Post Office',
        'December 2014 = 1062692 (28.7% of total)',
        'November 2014 = 988061 (31.3% of total)',
        'Total change = 7.6%',
        '',
        'Digital and automated phone',
        'December 2014 = 2629544 (71.0% of total)',
        'November 2014 = 2157160 (68.3% of total)',
        'Total change = 21.9%',
        ''
      ]);
    });

  });

  describe('Incomplete data', function () {

    beforeEach(function () {
      _.each(_.last(modules[3].dataSource.data, 2), function (item) {
        item['volume:sum'] = null;
      });
      this.modules = JSON.parse(JSON.stringify(modules));
      this.processed = processModules(this.modules);
    });

    it('should not show percentages for a data point when its missing for grouped time series',
      function () {
        var module = this.processed[3];
        module.textUpdate.should.eql([

          'Totals',
          'December 2014 = 13033 (data is missing)',
          'November 2014 = 3158941',
          'Total change = -99.6%',
          '',
          'DVLA centre',
          'December 2014 = 13033 (100.0% of total)',
          'November 2014 = 13720 (0.4% of total)',
          'Total change = -5.0%',
          '',
          'Post Office',
          'December 2014 = no data',
          'November 2014 = 988061 (31.3% of total)',
          '',
          'Digital and automated phone',
          'December 2014 = no data',
          'November 2014 = 2157160 (68.3% of total)',
          ''
        ]);
      });
  });

  describe('All data missing', function () {

    beforeEach(function () {
      _.each(_.last(modules[3].dataSource.data, 6), function (item) {
        item['volume:sum'] = null;
      });
      this.modules = JSON.parse(JSON.stringify(modules));
      this.processed = processModules(this.modules);
    });

    it('should not show the totals "data is missing" message when all data is missing' +
      'for grouped time series',
      function () {
        var module = this.processed[3];
        module.textUpdate.should.eql([

          'Totals',
          'December 2014 = no data',
          'November 2014 = no data',
          '',
          'DVLA centre',
          'December 2014 = no data',
          'November 2014 = no data',
          '',
          'Post Office',
          'December 2014 = no data',
          'November 2014 = no data',
          '',
          'Digital and automated phone',
          'December 2014 = no data',
          'November 2014 = no data',
          ''
        ]);
      });
  });
});
