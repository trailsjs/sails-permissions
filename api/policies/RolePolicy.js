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

  // Make sure you have owner permissions for all models if you are mutating an existing object
  PermissionService.findTargetObjects(req)
    .then(function (objects) {
      this.objects = objects;
      return PermissionService.isAllowedToPerformAction(this.objects, req.user, action, ModelService.getTargetModelName(req), req.body);
    })
    .then(function(canPerform) {
      if (PermissionService.hasForeignObjects(objects, req.user) && !canPerform) {
        return res.badRequest({
          error: 'Cannot perform action [' + action + '] on foreign object'
        });
      }

      next();
    })
    .catch(next);
};
