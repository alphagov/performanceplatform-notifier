var backdropResponse = require('../fixtures/backdrop-datasets.json'),
  Q = require('q'),
  moment = require('moment');

describe('Backdrop integration', function () {
  var deferred,
    Backdrop,
    Query = require('../../lib/querist');

  beforeEach(function () {
    deferred = Q.defer();
    sinon.stub(Query.prototype, 'get').returns(deferred.promise);
    sinon.stub(Query.prototype, 'post').returns(deferred.promise);
    Backdrop = require('../../lib/integrations/backdrop');
  });

  afterEach(function () {
    Query.prototype.get.restore();
    Query.prototype.post.restore();
  });

  it('should accept options', function () {
    var backdrop = new Backdrop({
      foo: 'bar',
      auth: {
        bearer: ''
      }
    });

    backdrop.config.should.eql({
      baseUrl : 'https://www.performance.service.gov.uk/',
      auth: {
        bearer: ''
      },
      foo: 'bar'
    });

  });

  describe('getDataSets()', function () {

    it('Should respond correctly to datasets', function () {

      var backdrop = new Backdrop();

      deferred.resolve(backdropResponse);

      return backdrop.getDataSets()
        .then(function (response) {

          Query.prototype.get.should.be.calledOnce;
          Query.prototype.get.getCall(0).args[0]
            .should.equal('_status/data-sets/');

          response.should.be.an.instanceOf(Array);
          response.length.should.equal(4);
        });
    });

    it('Should respond correctly with no datasets', function () {

      var backdrop = new Backdrop();

      deferred.resolve(
        {
          'data_sets': [],
          'message': 'all clear',
          'status': 'okay'
        }
      );

      return backdrop.getDataSets()
        .then(function (response) {
          response.should.equal(false);
        });
    });

  });

  describe('emailSent()', function () {
    beforeEach(function () {
      this.clock = sinon.useFakeTimers(moment('2014-07-20T00:00:00Z').utc().unix() * 1000);
    });

    it('should call the client.post endpoint with the dataset and a timestamp', function () {
      var backdrop = new Backdrop({
        auth: {
          bearer: ''
        }
      });

      deferred.resolve();

      return backdrop.emailSent({
        name: 'test_data_set',
        'seconds-out-of-date': 1001,
        recipientCount: 5
      }).then(function () {
        Query.prototype.post.should.be.calledOnce;
        Query.prototype.post.getCall(0).args[0]
            .should.equal('data/performance-platform/notifier');
        Query.prototype.post.getCall(0).args[1]
            .should.eql({
              auth: {
                bearer: ''
              },
              baseUrl: 'https://www.performance.service.gov.uk/',
              json: {
                _timestamp: '2014-07-20T00:00:00+00:00',
                data_set: 'test_data_set',
                'seconds_out_of_date': 1001,
                recipient_count: 5
              }
            });
      });
    });
  });

  describe('needsEmail()', function () {
    beforeEach(function () {
      this.clock = sinon.useFakeTimers(moment('2014-07-20T00:00:00Z').utc().unix() * 1000);
    });

    it('should call client.get with the correct dataset (filter) and options', function () {
      var backdrop = new Backdrop();

      deferred.resolve({
        data: []
      });

      return backdrop.needsEmail({name: 'test_data_set'}).then(function (needsEmail) {
        Query.prototype.get.should.be.calledOnce;
        Query.prototype.get.getCall(0).args[0]
            .should.equal('data/performance-platform/notifier');
        Query.prototype.get.getCall(0).args[1]
            .should.eql({
              qs: {
                filter_by: 'data_set:test_data_set',
                limit: 1,
                sort_by: '_timestamp:descending'
              }
            });
        needsEmail.should.equal(true);
      });
    });

    it('should return false if email has been sent and record for alert in backdrop', function () {
      var backdrop = new Backdrop();

      deferred.resolve({
        data: [{}]
      });

      return backdrop.needsEmail({name: 'test_data_set'}).then(function (needsEmail) {
        needsEmail.should.equal(false);
      });
    });

    it('should return true if email has been sent and record for ' +
    'alert in backdrop is less than the frequency for alert', function () {
      var backdrop = new Backdrop();

      deferred.resolve({
        data: [{
          _timestamp: '2014-07-19T00:00:00Z'
        }]
      });

      return backdrop.needsEmail({
        name: 'test_data_set',
        'max-age-expected': 360
      }).then(function (needsEmail) {
        needsEmail.should.equal(true);
      });
    });
  });

});
