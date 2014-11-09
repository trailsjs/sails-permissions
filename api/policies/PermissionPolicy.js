var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * PermissionPolicy
 * @depends OwnerPolicy
 * @depends ModelPolicy
 *
 * In order to proceed to the controller, the following verifications
 * must pass:
 * 1. User is logged in (handled previously by sails-auth sessionAuth policy)
 * 2. User has Permission to perform action on Model
 * 3. User has Permission to perform action on Attribute (if applicable)
 * 4. User is satisfactorily related to the Object's owner (if applicable)
 *
 * This policy verifies #1-3 here, before any controller is invoked. However
 * it is not generally possible to determine ownership relationship until after
 * the object has been queried. Verification of #4 
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
module.exports = function PermissionPolicy (req, res, next, error) {
  if (!req.isAuthenticated()) {
    return res.send(400, 'not authenticated');
  }
  var user = req.owner;
  var model = req.model;
  var method = req.options.action;

  sails.log(user.roles);

  Permission.find({
      model: model.id,
      role: _.pluck(user.roles, 'id')
    })
    .then(function (permissions) {
      if (permissions.length === 0) {
        sails.log.warn('AuthorizationPolicy:', 'no permission found');
        sails.log.warn('AuthorizationPolicy:', 'model:', model.identity, '; user:', user.username);
        return res.send(400, 'no permission found');
      }

      var valid = PermissionService.isValid(method, permissions);
      if (!valid) {
        sails.log('AuthorizationPolicy:', 'permission denied');
        return res.send(400, 'permission denied');
      }
      next();
    })
    .catch(next);
};
