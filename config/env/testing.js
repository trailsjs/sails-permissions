var _ = require('lodash');
/**
 * Testing environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  log: { level: 'debug' },
  models: { migrate: 'drop' },
  hooks: { grunt: false },
  port: 1336,
  routes: _.extend(require('sails-auth/config/routes'), {
    "DELETE /role/:parentid/users/:id": {
        controller: 'RoleController',
        action: 'remove',
        alias: 'users'
    }
  })

};
