/** @module User */
module.exports = {

  autoPK: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,

  description: [
    'A type of Role that can login to the system, own other objects, and',
    'perform actions on objects'
  ].join(' '),

  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    passports: {
      collection: 'Passport',
      via: 'user'
    },
    roles: {
      collection: 'Role',
      via: 'users'
    },
    contact: {
      model: 'Contact'
    }
  }
};
