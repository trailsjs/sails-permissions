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
          role: _.pluck(user.roles, 'id')
        });
      });
  },

  /**
   * given a list of objects, determine if any of them fail the given where clause
   */
  checkWhereClause: function (objects, criteria) {
    // return success if there is no criteria
    if (_.isEmpty(criteria)) return false;

    // criteria can be something like {stream: [1,2], active: true}
    // objects = [{stream: 1, active: false}]
    var criteriaKeys = Object.keys(criteria);

    function checkCriteriaKeys (object) {
        var objectFails = false;
        criteriaKeys.some(function (criteriaKey) {
            var whereCriteria = criteria[criteriaKey];
            var objectValue = object[criteriaKey];

            if (_.isArray(whereCriteria)) {
                // what about more complex queries, i.e. when the objectValue is an array or an object
                if (!_.includes(whereCriteria, objectValue)) {
                   objectFails = true; 
                   return true;
                }
            } else if (whereCriteria !== objectValue) {
                objectFails = true;
                return true;
            }
        });
        return objectFails;
    }

    if (!_.isArray(objects)) {
        return checkCriteriaKeys(objects, criteria); 
    }

    return _.any(objects, checkCriteriaKeys);
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
  }
};
