/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util')
  , BadRequestError = require('./errors/badrequesterror');


/**
 * `Strategy` constructor.
 *
 * The local authentication strategy authenticates requests based on the
 * credentials submitted through an HTML-based login form.
 *
 * Applications must supply a `verify` callback which accepts `username` and
 * `password` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `usernameField`  field name where the username is found, defaults to _username_
 *   - `passwordField`  field name where the password is found, defaults to _password_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new LocalStrategy(
 *       function(username, password, done) {
 *         User.findOne({ username: username, password: password }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) throw new Error('local authentication strategy requires a verify function');
  
  this._usernameField = options.usernameField || 'username';
  this._passwordField = options.passwordField || 'password';
  
  passport.Strategy.call(this);
  this.name = 'local';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req) {
  var username = lookup(req.body, this._usernameField);
  var password = lookup(req.body, this._passwordField);
  
  if (!req.body || !username || !password) {
    return this.fail(new BadRequestError('Missing credentials'));
  }
  
  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }
  
  if (self._passReqToCallback) {
    this._verify(req, username, password, verified);
  } else {
    this._verify(username, password, verified);
  }
  
  function lookup(obj, field) {
    if (!obj) { return null; }
    var elements = field.split(']').join('').split('[');
    for (i = 0; i < elements.length; i++) {
      var element = obj[elements[i]];
      if (typeof(element) === 'undefined') { return null; }
      if (typeof(element) !== 'object') { return element; }
      obj = element;
    }
    return obj;
  }
}


/**
 * Expose `Strategy`.
 */ 
module.exports = Strategy;
