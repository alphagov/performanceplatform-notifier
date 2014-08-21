var stagecraftResponse = require('../fixtures/stagecraft-emails.json'),
  Q = require('q'),
  appConfig = require('../../config');

describe('Stagecraft integration', function () {
  var deferred,
    Stagecraft,
    Query = require('../../lib/querist');

  beforeEach(function () {
    deferred = Q.defer();
    sinon.stub(Query.prototype, 'get').returns(deferred.promise);
    Stagecraft = require('../../lib/integrations/stagecraft');
  });

  afterEach(function () {
    Query.prototype.get.restore();
  });

  it('should accept options', function () {
    var stagecraft = new Stagecraft({
      auth: {
        bearer: 'ralph_sucks'
      }
    });

    stagecraft.config.should.eql({
      baseUrl : 'https://stagecraft.production.performance.service.gov.uk/',
      auth: {
        bearer: 'ralph_sucks'
      }
    });

  });

  describe('Querying for emails attached to datasets', function () {

    it('responds with emails', function () {
      var config = {
        baseUrl : 'https://testurl.com/',
        auth: {
          bearer: 'bearerToken'
        }
      };
      var stagecraft = new Stagecraft(config);
      var dataSet = {
        name: 'testSet'
      };

      deferred.resolve(stagecraftResponse);

      return stagecraft.queryEmail(dataSet)
        .then(function (response) {
          Query.prototype.get.should.have.been.calledOnce;
          Query.prototype.get.getCall(0).args[0].should.equal('data-sets/testSet/users');
          Query.prototype.get.getCall(0).args[1].should.eql(config);
          response.should.be.an.instanceOf(Object);
          response.emails.should.be.an.instanceOf(Array);
          response.should.have.property('name');
          response.name.should.equal('testSet');
          response.emails[0].should.equal('hi.pal@email.gsi.govemail');
        });
    });

    it('responds with 0 emails', function () {
      var config = {
        baseUrl : 'https://testurl.com/',
        auth: {
          bearer: 'bearerToken'
        }
      };
      var stagecraft = new Stagecraft(config);
      var dataSet = {
        name: 'testSet'
      };

      deferred.resolve([]);

      return stagecraft.queryEmail(dataSet)
        .then(function (response) {
          Query.prototype.get.should.have.been.calledOnce;
          Query.prototype.get.getCall(0).args[0].should.equal('data-sets/testSet/users');
          Query.prototype.get.getCall(0).args[1].should.eql(config);
          response.should.be.an.instanceOf(Object);
          response.emails.should.equal(appConfig.notificationsEmail);
          response.should.have.property('name');
          response.name.should.equal('testSet');
        });
    });

  });

});
