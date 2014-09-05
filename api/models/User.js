module.exports = {
  attributes: {
    roles: {
      collection: 'Role',
      via: 'users'
    },
    model: {
      model: 'Model',
      notNull: true
    }
  }
};
