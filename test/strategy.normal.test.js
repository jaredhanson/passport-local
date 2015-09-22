/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , Strategy = require('../lib/strategy');


describe('Strategy', function() {
    
  describe('handling a request with valid credentials in body', function() {
    var strategy = new Strategy(function(username, password, done) {
      if (username == 'johndoe' && password == 'secret') {
        return done(null, { id: '1234' }, { scope: 'read' });
      }
      return done(null, false);
    });
    
    var user
      , info;
    
    before(function(done) {
      chai.passport(strategy)
        .success(function(u, i) {
          user = u;
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
    
    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.id).to.equal('1234');
    });
    
    it('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info.scope).to.equal('read');
    });
  });
  
  describe('handling a request with valid credentials in query', function() {
    var strategy = new Strategy(function(username, password, done) {
      if (username == 'johndoe' && password == 'secret') {
        return done(null, { id: '1234' }, { scope: 'read' });
      }
      return done(null, false);
    });
    
    var user
      , info;
    
    before(function(done) {
      chai.passport(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query.username = 'johndoe';
          req.query.password = 'secret';
        })
        .authenticate();
    });
    
    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.id).to.equal('1234');
    });
    
    it('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info.scope).to.equal('read');
    });
  });
  
  describe('handling a request without a body', function() {
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
        .authenticate();
    });
    
    it('should fail', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('authentication failed');
    });
  });
  
  describe('handling a request with a body, but no username and password', function() {
    var strategy = new Strategy(function(username, password, done) {
      return done(null, false, { message: 'authentication failed' });
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
        .authenticate();
    });
    
    it('should fail', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('authentication failed');
    });
  });
  
  describe('handling a request without a body, but no password', function() {
    var strategy = new Strategy(function(username, password, done) {
      return done(null, false, { message: 'authentication failed' });
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
          req.body.username = 'johndoe';
        })
        .authenticate();
    });
    
    it('should fail', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('authentication failed');
    });
  });
  
  describe('handling a request without a body, but no username', function() {
    var strategy = new Strategy(function(username, password, done) {
      return done(null, false, { message: 'authentication failed' });
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
