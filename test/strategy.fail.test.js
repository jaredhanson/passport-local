/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , Strategy = require('../lib/strategy');


describe('Strategy', function() {
    
  describe('failing authentication', function() {
    var strategy = new Strategy(function(username, password, done) {
      return done(null, false);
    });
    
    var info;
    
    before(function(done) {
      chai.passport(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });
    
    it('should fail', function() {
      expect(info).to.be.undefined;
    });
  });
  
  describe('failing authentication with info', function() {
    var strategy = new Strategy(function(username, password, done) {
      return done(null, false, { message: 'authentication failed' });
    });
    
    var info;
    
    before(function(done) {
      chai.passport(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });
    
    it('should fail', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('authentication failed');
    });
  });
  
});
