'use strict';

var _ = require('lodash');
var path = require('path');

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
  models: {
    migrate: 'drop',
    connection: 'testing'
  },
  connections: {
    testing: {
      adapter: 'waterline-postgresql'
    }
  },
  hooks: { grunt: false },
  port: 1336,
  routes: {
    "DELETE /role/:parentid/users/:id": {
      controller: 'RoleController',
      action: 'remove',
      alias: 'users'
    }
  }
};