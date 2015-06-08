var methodMap = {
  POST: 'create',
  GET: 'read',
  PUT: 'update',
  DELETE: 'delete'
};

var findRecords = require('sails/lib/hooks/blueprints/actions/find');

module.exports = {

  /**
   * Given an object, or a list of objects, return true if the list contains
   * objects not owned by the specified user.
   */
  hasForeignObjects: function (objects, user) {
    if (!_.isArray(objects)) {
      return PermissionService.isForeignObject(user.id)(objects);
    }
    return _.any(objects, PermissionService.isForeignObject(user.id));
  },

  /**
   * Return whether the specified object is NOT owned by the specified user.
   */
  isForeignObject: function (owner) {
    return function (object) {
      //sails.log('object', object);
      //sails.log('object.owner: ', object.owner, ', owner:', owner);
      return object.owner !== owner;
    };
  },

  /**
   * Find objects that some arbitrary action would be performed on, given the
   * same request.
   *
   * @param options.model
   * @param options.query
   *
   * TODO this will be less expensive when waterline supports a caching layer
   */
  findTargetObjects: function (req) {
    return new Promise(function (resolve, reject) {
      findRecords(req, {
        ok: resolve,
        serverError: reject
      });
    });
  },

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

    return User.findOne(options.user.id)
      .populate('roles')
      .then(function (user) {
        return Permission.find({
          model: options.model.id,
          action: action,
          or: [
            {user: user.id},
            {role: _.pluck(user.roles, 'id')}
          ]
        });
      });
  },

  /**
   * Return true if the specified model supports the ownership policy; false
   * otherwise.
   */
  hasOwnershipPolicy: function (model) {
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
  },

  /**
   * Check if the user (out of role) is granted to perform action on given objects
   * @param objects
   * @param user
   * @param action
   * @param model
   * @returns {*}
   */
  isAllowedToPerformAction: function (objects, user, action, model) {
    if (!_.isArray(objects)) {
      return PermissionService.isAllowedToPerformSingle(user.id, action, model)(objects);
    }
    return new Promise.map([objects], PermissionService.isAllowedToPerformSingle(user.id, action, model));
  },

  /**
   * Resolve if the user have the permission to perform this action
   * @param user
   * @param action
   * @param model
   * @returns {Function}
   */
  isAllowedToPerformSingle: function (user, action, model) {
    return function (obj) {
      return new Promise(function (resolve, reject) {
        Model.findOne({
          identity: model
        }).then(function (model) {
          return Permission.find({
            model: model.id,
            object: obj.id,
            action: action,
            relation: 'user',
            user: user
          });
        }).then(function (permission) {
          if (permission.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }).catch(reject);
      });
    }
  }
};
