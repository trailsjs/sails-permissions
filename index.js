module.exports = require('sails-generate-entities')({
  module: 'sails-permissions',
  id: 'permissions-api',
  statics: [
    'api/models/Model.js',
    'api/models/Permission.js',
    'api/models/Role.js',
    'api/models/User.js',
                                            
    'api/controllers/ModelController.js',
    'api/controllers/PermissionController.js',
    'api/controllers/RoleController.js',
                                            
    'config/permissions.js'
  ],
  classes: [
    'api/services/ModelService.js',
    'api/services/PermissionService.js'
  ],
  functions: [
    'api/hooks/permissions-api/index.js',
    'api/policies/ModelPolicy.js',
    'api/policies/OwnerPolicy.js'
  ]
});
