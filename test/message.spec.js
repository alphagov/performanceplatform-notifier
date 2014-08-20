var Message = require('../lib/message');

describe('Message <Formats>', function () {

  beforeEach(function () {});

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
      'last-updated': '2014-01-16T16:33:04.455000+00:00',
      'max-age-expected': 90000,
      'seconds-out-of-date': 18484718
    };

    it('Generate a message about how out of date a data-set is', function () {

      var message = new Message();

      var reminder = message.datasetReminder(dataSet);

      reminder.should.contain(
        'The data set deposit_foreign_marriage_journey was last updated on 16th Jan 14'
      );
      reminder.should.contain(
          '215 days out of date.'
      );
      reminder.should.contain(
          'Please upload the data at your earliest convenience.'
      );

    });

    it('Returns a different date format when passed in', function () {

      var message = new Message();

      message.datasetReminder(dataSet, {
        dateFormat: 'MMMM Do YYYY, h:mm:ss a'
      }).should.contain(
        'January 16th 2014, 4:33:04 pm'
      );

      message.datasetReminder(dataSet, {
        dateFormat: 'YYYY-MM-DD HH:mm'
      }).should.contain(
        '2014-01-16 16:33'
      );

    });

  });


});
