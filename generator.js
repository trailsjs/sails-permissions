module.exports = require('sails-generate-entities')({
  module: 'sails-permissions',
  id: 'permissions-api',
  statics: [
    'api/models/Model.js',
    'api/models/Permission.js',
    'api/models/Criteria.js',
    'api/models/Role.js',
    'api/models/User.js',
    'api/models/RequestLog.js',
    'api/models/SecurityLog.js',
                                            
    'api/controllers/ModelController.js',
    'api/controllers/PermissionController.js',
    'api/controllers/RoleController.js',
                                            
    'config/permissions.js',

    // sails-auth
    'config/routes/sails-auth.js',
    'config/passport.js',

    'api/controllers/AuthController.js',
    'api/controllers/UserController.js',
    'api/models/Passport.js'
  ],
  classes: [
    'api/services/ModelService.js',
    'api/services/PermissionService.js',
    
    // sails-auth
    'api/services/passport.js',
    'api/services/protocols/local.js',
    'api/services/protocols/oauth.js',
    'api/services/protocols/oauth2.js',
    'api/services/protocols/openid.js'
  ],
  functions: [
    'api/policies/ModelPolicy.js',
    'api/policies/OwnerPolicy.js',
    'api/policies/PermissionPolicy.js',
    'api/policies/RolePolicy.js',
    'api/policies/AuditPolicy.js',
    'api/policies/CriteriaPolicy.js',

    // sails-auth policies
    'api/policies/basicAuth.js',
    'api/policies/passport.js'
  ]
});
