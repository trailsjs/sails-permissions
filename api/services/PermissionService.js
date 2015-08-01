var Promise = require('bluebird');
var methodMap = {
  POST: 'create',
  GET: 'read',
  PUT: 'update',
  DELETE: 'delete'
};
var actionMap = {
  create: 'create',
  find: 'read',
  findone: 'read',
  update: 'update',
  destroy: 'delete',
  populate: 'read',
  add: 'update',
  remove: 'update'
};

var findRecords = require('sails/lib/hooks/blueprints/actions/find');
var wlFilter = require('waterline-criteria');

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
   * @param options.action
   * @param options.model
   * @param options.user
   */
  findModelPermissions: function (options) {
    var action = PermissionService.getAction(options);
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
        }).populate('criteria');
      });
  },

  /**
   * Given a list of objects, determine if they all satisfy at least one permission's
   * where clause/attribute blacklist combination
   *
   * @param {Array of objects} objects - The result of the query, or if the action is create,
   * the body of the object to be created
   * @param {Array of Permission objects} permissions - An array of permission objects
   * that are relevant to this particular user query
   * @param {Object} attributes - The body of the request, in an update or create request.
   * The keys of this object are checked against the permissions blacklist
   * @returns boolean - True if there is at least one granted permission that allows the requested action,
   * otherwise false
   */
  hasPassingCriteria: function (objects, permissions, attributes, user) {
    // return success if there are no permissions or objects
    if (_.isEmpty(permissions) || _.isEmpty(objects)) return true;

    if (!_.isArray(objects)) {
        objects = [objects];
    }

    var criteria = permissions.reduce(function (memo, perm) {
      if (perm) {
        if (!perm.criteria || perm.criteria.length==0) {
          // If a permission has no criteria then it passes for all cases
          // (like the admin role)
          memo = memo.concat([{where:{}}]);
        }
        else {
            memo = memo.concat(perm.criteria);
        }
        if (perm.relation === 'owner') {
            perm.criteria.forEach(function (criteria) {
                criteria.owner = true;
            });
        }
        return memo;
      }
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
            var hasOwnership = true; // edge case for scenario where a user has some permissions that are owner based and some that are role based
            if (criteria.owner) {
              hasOwnership = !PermissionService.isForeignObject(user)(obj);
            }
            return match.length === 1 && !hasUnpermittedAttributes && hasOwnership;
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
      'User', options.user.email, 'is not permitted to', options.action, options.model.identity
    ].join(' ');
  },

  /**
   * Given a request, return the CRUD action or controller action it maps
   * to.
   *
   * @param req.options
   *
   * If a standard blueprint action, then translate that blueprint action into a
   * CRUD action. If a custom controller action, then return the name of that action as-is.
   */
  getAction: function (options) {
    var action = actionMap[options.action] || options.action;

    return action;
  },

  /**
   * create a new role
   * @param options
   * @param options.name {string} - role name
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
                    options.users = users;
                });
        }
    });

    ok = ok.then(function (users) {
        return Role.create(options);
    });

    return ok;
  },

  /**
   *
   * @param options {permission object, or array of permissions objects}
   * @param options.role {string} - the role name that the permission is associated with
   * @param options.model {string} - the model name that the permission is associated with
   * @param options.action {string} - the http action that the permission allows
   * @param options.criteria - optional criteria object
   * @param options.criteria.where - optional waterline query syntax object for specifying permissions
   * @param options.criteria.blacklist {string array} - optional attribute blacklist
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
  },

  /**
   * add one or more users to a particular role
   * TODO should this work with multiple roles?
   * @param usernames {string or string array} - list of names of users
   * @param rolename {string} - the name of the role that the users should be added to
   */
  addUsersToRole: function (usernames, rolename) {
    if (_.isEmpty(usernames)) {
       return Promise.reject(new Error('One or more usernames must be provided'));
    }

    if (!_.isArray(usernames)) {
        usernames = [usernames];
    }

    return Role.findOne({name: rolename}).populate('users').then(function (role) {
        User.find({username: usernames}).then(function (users) {
            role.users.add(users);
            return role.save();
        });
    });
  },

  /**
   * remove one or more users from a particular role
   * TODO should this work with multiple roles
   * @params usernames {string or string array} - name or list of names of users
   * @params rolename {string} - the name of the role that the users should be removed from
   */
  removeUsersFromRole: function (usernames, rolename) {
    if (_.isEmpty(usernames)) {
       return Promise.reject(new Error('One or more usernames must be provided'));
    }

    if (!_.isArray(usernames)) {
        usernames = [usernames];
    }

    return Role.findOne({name: rolename}).populate('users').then(function (role) {
        User.find({username: usernames}).then(function (users) {
            // for remove we need to get the ids, cant pass the whole model like add
            var userids = users.map(function (user) { return user && user.id; });
            role.users.remove(userids);
            return role.save();
        });
    });
  },

  /**
   * revoke permission from role
   * @param options
   * @param options.role {string} - the name of the role related to the permission
   * @param options.model {string} - the name of the model for the permission
   * @param options.action {string} - the name of the action for the permission
   * @param options.relation {string} - the type of the relation (owner or role)
   */
  revoke: function (options) {
    var ok = Promise.all([Role.findOne({name: options.role}), Model.findOne({name: options.model})]);
    ok = ok.then(function (result) {
        var role = result[0];
        var model = result[1];
        return Permission.destroy({role: role.id,
            model: model.id,
            action: options.action,
            relation: options.relation
        });
    });

    return ok;
  },

    /**
     * Check if the user (out of role) is granted to perform action on given objects
     * @param objects
     * @param user
     * @param action
     * @param model
     * @param body
     * @returns {*}
     */
  isAllowedToPerformAction: function (objects, user, action, model, body) {
    if (!_.isArray(objects)) {
      return PermissionService.isAllowedToPerformSingle(user.id, action, model, body)(objects);
    }
    return new Promise.map(objects, PermissionService.isAllowedToPerformSingle(user.id, action, model, body));
  },

    /**
     * Resolve if the user have the permission to perform this action
     * @param user
     * @param action
     * @param model
     * @param body
     * @returns {Function}
     */
  isAllowedToPerformSingle: function (user, action, model, body) {
    return function (obj) {
      return new Promise(function (resolve, reject) {
        Model.findOne({
          identity: model
        }).then(function (model) {
          return Permission.find({
            model: model.id,
            action: action,
            relation: 'user',
            user: user
          }).populate('criteria');
        }).then(function (permission) {
          if (permission.length > 0 && PermissionService.hasPassingCriteria(obj, permission, body)) {
            resolve(true);
          } else {
            resolve(false);
          }
        }).catch(reject);
      });
    }
  }
};
