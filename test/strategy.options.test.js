/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , Strategy = require('../lib/strategy');


describe('Strategy', function() {
    
  describe('handling a request without a body, but no username and password, with message option to authenticate', function() {
    var strategy = new Strategy(function(username, password, done) {
      return done(null, false, { message: 'Something is wrong with this request' });
    });
    
    var info;
    
    before(function(done) {
      chai.passport(strategy)
        .fail(function(i, s) {
          info = i;
          done();
        })
        .req(function(req) {
          req.body = {};
        })
        .authenticate({ badRequestMessage: 'Something is wrong with this request' });
    });
    
    it('should fail', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Something is wrong with this request');
    });
  });
  
});
