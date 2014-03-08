/* global describe, it, expect */

var strategy = require('..');

describe('passport-local', function() {
  
  it('should export Strategy constructor directly from package', function() {
    expect(strategy).to.be.a('function');
    expect(strategy).to.equal(strategy.Strategy);
  });
  
});
