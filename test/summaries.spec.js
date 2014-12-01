var Dashboard = require('performanceplatform-client.js'),
  Email = require('../lib/emailer'),
  summaries = require('../lib/summaries'),
  Q = require('q'),
  _ = require('underscore');

describe('Summary emails', function () {

  var deferred,
    getConfigStub,
    emailerSendSpy;

  beforeEach(function (done) {
    this.dashboardConfig = require('../node_modules/performanceplatform-client.js' +
      '/test/fixtures/dashboard-processed.json');
    deferred = Q.defer();

    getConfigStub = sinon
      .stub(Dashboard.prototype, 'getDashboardMetrics')
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
  });

  it('should send one email per recipient', function () {
    sinon.assert.callCount(emailerSendSpy, 3);
  });

  it('should be sent to a user with the correct details', function () {
    var expectedSubject = 'Data summary for \'Vehicle tax renewals\' dashboard';
    this.firstDashboard.to.should.eql(['example.person@testing.gov.uk']);
    this.firstDashboard.subject.should.eql(expectedSubject);
  });

  it('should list out module updates', function () {
    this.firstDashboard.text.should.have.string('July 2013 to June 2014');
    this.firstDashboard.text.should.have.string('Apr 2013 to Mar 2014');
    this.firstDashboard.text.should.have.string('Total change = -0.27%');
  });

});
