var Dashboard = require('performanceplatform-client.js'),
    Email = require('../lib/emailer'),
    summaries = require('../lib/summaries'),
    Q = require('q');

describe('Summary emails', function () {

  var deferred,
      emailerSendSpy;

  beforeEach(function (done) {
    deferred = Q.defer();

    sinon.stub(Dashboard.prototype, 'getConfig').returns(deferred.promise);
    emailerSendSpy = sinon.spy(Email.prototype, 'send');

    summaries().then(function () {
      done();
    });

    deferred.resolve({
      'title': 'Carer\'s allowance applications',
      'slug': 'carers-allowance',
      'modules': [ {'x': 'y'}, {'x': 'y'} ]
    });

  });

  it('should be sent to a user with the correct details', function () {
    var expectedSubject = 'Data summary for \'Carer\'s allowance applications\' dashboard';
    sinon.assert.calledOnce(emailerSendSpy);
    emailerSendSpy.firstCall.args[0].to.should.eql(['example.person@testing.gov.uk']);
    emailerSendSpy.firstCall.args[0].subject.should.eql(expectedSubject);
  });

});
