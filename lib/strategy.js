// Module dependencies.
var passport = require('passport-strategy')
  , util = require('util')
  , lookup = require('./utils').lookup;

/**
 * Create a new `Strategy` object.
 *
 * @example
 * new LocalStrategy(function(username, password, cb) {
 *   users.findOne({ username: username }, function(err, user) {
 *     if (err) { return cb(err); }
 *     if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
 *
 *     crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
 *       if (err) { return cb(err); }
 *       if (!crypto.timingSafeEqual(user.hashedPassword, hashedPassword)) {
 *         return cb(null, false, { message: 'Incorrect username or password.' });
 *       }
 *       return cb(null, user);
 *     });
 *   });
 * });
 *
 * @class
 * @classdesc This `Strategy` is responsible for authenticating requests that
 * carry a username and password in the body of the request.  These credentials
 * are typically submitted by the user via an HTML form.
 *
 * @param {Object} [options]
 * @param {string} options.usernameField - Form field name where the username is
 *          found.  **Default:** `'username'`.
 * @param {string} options.passwordField - Form field name where the password is
 *          found.  **Default:** `'password'`.
 * @param {boolean} options.passReqToCallback - When `true`, the `verify`
 *          function receives the request object as the first argument.
 *.         **Default:** `false`.
 * @param {verifyFn} verify
 * @public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('LocalStrategy requires a verify callback'); }
  
  this._usernameField = options.usernameField || 'username';
  this._passwordField = options.passwordField || 'password';
  
  passport.Strategy.call(this);
  
  /** The name of the strategy, which is set to `'local'`. */
  this.name = 'local';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

// Inherit from `passport.Strategy`.
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var username = lookup(req.body, this._usernameField) || lookup(req.query, this._usernameField);
  var password = lookup(req.body, this._passwordField) || lookup(req.query, this._passwordField);
  
  if (!username || !password) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }
  
  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }
  
  try {
    if (self._passReqToCallback) {
      this._verify(req, username, password, verified);
    } else {
      this._verify(username, password, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};

// Export `Strategy`.
module.exports = Strategy;


/**
 * Verifies `username` and `password` and yields authenticated user.
 *
 * This function is called by `{@link Strategy}` to verify a username and
 * password, and must invoke `cb` to yield the result.  `cb` is an error-first
 * callback with the following signature: `cb(err, user, [info])` where:
 *
 *   - `err: {?Error}` - An `Error` if an error occured; otherwise `null`.
 *   - `user: {Object}|{boolean}` - An `Object` representing the authenticated
 *       user if verification was successful; otherwise `false`.
 *   - `info: {Object}`: Additional application-specific context that will be
 *       passed through for additional request processing.
 *
 * @callback verifyFn
 * @param {string} username - The username received in the request.
 * @param {string} password - The passport received in the request.
 * @param {Function} cb
 */
