# passport-local

[Passport](https://www.passportjs.org/) strategy for authenticating with a
username and password.

This module lets you authenticate using a username and password in your Node.js
applications.  By plugging into Passport, password-based sign in can be easily
and unobtrusively integrated into any application or framework that supports
[Connect](https://github.com/senchalabs/connect#readme)-style middleware, including
[Express](https://expressjs.com/).

<div align="center">

:seedling: [Tutorial](https://www.passportjs.org/tutorials/password/?utm_source=github&utm_medium=referral&utm_campaign=passport-local&utm_content=nav-tutorial) •
:dart: [How-to](https://www.passportjs.org/howtos/password/?utm_source=github&utm_medium=referral&utm_campaign=passport-local&utm_content=nav-howto) •
:hammer_and_wrench: [API Reference](https://www.passportjs.org/api/passport-local/1.x/?utm_source=github&utm_medium=referral&utm_campaign=passport-local&utm_content=nav-api) •
:heart: [Sponsors](https://www.passportjs.org/sponsors/?utm_source=github&utm_medium=referral&utm_campaign=passport-local&utm_content=nav-sponsors)

</div>

---

<p align="center">
  <sup>Advertisement</sup>
  <br>
  <a href="https://www.tkqlhce.com/click-8907558-13433666?sid=cuHsLFjXqeyT2iHbYYaHMuw" target="_top">1Password, the only password manager you should trust.</a> Industry-leading security and award winning design.
</p>

---

[![npm](https://img.shields.io/npm/v/passport-local.svg)](https://www.npmjs.com/package/passport-local)
[![build](https://img.shields.io/travis/jaredhanson/passport-local.svg)](https://travis-ci.org/jaredhanson/passport-local)
[![coverage](https://img.shields.io/coveralls/jaredhanson/passport-local.svg)](https://coveralls.io/github/jaredhanson/passport-local)
[...](https://github.com/jaredhanson/passport-local/wiki/Status)

## Install

```bash
$ npm install passport-local
```

## Usage

#### Configure Strategy

The local authentication strategy authenticates users using a username and
password.  The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user.

```js
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
```

##### Available Options

This strategy takes an optional options hash before the function, e.g. `new LocalStrategy({/* options */, callback})`.

The available options are:

* `usernameField` - Optional, defaults to 'username'
* `passwordField` - Optional, defaults to 'password'

Both fields define the name of the properties in the POST body that are sent to the server.

#### Parameters

By default, `LocalStrategy` expects to find credentials in parameters
named username and password. If your site prefers to name these fields
differently, options are available to change the defaults.

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwd',
        session: false
      },
      function(username, password, done) {
        // ...
      }
    ));

When session support is not necessary, it can be safely disabled by
setting the `session` option to false.

The verify callback can be supplied with the `request` object by setting
the `passReqToCallback` option to true, and changing callback arguments
accordingly.

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwd',
        passReqToCallback: true,
        session: false
      },
      function(req, username, password, done) {
        // request object is now first argument
        // ...
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'local'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
```

## Examples

* [express-4.x-local-example](https://github.com/passport/express-4.x-local-example)

  Illustrates how to use the password strategy within an [Express](https://expressjs.com)
  application.

Additional examples can be found on the [wiki](https://github.com/jaredhanson/passport-local/wiki/Examples).

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2015 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
