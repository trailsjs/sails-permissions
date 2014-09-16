var _ = require('lodash');
var _super = require('sails-auth/api/models/User');

_.merge(exports, _super);
_.merge(exports, {
  attributes: {
    roles: {
      collection: 'Role',
      via: 'users'
    }
  }
});
