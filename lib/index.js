/**
 * Username and password authentication.
 *
 * The `passport-local` module provides a {@link https://www.passportjs.org/ Passport}
 * strategy for authenticating a username and password.
 *
 * @module passport-local
 */


// Module dependencies.
var Strategy = require('./strategy');

/**
 * Creates a new {@link Strategy} object.
 *
 * The `{@link Strategy}` constructor is a top-level function exported by the
 * `passport-local` module.
 *
 * @example
 * var Strategy = require('passport-local');
 * var strategy = new Strategy(function(username, password, cb) {
 *   // ...
 * });
 */
exports = module.exports = Strategy;

/**
 * Creates a new `{@link Strategy}` object.
 *
 * @example
 * var local = require('passport-local');
 * var strategy = new local.Strategy(function(username, password, cb) {
 *   // ...
 * });
 */
exports.Strategy = Strategy;
