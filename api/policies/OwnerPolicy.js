/**
 * Ensure that the 'owner' property of an Object is set upon creation.
 *
 * TODO combine with RolePolicy in 2.0
 */
module.exports = function OwnerPolicy (req, res, next) {
  if (!req.user || !req.user.id) {
    req.logout();
    return res.send(500, new Error('req.user is not set'));
  }

  if (req.model.autoCreatedBy === false) {
    // sails.log('OwnerPolicy hasOwnershipPolicy: false');
    return next();
  }

  if ('POST' == req.method) {
    req.body.createdBy = req.user.id;
  }

  next();
};
