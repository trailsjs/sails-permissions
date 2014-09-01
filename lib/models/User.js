/**
 * @module User
 *
 * @description
 *   A type of Role that can login to the system, own other objects, and
 *   perform actions on objects.
 */
module.exports = {
  attributes: {
    username: {
      type: 'string',
      notNull: true
    },
    email: {
      type: 'string',
      email: true,
      unique: true
    },
    roles: {
      collection: 'Role',
      via: 'users'
    },
    owner: {
      model: 'User',
      notNull: true
    },
    model: {
      model: 'Model',
      notNull: true
    }
  }
};
