var frequency = require('../lib/frequency');

describe('Frequency', function () {
  it('gets the frequency in the map', function () {
    frequency(360).should.equal(60);
    frequency(4500).should.equal(3600);
    frequency(90000).should.equal(3600);
    frequency(648000).should.equal(86400);
    frequency(2764800).should.equal(172800);
    frequency(8467200).should.equal(604800);
  });
  it('gets the closest frequency in the map', function () {
    frequency(400).should.equal(60);
    frequency(4000).should.equal(3600);
    frequency(80000).should.equal(3600);
    frequency(650000).should.equal(86400);
    frequency(2800000).should.equal(172800);
    frequency(8400000).should.equal(604800);
  });
});
