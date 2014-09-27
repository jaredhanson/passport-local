var flash = require('connect-flash')
  , express = require('express')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , morgan = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , session = require('express-session')
  , debug = require('debug')('example:login');

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    debug('found user:');
    debug(users[idx]);
    fn(null, users[idx]);
  } else {
    var msg = 'User ' + id + ' does not exist';
    debug(msg);
    fn(new Error(msg));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      debug('found user:');
      debug(user);
      return fn(null, user);
    }
  }
  debug('user ' + username + ' not found');
  return fn(null, null);
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  debug('serializeUser:');
  debug(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  debug('deserializeUser');
  findById(id, function (err, user) {
    if(err) {
      debug('error:');
      debug(err);
    }
    debug('user:');
    debug(user);
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    debug('verify called. username: %s, password: %s', username, password);
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) {
          debug('error in verify');
          return done(err);
        }
        if (!user) {
          debug('user not found in verify');
          return done(null, false, { message: 'Unknown user ' + username });
        }
        if (user.password != password) {
          debug('invalid password in verify');
          return done(null, false, { message: 'Invalid password' });
        }
        debug('verify successful');
        return done(null, user);
      })
    });
  }
));

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(flash());
debug('about to initialize passport and session');
app.use(passport.initialize());
app.use(passport.session());
debug('passport and session added to request pipeline');


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.flash('error') });
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    debug('redirecting to / in POST /login');
    res.redirect('/');
  });
  
// POST /login
//   This is an alternative implementation that uses a custom callback to
//   achieve the same functionality.
/*
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});
*/

app.get('/logout', function(req, res){
  debug('GET /logout');
  req.logout();
  res.redirect('/');
});

app.use(express.static(__dirname + '/../../public'));

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  debug('req.isAuthenticated(): %s', req.isAuthenticated());
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
