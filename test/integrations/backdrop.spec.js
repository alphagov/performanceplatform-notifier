var backdropResponse = require('../fixtures/backdrop-datasets.json'),
  Q = require('q');

describe('Backdrop integration', function () {
  var deferred,
    Backdrop,
    Query = require('../../lib/querist');

  beforeEach(function () {
    deferred = Q.defer();
    sinon.stub(Query.prototype, 'get').returns(deferred.promise);
    Backdrop = require('../../lib/integrations/backdrop');
  });

  afterEach(function () {
    Query.prototype.get.restore();
  });

  it('should accept options', function () {
    var backdrop = new Backdrop({
      foo: 'bar'
    });

    backdrop.config.should.eql({
      baseUrl : 'https://www.performance.service.gov.uk',
      foo: 'bar'
    });

  });

  describe('Querying for out of date datasets', function () {

    it('Should respond correctly to datasets', function () {

      var backdrop = new Backdrop();

      deferred.resolve(backdropResponse);

      return backdrop.getDataSets()
        .then(function (response) {

          response.should.be.an.instanceOf(Object);
          response.should.have.property('data_sets').
              and.be.instanceOf(Array);
          response.should.have.property('data_sets').
              length(4);
          response.should.have.property('message').
              equal('4 data-sets are out of date');
          response.should.have.property('status').
              equal('not okay');
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
          response.should.be.an.instanceOf(Object);
          response.should.have.property('data_sets').
              and.be.instanceOf(Array);
          response.should.have.property('data_sets').
              length(0);
          response.should.have.property('status').equal('okay');
        });
    });

  });

});
