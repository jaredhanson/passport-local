/**
 * Module dependencies.
 */
var Strategy = require('./strategy')
  , BadRequestError = require('./errors/badrequesterror');


/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;

/**
 * Export errors.
 */
exports.BadRequestError = BadRequestError;
