/**
 * Create default Role permissions
 */
exports.create = function (roles, models) {
  var permissions = _.flatten(_.map(roles, function (role, name) {
    return _.map(models, function (modelEntity) {
      var model = sails.models[modelEntity.identity];
      return {
        model: modelEntity.id,
        role: role.id,
        grant: buildGrantForRole(role.name, model.grant)
      };
    });
  }));

  return Promise.map(permissions, function (permission) {
    return Permission.create(permission);
  });
};

function buildGrantForRole (roleName, grant) {
  if ('root' === roleName)        return { };
  if ('registered' === roleName)  return grant;
  if ('public' === roleName)      return buildPublicGrant(grant);
  if ('admin' === roleName)       return { create: true, read: true, update: true, delete: true };
}

function buildPublicGrant (grant) {
  return _.merge({ }, grant, {
    others: {
      create: false,
      update: false,
      delete: false
    }
  });
}
