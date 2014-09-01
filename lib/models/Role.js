/**
 * @module Role
 *
 * @description
 *   Roles endow Users with Permissions
 */
module.exports = {
  autoPK: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,

  attributes: {
    name: {
      type: 'string',
      index: true,
      notNull: true
    },
    children: {
      collection: 'Role',
      via: 'parents'
    },
    parents: {
      collection: 'Role',
      via: 'children'
    },
    users: {
      collection: 'User',
      via: 'roles'
    },
    permissions: {
      collection: 'Permission',
      via: 'role'
    }
  },

  grants: function (method) {

    return this;
  },

  on: function (model) {

    return this;
  },

  to: function (user) {

    return this;
  }
};
