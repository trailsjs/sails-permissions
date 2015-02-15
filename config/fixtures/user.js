/**
 * Create admin user.
 * @param adminRole - the admin role which grants all permissions
 */
exports.create = function (roles, userModel, next) {
  if (_.isEmpty(sails.config.permissions.adminUsername)) {
    throw new Error('sails.config.permissions.adminUsername is not set');
  }
  if (_.isEmpty(sails.config.permissions.adminPassword)) {
    throw new Error('sails.config.permissions.adminPassword is not set');
  }
  if (_.isEmpty(sails.config.permissions.adminEmail)) {
    throw new Error('sails.config.permissions.adminEmail is not set');
  }
  return new Promise(function (resolve, reject) {
    User.findOne({ username: 'admin' })
      .then(function (user) {
        if (user) return next(null, user);

        sails.log('admin user does not exist; creating...');
        return sails.services.passport.protocols.local.createUser({
          username: sails.config.permissions.adminUsername,
          password: sails.config.permissions.adminPassword,
          email: sails.config.permissions.adminEmail,
          roles: [ _.find(roles, { name: 'admin' }).id ],
          createdBy: -1,
          model: userModel.id
        }, function (error, user) {
          if (error) return reject(error);
          resolve(user);
        });
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
