var Emailer = require('../lib/emailer'),
    config = require('../config.json');

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

  describe('.sendEmail()', function () {
    it('should call sendMail on the transport with the correct args', function () {
      email.sendEmail('test@test.com', 'subject', 'body');

      email.transporter.sendMail.should.have.been.calledWith({
        from: config.notificationsEmail,
        to: 'test@test.com',
        subject: 'subject',
        text: 'body'
      });
    });
  });

});
