var Message = require('../lib/message'),
  moment = require('moment');

describe('Message <Formats>', function () {

  var message;

  beforeEach(function () {
    this.clock = sinon.useFakeTimers(moment('2014-07-20T00:00:00Z').utc().unix() * 1000);
  });

  afterEach(function () {
    this.clock.restore();
  });

  describe('config', function () {
    it('should accept options to extend original config', function () {

      var message = new Message({
        foo: 'bar'
      });

      message.config.should.be.an.instanceOf(Object);
      message.config.should.eql({
        dateFormat: 'DD MMMM YYYY',
        foo: 'bar'
      });

    });
  });

  describe('dataset emails', function () {
    var dataSet = {
      'name': 'deposit_foreign_marriage_journey',
      'last-updated': '2014-07-18T00:00:00Z',
      'max-age-expected': 90000
    };

    beforeEach(function () {
      message = new Message();
    });

    it('Generate a message about how out of date a data-set is', function () {

      var reminder = message.dataSetReminder(dataSet);

      reminder.should.contain(
        'The data set deposit_foreign_marriage_journey was last updated on 18 July 2014'
      );
      reminder.should.contain(
        'a day'
      );

    });

    it('Returns a different date format when passed in', function () {

      message.dataSetReminder(dataSet, [], {
        dateFormat: 'MMMM Do YYYY, h:mm:ss a'
      }).should.contain(
        'July 18th 2014, 12:00:00 am'
      );

      message.dataSetReminder(dataSet, [], {
        dateFormat: 'YYYY-MM-DD HH:mm'
      }).should.contain(
        '2014-07-18 00:00'
      );

    });

    it('generates a title', function () {
      var title = message.dataSetReminderSubject(dataSet);

      title.should.equal('NOTIFICATION: "deposit_foreign_marriage_journey" is OUT OF DATE.');
    });

  });


});
