describe('Process summary modules', function () {
  var processModules = require('../lib/process-modules.js');

  beforeEach(function () {
    this.dashboardConfig = require('../node_modules/performanceplatform-client.js' +
    '/test/fixtures/dashboard-response.json');
    this.dashboardConfig.modules = [];
    this.dashboardConfig.modules.push(require('../node_modules/performanceplatform-client.js' +
    '/test/fixtures/module-config-kpi.json'));
    this.dashboardConfig.modules.push(require('../node_modules/performanceplatform-client.js' +
    '/test/fixtures/module-config-single-time-series.json'));
    this.dashboardConfig.modules.push(require('../node_modules/performanceplatform-client.js' +
    '/test/fixtures/module-config-user-satisfaction-graph.json'));
    this.processed = processModules(this.dashboardConfig.modules);
  });

  it('returns an array of modules', function () {
    this.processed.length.should.equal(3);
  });

  it('should return modules with title property', function () {
    var module = this.processed[0];
    module.moduleConfig.title.should.equal('test');
  });

  it('should return a textUpdate for a KPI module', function () {
    var module = this.processed[0];
    module.textUpdate.should.eql([
      '1 July 2013 to 30 June 2014 = 1',
      '1 April 2013 to 30 June 2014 = 2',
      'Total change = −50.00%'
    ]);
  });

  it('should return a textUpdate for a single time series module', function () {
    var module = this.processed[1];
    module.textUpdate.should.eql([
      '1 January 2014 to 31 January 2014 = 78.5%',
      '1 February 2014 to 28 February 2014 = 78.5%',
      'Total change = 0%'
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
});
