var Strategy = require('../lib/passport-local/strategy');


describe('Strategy', function() {
    
  var strategy = new Strategy(function(){});
    
  it('should be named local', function() {
    expect(strategy.name).to.equal('local');
  });
  
  it('should throw if constructed without a verify callback', function() {
    expect(function() {
      new Strategy();
    }).to.throw(TypeError, 'LocalStrategy requires a verify callback');
  });
  
});
