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
      .find({ user: options.user.id })
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

  /**
   * Query the ownership relationship between a user and an object.
   *
   * @returns {Integer}
   *  0   user is the the owner of the object, e.g. user = object.owner;
   *  1   user can reach the owner of the object via one Role
   *  -1 there is no Role subgraph that connects the user to object.owner
   */
  getOwnership: function (user, object) {
    return user.getOwnershipRelation(object);
  },

  /**
   * Given an action, return the CRUD method it maps to.
   */
  getMethod: function (req) {
    return actionMethodMap[req.options.action];
  },

  checkPermissions: function (user, model, method) {
  }
};
