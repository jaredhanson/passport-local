var vows = require('vows');
var assert = require('assert');
var util = require('util');
var LocalStrategy = require('passport-local/strategy');


vows.describe('LocalStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new LocalStrategy(function(){});
    },
    
    'should be named session': function (strategy) {
      assert.equal(strategy.name, 'local');
    },
  },
  
  'strategy handling a request': {
    topic: function() {
      var strategy = new LocalStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(null, user);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        
        strategy._verify = function(username, password, done) {
          done(null, { username: username, password: password });
        }
        
        req.body = {};
        req.body.username = 'johndoe';
        req.body.password = 'secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.username, 'johndoe');
        assert.equal(user.password, 'secret');
      },
    },
  },
  
  'strategy handling a request with parameter options set': {
    topic: function() {
      var strategy = new LocalStrategy({usernameField: 'userid', passwordField: 'passwd'}, function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(null, user);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        
        strategy._verify = function(username, password, done) {
          done(null, { username: username, password: password });
        }
        
        req.body = {};
        req.body.userid = 'johndoe';
        req.body.passwd = 'secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.username, 'johndoe');
        assert.equal(user.password, 'secret');
      },
    },
  },
  
  'strategy handling a request that is not verified': {
    topic: function() {
      var strategy = new LocalStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function() {
          self.callback();
        }
        
        strategy._verify = function(username, password, done) {
          done(null, false);
        }
        
        req.body = {};
        req.body.username = 'johndoe';
        req.body.password = 'idontknow';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err, user) {
        // fail action was called, resulting in test callback
        assert.isNull(err);
      },
    },
  },
  
  'strategy handling a request that encounters an error during verification': {
    topic: function() {
      var strategy = new LocalStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.error = function(err) {
          self.callback(null, err);
        }
        
        strategy._verify = function(username, password, done) {
          done(new Error('something-went-wrong'));
        }
        
        req.body = {};
        req.body.username = 'johndoe';
        req.body.password = 'secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should not call success or fail' : function(err, e) {
        assert.isNull(err);
      },
      'should call error' : function(err, e) {
        assert.instanceOf(e, Error);
      },
    },
  },
  
  'strategy handling a request without a body': {
    topic: function() {
      var strategy = new LocalStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.fail = function() {
          self.callback(null);
        }
        
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err) {
        // fail action was called, resulting in test callback
        assert.isTrue(true);
      },
    },
  },
  
  'strategy handling a request with a body, but no username or password': {
    topic: function() {
      var strategy = new LocalStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.fail = function() {
          self.callback(null);
        }
        
        req.body = {};
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err) {
        // fail action was called, resulting in test callback
        assert.isTrue(true);
      },
    },
  },
  
  'strategy handling a request with a body, but no password': {
    topic: function() {
      var strategy = new LocalStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.fail = function() {
          self.callback(null);
        }
        
        req.body = {};
        req.body.username = 'johndoe';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err) {
        // fail action was called, resulting in test callback
        assert.isTrue(true);
      },
    },
  },
  
  'strategy handling a request with a body, but no username': {
    topic: function() {
      var strategy = new LocalStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.fail = function() {
          self.callback(null);
        }
        
        req.body = {};
        req.body.password = 'secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err) {
        // fail action was called, resulting in test callback
        assert.isTrue(true);
      },
    },
  },
  
  'strategy constructed without a verify callback': {
    'should throw an error': function (strategy) {
      assert.throws(function() { new LocalStrategy() });
    },
  },

}).export(module);
