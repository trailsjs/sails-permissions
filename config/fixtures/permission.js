var Promise = require('bluebird');

var grants = {
  admin: [
    { action: 'create' },
    { action: 'read' },
    { action: 'update' },
    { action: 'delete' }
  ],
  registered: [
    { action: 'create' },
    { action: 'read' }
  ],
  public: [
    { action: 'read' }
  ]
};

var modelRestrictions = {
  registered: [
    'Role',
    'Permission',
    'User',
    'Passport'
  ],
  public: [
    'Role',
    'Permission',
    'User',
    'Model',
    'Passport'
  ]
};

// TODO let users override this in the actual model definition

/**
 * Create default Role permissions
 */
exports.create = function (roles, models, admin) {
  return Promise.all([
    grantAdminPermissions(roles, models, admin),
    grantRegisteredPermissions(roles, models, admin)
  ])
  .then(function (permissions) {
    //sails.log.verbose('created', permissions.length, 'permissions');
    return permissions;
  });
};

function grantAdminPermissions (roles, models, admin) {
  var adminRole = _.find(roles, { name: 'admin' });
  var permissions = _.flatten(_.map(models, function (modelEntity) {
    var model = sails.models[modelEntity.identity];

    return _.map(grants.admin, function (permission) {
      var newPermission = {
        model: modelEntity.id,
        action: permission.action,
        role: adminRole.id,
      };
      return Permission.findOrCreate(newPermission, newPermission);
    });
  }));

  return Promise.all(permissions);
}

function grantRegisteredPermissions (roles, models, admin) {
  var registeredRole = _.find(roles, { name: 'registered' });
  var permissions = [
    {
      model: _.find(models, { name: 'Permission' }).id,
      action: 'read',
      role: registeredRole.id
    },
    {
      model: _.find(models, { name: 'Model' }).id,
      action: 'read',
      role: registeredRole.id
    },
    {
      model: _.find(models, { name: 'User' }).id,
      action: 'update',
      role: registeredRole.id,
      relation: 'owner'
    },
    {
      model: _.find(models, { name: 'User' }).id,
      action: 'read',
      role: registeredRole.id,
      relation: 'owner'
    }
  ];

  return Promise.all(
    _.map(permissions, function (permission) {
      return Permission.findOrCreate(permission, permission);
    })
  );
}
