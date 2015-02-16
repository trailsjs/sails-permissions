var methodMap = {
  POST: 'create',
  GET: 'read',
  PUT: 'update',
  DELETE: 'delete'
};

module.exports = {

  /**
   * Query Permissions that grant privileges to a role/user on an action for a
   * model.
   *
   * @param options.method
   * @param options.model
   * @param options.user
   */
  findModelPermissions: function (options) {
    var action = PermissionService.getMethod(options.method);
    var permissionCriteria = {
      model: options.model.id,
      action: action
    };

    //sails.log('req.user', options.user);

    return User.findOne(options.user.id)
      .populate('roles')
      .then(function (user) {
        return Permission.find({
          model: options.model.id,
          action: action,
          role: _.pluck(user.roles, 'id')
        });
      });

    /*
    return Role
      .find({ active: true })
      .populate('permissions', { where: permissionCriteria })
      .populate('users', { where: { id: options.user.id } })
      .then(function (roles) {
        sails.log('matching roles', roles);
        return _.flatten(_.pluck(roles, 'permissions'));
      });
    */
  },

  /**
   * Return true if the specified model supports the ownership policy; false
   * otherwise.
   */
  hasOwnershipPolicy: function (model) {
    //var ignoreModel = _.contains(sails.config.permissions.ignore, model.globalId);
    return model.autoCreatedBy;
  },

  /**
   * Build an error message
   */
  getErrorMessage: function (options) {
    return [
      'User', options.user.email, 'is not permitted to', options.method, options.model.globalId
    ].join(' ');
  },

  /**
   * Given an action, return the CRUD method it maps to.
   */
  getMethod: function (method) {
    return methodMap[method];
  }

};
