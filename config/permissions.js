global._ = require('lodash');

module.exports.permissions = {
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin1234',

  afterEvent: [],

  allowUnknownModelDefinitions: false
};
