var methodMap = {
  POST: 'create',
  GET: 'read',
  PUT: 'update',
  DELETE: 'delete'
};

module.exports = {

  /**
   * Find all roles that permit the specified method on the specified model.
   */
  findPrivilegedRoles: function (options) {
    var permissionCriteria = {
      model: options.model.id
    };
    permissionCriteria[methodMap[options.method]] = true;

    return Role
      .find({ active: true })
      .populate('users', { where: { id: options.user.id } })
      .populate('permissions', { where: permissionCriteria });
  },

  /**
   * Return true if the specified model supports the ownership policy; false
   * otherwise.
   */
  hasOwnershipPolicy: function (model) {
    var ignorePermission = _.contains(sails.config.permissions.ignore, model.globalId);
    return ignorePermission || (model.autoCreatedBy === false);
  },

  getErrorMessage: function (options) {
    return [
      'User', options.user.email, 'is not permitted to', options.method, options.model.globalId
    ].join(' ');
  }

};
