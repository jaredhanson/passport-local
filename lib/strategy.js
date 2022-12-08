// Module dependencies.
var passport = require('passport-strategy')
  , util = require('util')
  , lookup = require('./utils').lookup;

/**
 * Create a new `Strategy` object.
 *
 * @classdesc This `Strategy` authenticates requests that carry a username and
 * password in the body of the request.  These credentials are typically
 * submitted by the user via an HTML form.
 *
 * @public
 * @class
 * @augments base.Strategy
 * @param {Object} [options]
 * @param {string} [options.usernameField='username'] - Form field name where
 *          the username is found.
 * @param {string} [options.passwordField='password'] - Form field name where
 *          the password is found.
 * @param {boolean} [options.passReqToCallback=false] - When `true`, the
 *          `verify` function receives the request object as the first argument,
 *          in accordance with `{@link Strategy~verifyWithReqFn}`.
 * @param {Strategy~verifyFn|Strategy~verifyWithReqFn} verify - Function which
 *          verifies username and password.
 *
 * @example
 * var LocalStrategy = require('passport-local').Strategy;
 *
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
 * @example <caption>Construct strategy using top-level export.</caption>
 * var LocalStrategy = require('passport-local');
 *
 * new LocalStrategy(function(username, password, cb) {
 *   // ...
 * });
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
  
  /** The name of the strategy, which is set to `'local'`.
   *
   * @type {string}
   * @readonly
   */
  this.name = 'local';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

// Inherit from `passport.Strategy`.
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request by verifying username and password.
 *
 * This function is protected, and should not be called directly.  Instead,
 * use `passport.authenticate()` middleware and specify the {@link Strategy#name `name`}
 * of this strategy and any options.
 *
 * @protected
 * @param {http.IncomingMessage} req - The Node.js {@link https://nodejs.org/api/http.html#class-httpincomingmessage `IncomingMessage`}
 *          object.
 * @param {Object} [options]
 * @param {string} [options.badRequestMessage='Missing credentials'] - Message
 *          to display when a request does not include a username or password.
 *          Used in conjunction with `failureMessage` or `failureFlash` options.
 *
 * @example
 * passport.authenticate('local');
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
 * password, and must invoke `cb` to yield the result.
 *
 * @callback Strategy~verifyFn
 * @param {string} username - The username received in the request.
 * @param {string} password - The passport received in the request.
 * @param {function} cb
 * @param {?Error} cb.err - An `Error` if an error occured; otherwise `null`.
 * @param {Object|boolean} cb.user - An `Object` representing the authenticated
 *          user if verification was successful; otherwise `false`.
 * @param {Object} cb.info - Additional application-specific context that will be
 *          passed through for further request processing.
 */

/**
 * Verifies `username` and `password` and yields authenticated user.
 *
 * This function is called by `{@link Strategy}` to verify a username and
 * password when the `passReqToCallback` option is set, and must invoke `cb` to
 * yield the result.
 *
 * @callback Strategy~verifyWithReqFn
 * @param {http.IncomingMessage} req - The Node.js {@link https://nodejs.org/api/http.html#class-httpincomingmessage `IncomingMessage`}
 *          object.
 * @param {string} username - The username received in the request.
 * @param {string} password - The passport received in the request.
 * @param {function} cb
 * @param {?Error} cb.err - An `Error` if an error occured; otherwise `null`.
 * @param {Object|boolean} cb.user - An `Object` representing the authenticated
 *          user if verification was successful; otherwise `false`.
 * @param {Object} cb.info - Additional application-specific context that will be
 *          passed through for further request processing.
 */
