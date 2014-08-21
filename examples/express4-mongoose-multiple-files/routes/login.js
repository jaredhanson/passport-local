var passport = require('passport');
var express = require('express');
var router = express.Router();
router.use(function(req, res, next){
  next();
});
// app/routes.js
  // root with login links
  router.get('/', function(req, res) {
    res.render('index.ejs');
  });
  // login
  router.get('/login', function(req, res){
    res.render('login/login.ejs', { message: req.flash('info') });
  });
  //signup
  router.get('/signup', function(req, res) {
    res.render('login/signup.ejs', {message: req.flash('info')});
  });
  router.get('/profile', function(req, res) {
    if(req.user){
      res.render('profile.ejs', { user : req.user  });
    } else {
      res.redirect('login');
    }
  });
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  router.post('/signup', function(req,res, next){
    passport.authenticate('local-signup',
    function(err, user, info){
      if(err){
        return next(err);
      }
      if(!user){
        req.flash('info', info.message);
        return res.redirect('/signup')
      }
      req.flash('info', info.message);
      res.redirect('/login');
    })(req,res,next);
  });
  router.post('/login', function(req, res, next){
    passport.authenticate('local-login', 
    function(err, user, info){
      if(err) { 
        return next(err);
      }
      if(!user) { 
        req.flash('info', info.message);
        return res.redirect('/login');
      }
      req.logIn(user, function(err) {
        if(err) { 
          return next(err); 
        }
        return res.redirect('/profile');

      });
    })(req, res, next);
  });
module.exports = router;
