/**
 * Create admin user.
 * @param adminRole - the admin role which grants all permissions
 */
exports.create = function (roles, model, next) {
  sails.log('Installing admin User');
  sails.log('model', model);

  if (_.isEmpty(sails.config.permissions.adminPassword)) {
    throw new Error('sails.config.permissions.adminPassword is not set');
  }
  if (_.isEmpty(sails.config.permissions.adminEmail)) {
    throw new Error('sails.config.permissions.adminEmail is not set');
  }
  return sails.services.passport.protocols.local.createUser({
    username: 'admin',
    password: sails.config.permissions.adminPassword,
    email: sails.config.permissions.adminEmail,
    roles: [ roles.admin.id ],
    owner: -1,
    model: model.id
  }, next);
};
