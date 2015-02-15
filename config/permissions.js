global._ = require('lodash');
global._.mixin(require('a.b'));

module.exports.permissions = {
  adminEmail: process.env.ADMIN_EMAIL ,
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD,

  ignoreOwnership: [
    'model',
    'backbonemodel',
    'role',
    'permission'
  ],

  ignorePermissions: [

  ]
};

