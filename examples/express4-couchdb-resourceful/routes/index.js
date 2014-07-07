var User = require('../models/user');

module.exports = function(app, passport) {


  app.get('/', function(req, res) {
    res.render('index.ejs', {user : req.user});
  });

  app.get('/account', function(req, res) {
    res.render('account.ejs', {user : req.user});
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', function(req, res) {
    User.create(req.body.user, function(err, data) {
      if (err) {
        console.log('Error : ', err);
        res.send(500, err);
      } else {
        res.redirect('/');
      }
    });
  });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
