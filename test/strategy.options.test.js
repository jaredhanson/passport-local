/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , Strategy = require('../lib/strategy');


describe('Strategy', function() {

  describe('handling a request without a body, but no username and password, with message option to authenticate', function() {
    var strategy = new Strategy(function() {
      throw new Error('should not be called');
    });

    var info, status;

    before(function(done) {
      chai.passport(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function(req) {
          req.body = {};
        })
        .authenticate({ badRequestMessage: 'Something is wrong with this request' });
    });

    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Something is wrong with this request');
      expect(status).to.equal(400);
    });
  });

  describe('handling an authentication request from non-Express framework: username and password parameters are given as optional arguments', function() {
    var user
    , info;

    before(function(done) {
      chai.passport(new Strategy({ passReqToCallback: true }, function(req, username, password, done) {
        if (username === 'johndoe' && password === 'secret') {
          return done(null, { id: '1234' }, { scope: 'read' });
        }
        return done(null, false);
      }))
        .success(function(u, i) {
        user = u;
        info = i;
        done();
      })
        .authenticate({ params: { username: 'johndoe', password: 'secret' }});
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
});
