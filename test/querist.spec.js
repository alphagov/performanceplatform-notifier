var Querist = require('../lib/querist'),
  Q = require('Q');

describe('Querist', function () {

  describe('config', function () {
    it('should accept options to extend original config', function () {

      var client = new Querist({
        'baseUrl': 'google.com',
        'lols': 1e10
      });

      client.config.should.be.an.instanceOf(Object);
      client.config.baseUrl.should.equal('google.com');
      client.config.lols.should.equal(10000000000);

    });
  });

  describe('query for data-set status', function () {

    it('should return a list of data-sets', function () {
      this.timeout(100000);

      var client = new Querist();
      var response = client.get('_status/data-sets/');

      return Q.all([
        response.should.eventually.be.an.instanceOf(Object),
        response.should.eventually.have.property('data_sets').
          and.be.instanceOf(Array)
      ]);

    });
  });



});
