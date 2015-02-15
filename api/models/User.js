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

    /**
     * Returns this user's ownership relation to an object. If the user owns the
     * specified object directly, return 'owner'. If the user shares a
     * role with the owner, return 'role'. If the user is not the owner
     * and has no roles in common with the owner of the object, then return
     * 'none'.
     *
     * @return Promise that resolves to 'none', 'owner', or 'role'
     */
    getOwnershipRelation: function (object) {
      if (!object.owner) {
        return {
          relation: 'none',
          object: object
        };
      }
      if (object.owner === this.id) {
        return {
          relation: 'owner',
          object: object
        };
      }

      // query roles for this and object.owner and see if there are any in
      // common
      User.findOne(this.id).populate('roles').bind(this)
        .then(function (user) {
          this.roles = user.roles;
          return User.findOne(object.owner).populate('roles');
        })
        .then(function (owner) {
          var intersection = _.intersection(
            _.pluck(this.roles, 'id'),
            _.pluck(owner.roles, 'id')
          );
          if (intersection.length > 0) {
            return {
              relation: 'role',
              object: object
            };
          }
          else {
            return {
              relation: 'none',
              object: object
            };
          }
        });
    }
  },

  /**
   * Attach default Role to a new User
   */
  afterCreate: function (user, next) {
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
        sails.log('role "registered" attached to user', this.user.username);
        next();
      })
      .catch(next)
    );
  }
});
