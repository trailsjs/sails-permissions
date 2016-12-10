/**
 * RolePolicy
 * @depends PermissionPolicy
 * @depends OwnerPolicy
 * @depends ModelPolicy
 *
 * Verify that User is satisfactorily related to the Object's owner.
 * By this point, we know we have some permissions related to the action and object
 * If they are 'owner' permissions, verify that the objects that are being accessed are owned by the current user
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

module.exports = function (req, res, next) {
  var permissions = req.permissions;
  var relations = _lodash2['default'].groupBy(permissions, 'relation');
  var action = PermissionService.getMethod(req.method);

  // continue if there exist role Permissions which grant the asserted privilege
  if (!_lodash2['default'].isEmpty(relations.role)) {
    return next();
  }
  if (req.options.unknownModel) {
    return next();
  }

  /*
   * This block allows us to filter reads by the owner attribute, rather than failing an entire request
   * if some of the results are not owned by the user.
   * We don't want to take this same course of action for an update or delete action, we would prefer to fail the entire request.
   * There is no notion of 'create' for an owner permission, so it is not relevant here.
   */
  if (!_lodash2['default'].contains(['update', 'delete'], action) && req.options.modelDefinition.attributes.owner) {
    // Some parsing must happen on the query down the line,
    // as req.query has no impact on the results from PermissionService.findTargetObjects.
    // I had to look at the actionUtil parseCriteria method to see where to augment the criteria
    req.params.all().where = req.params.all().where || {};
    req.params.all().where.owner = req.user.id;
    req.query.owner = req.user.id;
    _lodash2['default'].isObject(req.body) && (req.body.owner = req.user.id);
  }

  PermissionService.findTargetObjects(req).then(function (objects) {
    // PermissionService.isAllowedToPerformAction checks if the user has 'user' based permissions (vs role or owner based permissions)
    return PermissionService.isAllowedToPerformAction(objects, req.user, action, ModelService.getTargetModelName(req), req.body).then(function (hasUserPermissions) {
      if (hasUserPermissions) {
        return next();
      }
      if (PermissionService.hasForeignObjects(objects, req.user)) {
        return res.send(403, {
          error: 'Cannot perform action [' + action + '] on foreign object'
        });
      }
      next();
    });
  })['catch'](next);
};