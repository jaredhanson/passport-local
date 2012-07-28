var vows = require('vows');
var assert = require('assert');
var util = require('util');
var LocalStrategy = require('passport-local/strategy');
var BadRequestError = require('passport-local/errors/badrequesterror');


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
  
  'strategy handling a request with req argument to callback': {
    topic: function() {
      var strategy = new LocalStrategy({passReqToCallback: true}, function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        req.foo = 'bar';
        strategy.success = function(user) {
          self.callback(null, user);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        
        strategy._verify = function(req, username, password, done) {
          done(null, { foo: req.foo, username: username, password: password });
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
      'should have request details' : function(err, user) {
        assert.equal(user.foo, 'bar');
      },
    },
  },
  
  'strategy handling a request with parameter options set to object-formatted string': {
    topic: function() {
      var strategy = new LocalStrategy({usernameField: 'user[username]', passwordField: 'user[password]'}, function(){});
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
        req.body.user = {};
        req.body.user.username = 'johndoe';
        req.body.user.password = 'secret';
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
  
  'strategy handling a request with parameter options set to plain string': {
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
  
  'strategy handling a request with additional info': {
    topic: function() {
      var strategy = new LocalStrategy(function(){});
      return strategy;
    },
    
    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user, info) {
          self.callback(null, user, info);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        
        strategy._verify = function(username, password, done) {
          done(null, { username: username, password: password }, { message: 'Welcome' });
        }
        
        req.body = {};
        req.body.username = 'johndoe';
        req.body.password = 'secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should not generate an error' : function(err, user, info) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.username, 'johndoe');
        assert.equal(user.password, 'secret');
      },
      'should pass additional info' : function(err, user, info) {
        assert.equal(info.message, 'Welcome');
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
  
  'strategy handling a request that is not verified with additional info': {
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
        strategy.fail = function(info) {
          self.callback(null, info);
        }
        
        strategy._verify = function(username, password, done) {
          done(null, false, { message: 'Wrong password' });
        }
        
        req.body = {};
        req.body.username = 'johndoe';
        req.body.password = 'idontknow';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err, info) {
        // fail action was called, resulting in test callback
        assert.isNull(err);
      },
      'should pass additional info' : function(err, info) {
        assert.equal(info.message, 'Wrong password');
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
        strategy.fail = function(info) {
          self.callback(null, info);
        }
        
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },
      
      'should fail authentication' : function(err, info) {
        // fail action was called, resulting in test callback
        assert.isTrue(true);
      },
      'should pass BadReqestError as additional info' : function(err, info) {
        assert.instanceOf(info, Error);
        assert.instanceOf(info, BadRequestError);
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
        strategy.fail = function(info) {
          self.callback(null, info);
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
      'should pass BadReqestError as additional info' : function(err, info) {
        assert.instanceOf(info, Error);
        assert.instanceOf(info, BadRequestError);
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
        strategy.fail = function(info) {
          self.callback(null, info);
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
      'should pass BadReqestError as additional info' : function(err, info) {
        assert.instanceOf(info, Error);
        assert.instanceOf(info, BadRequestError);
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
        strategy.fail = function(info) {
          self.callback(null, info);
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
      'should pass BadReqestError as additional info' : function(err, info) {
        assert.instanceOf(info, Error);
        assert.instanceOf(info, BadRequestError);
      },
    },
  },
  
  'strategy constructed without a verify callback': {
    'should throw an error': function (strategy) {
      assert.throws(function() { new LocalStrategy() });
    },
  },

}).export(module);
