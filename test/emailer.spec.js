var expect = require('chai').expect,
    Emailer = require('../lib/emailer');

describe('Emailer', function () {
  var email;

  beforeEach(function () {
    email = new Emailer();
  });

  describe('.sendEmail()', function () {
    it('should send a hello world to nowhere', function () {
      expect(email).to.be.Object;
    });
  });



});
