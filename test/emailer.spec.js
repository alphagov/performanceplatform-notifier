var expect = require('chai').expect,
  Emailer = require('../lib/emailer');

describe('Emailer', function () {
  describe('#sendEmail()', function () {
    it('should send a hello world to nowhere', function () {
      var emailer = new Emailer({
        message: 'hello world'
      }),
      results = emailer.sendEmail();

      expect(results).to.equal('hello world');
    });
  });
});
