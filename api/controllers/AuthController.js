/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var passport = require('passport');

var AuthController = {

  /*
  login: function (req, res) {
    var strategies = sails.config.passport, providers  = {};

    // Get a list of available providers for use in your templates.
    Object.keys(strategies).forEach(function (key) {
      if (key === 'local') return;

      providers[key] = {
        name : strategies[key].name,
        slug : key
      };
    });

    // Render the `auth/login.ext` view
    /*
    res.view({
      providers : providers,
      errors    : req.flash('error')
    });

    //res.redirect('/login.html');
  },
    */

  /**
   * Log out a user and return them to the homepage
   *
   * Passport exposes a logout() function on req (also aliased as logOut()) that
   * can be called from any route handler which needs to terminate a login
   * session. Invoking logout() will remove the req.user property and clear the
   * login session (if any).
   *
   * For more information on logging out users in Passport.js, check out:
   * http://passportjs.org/guide/logout/
   *
   * @param {Object} req
   * @param {Object} res
   */
  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },

  /**
   * Render the registration page
   *
   * Just like the login form, the registration form is just simple HTML:
   *
      <form role="form" action="/auth/local/register" method="post">
        <input type="text" name="username" placeholder="Username">
        <input type="text" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign up</button>
      </form>
   *
   * @param {Object} req
   * @param {Object} res
   */
  register: function (req, res) {
    res.view({
      errors: req.flash('error')
    });
  },

  /**
   * Create a third-party authentication endpoint
   *
   * @param {Object} req
   * @param {Object} res
   */
  provider: function (req, res) {
    passport.endpoint(req, res);
  },

  /**
   * Create a authentication callback endpoint
   *
   * This endpoint handles everything related to creating and verifying Pass-
   * ports and users, both locally and from third-aprty providers.
   *
   * Passport exposes a login() function on req (also aliased as logIn()) that
   * can be used to establish a login session. When the login operation
   * completes, user will be assigned to req.user.
   *
   * For more information on logging in users in Passport.js, check out:
   * http://passportjs.org/guide/login/
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: function (req, res) {
    function tryAgain () {
      // If an error was thrown, redirect the user to the login which should
      // take care of rendering the error messages.
      req.flash('form', req.body);
      res.redirect(req.param('action') === 'register' ? '/register' : '/login');
    }

    passport.callback(req, res, function (err, user) {
      if (err) {
        sails.log.error(err);
        return tryAgain();
      }

      req.login(user, function (loginErr) {
        if (loginErr) {
          sails.log.error(loginErr);
          return tryAgain();
        }
        res.redirect('/home');
      });
    });
  }
};

module.exports = AuthController;
