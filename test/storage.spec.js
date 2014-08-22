var storage = require('../lib/storage');

describe('Storage', function () {

  it('sets a key', function (done) {
    var db = new storage();

    db.set('foo', 'woof', function () {

      db.get('foo', function (err, data) {
        data.should.equal('woof');
        done();
      });

    });
  });

});
