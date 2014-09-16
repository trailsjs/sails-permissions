/**
 * Create admin user.
 * @param adminRole - the admin role which grants all permissions
 */
exports.create = function (roles, model, next) {
  sails.log('Installing admin User');
  sails.log('roles', roles);
  sails.log('model', model);
  return sails.services.passport.protocols.local.createUser({
    username: 'admin',
    password: process.env.xtuple_admin_password,
    email: process.env.xtuple_admin_email,
    roles: [ roles.admin.id ],
    owner: -1,
    model: model.id
  }, next);
};
