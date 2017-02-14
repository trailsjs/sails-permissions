/**
 * PermissionPolicy
 * @depends OwnerPolicy
 * @depends ModelPolicy
 *
 * In order to proceed to the controller, the following verifications
 * must pass:
 * 1. User is logged in (handled previously by sails-auth sessionAuth policy)
 * 2. User has Permission to perform action on Model
 * 3. User has Permission to perform action on Attribute (if applicable) [TODO]
 * 4. User is satisfactorily related to the Object's owner (if applicable)
 *
 * This policy verifies #1-2 here, before any controller is invoked. However
 * it is not generally possible to determine ownership relationship until after
 * the object has been queried. Verification of #4 occurs in RolePolicy.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
module.exports = function (req, res, next) {
  var options = {
    model: req.model,
    method: req.method,
    user: req.user
  };

  if (req.options.unknownModel) {
    return next();
  }

  var promiseAry = [];

  var modelPromise = PermissionService
    .findModelPermissions(options)
    .then(function (permissions) {
      sails.log.silly('PermissionPolicy:', permissions.length, 'permissions grant',
          req.method, 'on', req.model.name, 'for', req.user.username);

      if (!permissions || permissions.length === 0) {
        return res.send(403, { error: PermissionService.getErrorMessage(options) });
      }

      req.permissions = permissions;

    });

  promiseAry.push(modelPromise);

  // If the request action is populate also grab permissions for the model to be populated
  if (req.options.action === 'populate') {

    var populatePromise = PermissionService
      .findModelPermissions(_.merge(req.options,{
        model: req.populateModel,
        user: options.user
      }))
      .then(function (permissions) {
        sails.log.silly('PermissionPolicy:', permissions.length, 'permissions grant',
            PermissionService.getAction(options), 'on', req.populateModel.name, 'for', req.user.username);

        if (!permissions || permissions.length === 0) {
          throw new Error(PermissionService.getErrorMessage(options));
        }

        req.populatePermissions = permissions;

      });

      promiseAry.push(populatePromise);

  }

  Promise.all(promiseAry)
  .then(function() {
    next();
  })
  .catch(function(e) {
    return res.badRequest({error: e.message});
  });
};
