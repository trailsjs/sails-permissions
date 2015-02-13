/**
 * @module Role
 *
 * @description
 *   Roles endow Users with Permissions. Exposes Postgres-like API for
 *   resolving granted Permissions for a User.
 *
 * @see <http://www.postgresql.org/docs/9.3/static/sql-grant.html>
 */
module.exports = {
  autoPK: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,

  attributes: {
    name: {
      type: 'string',
      index: true,
      notNull: true,
      unique: true
    },
    children: {
      collection: 'Role',
      via: 'parent'
    },
    parent: {
      model: 'Role'
    },
    users: {
      collection: 'User',
      via: 'roles'
    },
    active: {
      type: 'boolean',
      index: true,
      defaultsTo: true
    },
    permissions: {
      collection: 'Permission',
      via: 'role'
    },

    /**
     * Grant a Permission to a Role.
     *
     * @example
     *    Role.grant({
     *      ownership: [ 'owner', 'role' ],
     *      methods: [ 'create', 'read', 'update' ],
     *      model: 47,
     *      attribute: 'name'
     *    });
     */
    grant: function (permissions) {
      var grant = PermissionService.createGrant(permissions);

      return Permission
        .findOne({ model: permissions.model, role: this.id })
        .then(function (permission) {
          if (!permission) {
            return Permission.create({
              model: permissions.model,
              role: role.id,
              grant: grant
            });
          }
          else {
            _.merge(permission.grant, grant);
            return permission.save();
          }
        });
    },

    /**
     * Return whether the specified User action is permitted by this Role for
     * the specified Model.
     *
     * @param action.model
     * @param action.method
     * @param action.attribute
     *
     * @return the ownership required to assert the permission, or null if
     * no ownership level grants this User action.
     */
    permits: function (action) {
      return Permission
        .findOne({ model: action.model, role: this.id })
        .then(function (permission) {
          if (!permission) return false;

          return permission.permits(action);
        });
    }
  }
};
