var _ = require('lodash');
var _super = require('sails-auth/api/models/User');
var Promise = require('bluebird');

_.merge(exports, _super);
_.merge(exports, {
  attributes: {
    roles: {
      collection: 'Role',
      via: 'users',
      dominant: true
    },
    permissions: {
      collection: "Permission",
      via: "user"
    }
  },

  /**
   * Attach default Role to a new User
   */
  afterCreate: [
    function setOwner (user, next) {
      sails.log('User.afterCreate.setOwner', user);
      User
        .update({ id: user.id }, { owner: user.id })
        .then(function (user) {
          next();
        })
        .catch(function (e) {
          sails.log.error(e);
          next(e);
        });
    },
    function attachDefaultRole (user, next) {
      var thisUser;
      Promise.bind({ }, User.findOne(user.id)
        .populate('roles')
        .then(function (user) {
          thisUser = user;
          return Role.findOne({ name: 'registered' });
        })
        .then(function (role) {
          thisUser.roles.add(role.id);
          return thisUser.save();
        })
        .then(function (updatedUser) {
          sails.log.silly('role "registered" attached to user', thisUser.username);
          next();
        })
        .catch(function (e) {
          sails.log.error(e);
          next(e);
        })
      );
    }
  ]
});
