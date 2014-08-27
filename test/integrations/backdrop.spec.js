var backdropResponse = require('../fixtures/backdrop-datasets.json'),
  Q = require('q');

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
      this.clock = sinon.useFakeTimers(
        new Date(2014, 7, 20).getTime()
      );
    });

    it('should call the client.post endpoint with the dataset and a timestamp', function () {
      var backdrop = new Backdrop({
        auth: {
          bearer: ''
        }
      });

      deferred.resolve();

      return backdrop.emailSent('test_data_set').then(function () {
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
                _timestamp: '2014-08-19T23:00:00+00:00',
                data_set: 'test_data_set'
              }
            });
      });
    });
  });

  describe('needsEmail()', function () {
    beforeEach(function () {
      this.clock = sinon.useFakeTimers(
        new Date(2014, 7, 20).getTime()
      );
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

    it('should return false if email has been sent in backdrop', function () {
      var backdrop = new Backdrop();

      deferred.resolve({
        data: [{}]
      });

      return backdrop.needsEmail('test_data_set').then(function (needsEmail) {
        needsEmail.should.equal(false);
      });
    });
  });

});
