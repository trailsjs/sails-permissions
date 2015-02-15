/**
 * Ensure that the 'owner' property of an Object is set upon creation.
 */
module.exports = function OwnerPolicy (req, res, next) {
  if (!req.user || !req.user.id) {
    req.logout();
    return res.send(500, new Error('req.user is not set'));
  }

  if (!PermissionService.hasOwnershipPolicy(req.options.modelDefinition)) {
    return next();
  }

  if ('POST' == req.method) {
    req.body || (req.body = { });
    req.body.createdBy = req.user.id;
    req.body.owner     = req.user.id;
  }

  next();
};
