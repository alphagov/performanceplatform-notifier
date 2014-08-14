var request = require('../lib/request-promise');


describe('Request-Promise', function () {

  it('should bail out if there’s no slug provided', function () {
    var response = request();

    return response.should.be.rejectedWith(
      'Please provide a base url and slug to query'
    );

  });

});
