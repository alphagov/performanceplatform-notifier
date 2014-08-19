var requireSubvert = require('require-subvert')(__dirname),
    Q = require('q');

describe('Querist', function () {
  var Querist,
      stub,
      deferred;

  beforeEach(function () {
    deferred = Q.defer();
    stub = sinon.stub().returns(deferred.promise);
    requireSubvert.subvert('../lib/request-promise', stub);
    Querist = requireSubvert.require('../lib/querist');
  });

  describe('config', function () {
    it('should accept options to extend original config', function () {

      var client = new Querist({
        'baseUrl': 'google.com',
        'lols': 10000
      });

      client.config.should.be.an.instanceOf(Object);
      client.config.baseUrl.should.equal('google.com');
      client.config.lols.should.equal(10000);

    });
  });

  describe('query for data-set status', function () {

    it('should return a list of data-sets', function () {
      var client = new Querist({
        baseUrl: 'https://www.performance.service.gov.uk/'
      });
      var responseObj = {
        data_sets: [{},{}]
      };

      deferred.resolve(responseObj);

      return client.get('_status/data-sets/').then(function (response) {
        response.should.be.an.instanceOf(Object);
        response.should.have.property('data_sets').
          and.be.instanceOf(Array);
      });

    });
  });

  describe('query with options', function () {
    it('should set json to true by default', function () {
      var client = new Querist();

      client.get('test');

      var options = stub.getCall(0).args[1];

      options.should.eql({
        json: true
      });
    });

    it('should add options to the request', function () {
      var client = new Querist();
      /* jshint unused: false */
      client.get('test', {json: false, foo: 'bar'});

      var options = stub.getCall(0).args[1];

      options.should.eql({
        json: false,
        foo: 'bar'
      });
    });
  });

});
