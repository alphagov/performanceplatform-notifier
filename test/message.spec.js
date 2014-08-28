var Message = require('../lib/message'),
  moment = require('moment');

describe('Message <Formats>', function () {

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
        dateFormat: 'Do MMM YY',
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

    it('Generate a message about how out of date a data-set is', function () {

      var message = new Message();

      var reminder = message.dataSetReminder(dataSet);

      reminder.should.contain(
        'The data set deposit_foreign_marriage_journey was last updated on 18th Jul 14'
      );
      reminder.should.contain(
          '1 days out of date.'
      );
      reminder.should.contain(
          'Please upload the data at your earliest convenience.'
      );

    });

    it('Returns a different date format when passed in', function () {

      var message = new Message();

      message.dataSetReminder(dataSet, {
        dateFormat: 'MMMM Do YYYY, h:mm:ss a'
      }).should.contain(
        'July 18th 2014, 1:00:00 am'
      );

      message.dataSetReminder(dataSet, {
        dateFormat: 'YYYY-MM-DD HH:mm'
      }).should.contain(
        '2014-07-18 01:00'
      );

    });

  });


});
