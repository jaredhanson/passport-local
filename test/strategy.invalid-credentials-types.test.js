/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , Strategy = require('../lib/strategy');


describe('Strategy', function() {

  describe('handling a request with invalid username type in body', function() {
    var strategy = new Strategy(function(username, password, done) {
      return done(new Error('Verify callback should not be reached.'));
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
          req.body.username = { object: 1 };
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should error', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
    });
  });

  describe('handling a request with invalid password type in body', function() {
    var strategy = new Strategy(function(username, password, done) {
      return done(new Error('Verify callback should not be reached.'));
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
          req.body.password = { object: 1 };
        })
        .authenticate();
    });

    it('should error', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
    });
  });

  describe('handling a request with invalid username type in query', function() {
    var strategy = new Strategy(function(username, password, done) {
      return done(new Error('Verify callback should not be reached.'));
    });

    var info;

    before(function(done) {
      chai.passport(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query.username = { object: 1 };
          req.query.password = 'secret';
        })
        .authenticate();
    });

    it('should error', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
    });
  });

  describe('handling a request with invalid password type in query', function() {
    var strategy = new Strategy(function(username, password, done) {
      return done(new Error('Verify callback should not be reached.'));
    });

    var info;

    before(function(done) {
      chai.passport(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query.username = 'johndoe';
          req.query.password = { object: 1 };
        })
        .authenticate();
    });

    it('should error', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
    });
  });

});
