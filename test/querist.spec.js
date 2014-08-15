var requireSubvert = require('require-subvert')(__dirname),
    Q = require('Q');

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
      var client = new Querist();
      var response = client.get('_status/data-sets/');
      var responseObj = {
        data_sets: [{},{}]
      };

      deferred.resolve(responseObj);

      return Q.all([
        response.should.eventually.be.an.instanceOf(Object),
        response.should.eventually.have.property('data_sets').
          and.be.instanceOf(Array)
      ]);

    });
  });



});
