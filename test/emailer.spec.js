var Emailer = require('../lib/emailer'),
    config = require('../config');

describe('Emailer', function () {
  var email,
      nodemailer = require('nodemailer');

  beforeEach(function () {
    sinon.spy(nodemailer, 'createTransport');

    email = new Emailer();

    sinon.stub(email.transporter, 'sendMail');
  });

  afterEach(function () {
    email.transporter.sendMail.restore();
    nodemailer.createTransport.restore();
  });

  describe('instantiation', function () {
    it('should create a transport with the correct key and secret', function () {
      config.amazonAWS.accessKeyId = 'AMAZONKEY';
      config.amazonAWS.secretAccessKey = 'AMAZONSECRET';

      /* jshint unused: false */
      var mail = new Emailer(),
          nodeMailerOptions = nodemailer.createTransport.getCall(1).args[0].options;

      nodeMailerOptions.accessKeyId.should.equal('AMAZONKEY');
      nodeMailerOptions.secretAccessKey.should.equal('AMAZONSECRET');
    });
  });

  describe('.send()', function () {
    it('should call sendMail on the transport with the correct args', function () {
      email.send({
        to: 'test@test.com',
        subject: 'subject',
        text: 'body'
      });

      email.transporter.sendMail.should.have.been.calledWith({
        from: config.notificationsEmail,
        to: 'test@test.com',
        subject: 'subject',
        text: 'body'
      });
    });

    it('should not send if the email address is in the blacklist', function () {
      email.setBlacklist([
        'blacklisted@internet.com'
      ]);

      email.send({
        to: 'blacklisted@internet.com, not-blacklisted@internet.com',
        subject: 'foo',
        text: 'bar'
      });

      email.transporter.sendMail.calledOnce.should.be.true;
      email.transporter.sendMail.getCall(0).args[0].to.should.equal('not-blacklisted@internet.com');
    });

    it('should not care about case when blacklisting', function () {
      email.setBlacklist([
        'blacklisted@internet.com'
      ]);

      email.send({
        to: 'blAcklisted@internet.com',
        subject: 'foo',
        text: 'bar'
      });

      email.transporter.sendMail.called.should.be.false;
    });
  });

});
