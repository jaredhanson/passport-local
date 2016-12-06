/* global describe, it, expect */

var Strategy = require('../lib/strategy');


describe('Strategy', function() {
    
  var strategy = new Strategy(function(){}),
      other_strategy = new Strategy({name: 'other'}, function () {});
    
  it('should be named local by default', function() {
    expect(strategy.name).to.equal('local');
  });

  it('should be named other', function() {
      expect(other_strategy.name).to.equal('other');
  });
  
  it('should throw if constructed without a verify callback', function() {
    expect(function() {
      var s = new Strategy();
    }).to.throw(TypeError, 'LocalStrategy requires a verify callback');
  });
  
});
