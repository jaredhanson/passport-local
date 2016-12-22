// config/passport.js

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user.js');
  
passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});
// local strategies
passport.use('local-signup',
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function(){
      User.findOne({ 'local.email' : email }, function(err, user) {
        if(err) {
          return done(err);
        }
        if(user) {
          return done(null, false, {message:'That email is already taken.'});
        } else {
          var newUser = new User();
          newUser.local.email=email;
          newUser.local.password=password;
          newUser.save(function(err){
            if(err) {
              throw err;
            }
            return done(null, newUser, {message:'Successfully registered. Please log in'});
          })
        }
      });
    });
}));
passport.use('local-login',
  new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    User.findOne({'local.email': email}, function(err,user) {
      if(err){
        return done(err);
      }
      if(user){
        user.validPassword(password, function(err, result){
          if(result){
            done(null, user);
          }else{ // bad password.
            done(null, false, {message:'login failed'});
          }
        });
      }else{ // user does not exist
        done(null, false, {message:'login failed'});
      }
    });
}));
