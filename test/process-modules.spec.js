describe('Process summary modules', function () {
  var processModules = require('../lib/process-modules.js');

  beforeEach(function () {
    this.dashboardConfig = require('../node_modules/performanceplatform-client.js' +
    '/test/fixtures/dashboard-processed.json');
    this.processed = processModules(this.dashboardConfig.modules);
  });

  it('returns an array of modules', function () {
    this.processed.length.should.equal(5);
  });

  it('should return modules with title property', function () {
    var module = this.processed[0];
    module.title.should.equal('Transactions per year');
  });

  it('should return a textUpdate for a KPI module', function () {
    var module = this.processed[0];
    module.textUpdate.should.eql([
      'July 2013 to June 2014 = 45.8m',
      'Apr 2013 to Mar 2014 = 46m',
      'Total change = -0.27%'
    ]);
  });

  it('should return a textUpdate for a single time series module', function () {
    var module = this.processed[3];
    module.textUpdate.should.eql([
      '24 to 30 Nov 2014 = 37m 51s',
      '17 to 23 Nov 2014 = 37m 56s',
      'Total change = -5s'
    ]);
  });

  it('should return a textUpdate for a user satisfaction module', function () {
    var module = this.processed[4];
    module.textUpdate.should.eql([
      '15 to 22 Dec 2014 = 85.6%',
      '8 to 14 Dec 2014 = 87.0%',
      'Total change = -1.4%'
    ]);
  });
});
