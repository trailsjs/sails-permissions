/**
 * @module Role
 *
 * @description
 *   Roles endow Users with Permissions. Exposes Postgres-like API for
 *   resolving granted Permissions for a User.
 *
 * @see <http://www.postgresql.org/docs/9.3/static/sql-grant.html>
 */
'use strict';

module.exports = {
  autoCreatedBy: false,

  description: 'Confers `Permission` to `User`',

  attributes: {
    name: {
      type: 'string',
      index: true,
      notNull: true,
      unique: true
    },
    users: {
      collection: 'User',
      via: 'roles'
    },
    active: {
      type: 'boolean',
      defaultsTo: true,
      index: true
    },
    permissions: {
      collection: 'Permission',
      via: 'role'
    }
  }
};