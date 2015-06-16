var methodMap = {
  POST: 'create',
  GET: 'read',
  PUT: 'update',
  DELETE: 'delete'
};

var findRecords = require('sails/lib/hooks/blueprints/actions/find');
var wlFilter = require('waterline-criteria');
var Promise = require('bluebird');

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
        }).populate('criteria');
      });
  },

  /**
   * given a list of objects, determine if they all satisfy at least on permission where clause
   */
  checkWhereClause: function (objects, permissions, attributes) {
    // return success if there are no permissions or objects
    if (_.isEmpty(permissions) || _.isEmpty(objects)) return true;

    if (!_.isArray(objects)) {
        objects = [objects];
    }

    var criteria = permissions.reduce(function (memo, perm) {
        if (perm && perm.criteria) {
            memo = memo.concat(perm.criteria);
        }
        return memo;
    }, []);

    if (!_.isArray(criteria)) {
        criteria = [criteria];
    }

    if (_.isEmpty(criteria)) {
        return true;
    }

    // every object must have at least one permission that has a passing criteria and a passing attribute check
    return objects.every(function (obj) {
        return criteria.some(function (criteria) {
            var match = wlFilter([obj], { where: criteria.where }).results;
            var hasUnpermittedAttributes = PermissionService.hasUnpermittedAttributes(attributes, criteria.blacklist);
            return match.length === 1 && !hasUnpermittedAttributes;
        });
    });

  },

  hasUnpermittedAttributes: function (attributes, blacklist) {
    if (_.isEmpty(attributes) || _.isEmpty(blacklist)) {
        return false;
    }
    return _.intersection(Object.keys(attributes), blacklist).length ? true : false;
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
   * create a new role
   * @param name {string} - role name
   * @param options
   * @param options.permissions {permission object, or array of permissions objects}
   * @param options.permissions.model {string} - the name of the model that the permission is associated with
   * @param options.permissions.criteria - optional criteria object
   * @param options.permissions.criteria.where - optional waterline query syntax object for specifying permissions
   * @param options.permissions.criteria.blacklist {string array} - optional attribute blacklist
   * @param options.users {array of user names} - optional array of user ids that have this role
   */
  createRole: function (options) {

   var ok = Promise.resolve();
   var permissions = options.permissions;

   if (!_.isArray(permissions)) {
        permissions = [permissions];
    }


   // look up the model id based on the model name for each permission, and change it to an id
   ok = ok.then(function () {
       return Promise.map(permissions, function (permission) {
            return Model.findOne({name: permission.model})
                .then(function (model) {
                    permission.model = model.id;
                    return permission;
                });
       });
   });

   // look up user ids based on usernames, and replace the names with ids
   ok = ok.then(function (permissions) {
        if (options.users) {
            return User.find({username: options.users})
                .then(function (users) {
                    var userids;
                    if (users) {
                        userids = users.map(function (user) { return user.id; });
                    }
                    options.users = userids;
                });
        }
    });

    ok = ok.then(function (users) {
        return Role.create(options)
    });

    return ok;
  },

  /**
   *
   * @param options {permission object, or array of permissions objects}
   * @param options.role {string} - the role name that the permission is associated with
   * @param options.model {string} - the model name that the permission is associated with
   * @param options.criteria - optional criteria object
   * @param options.criteria.where - optional waterline query syntax object for specifying permissions
   * @param options.criteria.blacklist {string array} - optional attribute blacklist
   * @param options.users {array of user ids} - optional array of user ids that have this role
   */
  grant: function (permissions) {
     if (!_.isArray(permissions)) {
         permissions = [permissions];
     }

     // look up the models based on name, and replace them with ids
     var ok = Promise.map(permissions, function (permission) {
         return Model.findOne({name: permission.model})
             .then(function (model) {
                  permission.model = model.id;
                  return Role.findOne({name: permission.role})
                    .then(function (role) {
                        permission.role = role.id;
                    });
              });
     });

     ok = ok.then(function () {
        return Permission.create(permissions);
     });

     return ok;
  }

};
