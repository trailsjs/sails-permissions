var grants = {
  admin: {
    create: true,
    read: true,
    update: true,
    delete: true
  },
  registered: {
    create: true,
    read: true,
    update: false,
    delete: false
  },
  public: {
    create: false,
    read: true,
    update: false,
    delete: false
  }
};

function getRoleGrants (role) {
  return grants[role];
}

/**
 * Create default Role permissions
 */
exports.create = function (roles, models) {
  var permissions = _.flatten(_.map(roles, function (role, name) {
    return _.map(models, function (modelEntity) {
      var model = sails.models[modelEntity.identity];
      return _.defaults({
          model: modelEntity.id,
          role: role.id
        },
        getRoleGrants(role.name, model.grant)
      );
    });
  }));

  return Promise.map(permissions, function (permission) {
    return Permission.create(permission);
  });
};
