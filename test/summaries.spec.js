describe('Summary emails', function () {
  var Dashboard = require('performanceplatform-client.js').Dashboard,
    Email = require('../lib/emailer'),
    summaries = require('../lib/summaries'),
    Q = require('q'),
    _ = require('underscore'),
    dashboardConfig = require('../node_modules/performanceplatform-client.js' +
    '/test/fixtures/dashboard-response.json');

  dashboardConfig.modules = [];
  dashboardConfig.modules.push(require('../node_modules/performanceplatform-client.js' +
    '/test/fixtures/module-config-kpi.json'));
  dashboardConfig.modules.push(require('../node_modules/performanceplatform-client.js' +
    '/test/fixtures/module-config-grouped-time-series.json'));

  var deferred,
    getConfigStub,
    emailerSendSpy;

  beforeEach(function (done) {
    this.dashboardConfig = JSON.parse(JSON.stringify(dashboardConfig));
    deferred = Q.defer();

    getConfigStub = sinon
      .stub(Dashboard.prototype, 'resolve')
      .returns(deferred.promise);
    emailerSendSpy = sinon.spy(Email.prototype, 'send');

    summaries().then(_.bind(function () {
      this.firstDashboard = emailerSendSpy.firstCall.args[0];
      done();
    }, this));

    deferred.resolve(this.dashboardConfig);
  });

  afterEach(function () {
    getConfigStub.restore();
    emailerSendSpy.restore();
    this.dashboardConfig = null;
  });

  it('should send one email per recipient', function () {
    sinon.assert.callCount(emailerSendSpy, 4);
  });

  it('should be sent to a user with the correct details', function () {
    var expectedSubject = 'Data summary for \'Company accounts filed\' dashboard';
    this.firstDashboard.to.should.eql(['example.person@testing.gov.uk']);
    this.firstDashboard.subject.should.eql(expectedSubject);
  });

  it('should list out module updates', function () {
    this.firstDashboard.text.should.have.string('1 July 2013 to 30 June 2014 = 45.8m');
    this.firstDashboard.text.should.have.string('1 April 2013 to 31 March 2014 = 46m');
    this.firstDashboard.text.should.have.string('Total change = −0.27%');
  });

});
