'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _ = require('lodash');

var grants = {
  admin: [{ action: 'create' }, { action: 'read' }, { action: 'update' }, { action: 'delete' }],
  registered: [{ action: 'create' }, { action: 'read' }],
  'public': [{ action: 'read' }]
};

var modelRestrictions = {
  registered: ['Role', 'Permission', 'User', 'Passport'],
  'public': ['Role', 'Permission', 'User', 'Model', 'Passport']
};

// TODO let users override this in the actual model definition

/**
 * Create default Role permissions
 */
exports.create = function (roles, models, admin, config) {
  return Promise.all([grantAdminPermissions(roles, models, admin, config), grantRegisteredPermissions(roles, models, admin, config)]).then(function (permissions) {
    //sails.log.verbose('created', permissions.length, 'permissions');
    return permissions;
  });
};

function grantAdminPermissions(roles, models, admin, config) {
  var adminRole = _.find(roles, { name: 'admin' });
  var permissions = _.flatten(_.map(models, function (modelEntity) {
    //var model = sails.models[modelEntity.identity];
    grants.admin = _.get(config, 'grants.admin') || grants.admin;

    return _.map(grants.admin, function (permission) {
      var newPermission = {
        model: modelEntity.id,
        action: permission.action,
        role: adminRole.id
      };
      return sails.models.permission.findOrCreate(newPermission, newPermission);
    });
  }));

  return Promise.all(permissions);
}

function grantRegisteredPermissions(roles, models, admin, config) {
  var registeredRole = _.find(roles, { name: 'registered' });
  var basePermissions = [{
    model: _.find(models, { name: 'Permission' }).id,
    action: 'read',
    role: registeredRole.id
  }, {
    model: _.find(models, { name: 'Model' }).id,
    action: 'read',
    role: registeredRole.id
  }, {
    model: _.find(models, { name: 'User' }).id,
    action: 'update',
    role: registeredRole.id,
    relation: 'owner'
  }, {
    model: _.find(models, { name: 'User' }).id,
    action: 'read',
    role: registeredRole.id,
    relation: 'owner'
  }];

  // XXX copy/paste from above. terrible. improve.
  var permittedModels = _.filter(models, function (model) {
    return !_.contains(modelRestrictions.registered, model.name);
  });
  var grantPermissions = _.flatten(_.map(permittedModels, function (modelEntity) {

    grants.registered = _.get(config, 'grants.registered') || grants.registered;

    return _.map(grants.registered, function (permission) {
      return {
        model: modelEntity.id,
        action: permission.action,
        role: registeredRole.id
      };
    });
  }));

  return Promise.all([].concat(basePermissions, _toConsumableArray(grantPermissions)).map(function (permission) {
    return sails.models.permission.findOrCreate(permission, permission);
  }));
}