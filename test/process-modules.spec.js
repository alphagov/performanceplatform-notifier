describe('Process summary modules', function () {
  var processModules = require('../lib/process-modules.js');

  beforeEach(function () {
    this.dashboardConfig = require('../node_modules/performanceplatform-client.js' +
    '/test/fixtures/dashboard-processed.json');
    this.processed = processModules(this.dashboardConfig.modules);
  });

  it('returns an array of KPI modules', function () {
    this.processed.length.should.equal(3);
  });

  it('should return modules with title property', function () {
    var module = this.processed[0];
    module.title.should.equal('Transactions per year');
  });

  it('should return modules with textUpdate property', function () {
    var module = this.processed[0];
    module.textUpdate.constructor.should.equal(Array);
    module.textUpdate.should.eql([
      'July 2013 to June 2014 = 45.8m',
      'Apr 2013 to Mar 2014 = 46m',
      'Total change = -0.27% points'
    ]);
  });

});
