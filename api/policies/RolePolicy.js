/**
 * RolePolicy
 * @depends PermissionPolicy
 * @depends OwnerPolicy
 * @depends ModelPolicy
 *
 * Verify that User is satisfactorily related to the Object's owner.
 */
module.exports = function(req, res, next) {
  var permissions = req.permissions;
  var relations = _.groupBy(permissions, 'relation');
  var action = PermissionService.getMethod(req.method);

  // continue if there exist role Permissions which grant the asserted privilege
  if (!_.isEmpty(relations.role)) {
    return next();
  }

  // inject 'owner' as a query criterion and continue if we are not mutating
  // an existing object
  if (!_.contains(['update', 'delete'], action)) {
    req.query.owner = req.user.id;
    _.isObject(req.body) && (req.body.owner = req.user.id);
    return next();
  }

  // consolidate the where clauses from all the permissions objects into a single criteria object
  var whereCriteria = permissions.reduce(function(memo, permission) {
    var where = permission.where;

    // permissions are allowed to not have any where clause
    if (!where) {
      return memo;
    }

    _.each(where, function(key) {
      if (memo[key]) {
        memo[key].push(where[key]);
      } else {
        memo[key] = [where[key]];
      }
    });
    return memo;
  }, {});

  // Make sure you have owner permissions for all models if you are mutating an existing object
  PermissionService.findTargetObjects(req)
    .then(function(objects) {
      if (PermissionService.hasForeignObjects(objects, req.user)) {
        return res.badRequest({
          error: 'Cannot perform action [' + action + '] on foreign object'
        });
      }

      if (PermissionService.checkWhereClause(objects, whereCriteria)) {
          return res.badRequest({
              // TODO make the reason for the failure more clear
              error: 'Cannot perform action [' + action + '] due to failing where clause'
          });
      }

      next();
    })
    .catch(next);
};
