/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util');


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
 * @param {Function} verify
 * @api public
 */
function Strategy(verify) {
  if (!verify) throw new Error('local authentication strategy requires a verify function');
  
  passport.Strategy.call(this);
  this.name = 'local';
  this.verify = verify;
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
  if (!req.body || (!req.body.username || !req.body.password)) {
    return this.fail();
  }
  
  var username = req.body.username;
  var password = req.body.password;
  
  var self = this;
  this.verify(username, password, function(err, user) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(); }
    self.success(user);
  });
}


/**
 * Expose `Strategy`.
 */ 
module.exports = Strategy;
