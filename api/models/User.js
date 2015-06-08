var _ = require('lodash');
var _super = require('sails-auth/api/models/User');

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
        .catch(next);
    },
    function attachDefaultRole (user, next) {
      Promise.bind({ }, User.findOne(user.id)
        .populate('roles')
        .then(function (user) {
          this.user = user;
          return Role.findOne({ name: 'registered' });
        })
        .then(function (role) {
          this.user.roles.add(role.id);
          return this.user.save();
        })
        .then(function (updatedUser) {
          sails.log.silly('role "registered" attached to user', this.user.username);
          next();
        })
        .catch(next)
      );
    }
  ]
});
