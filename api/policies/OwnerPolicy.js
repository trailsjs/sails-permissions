/**
 * Ensure that the 'owner' property of an Object is set upon creation.
 */
module.exports = function OwnerPolicy (req, res, next) {
  if (!req.user || !req.user.id) return next(new Error('req.user is not set'));

  // set owner on newly created object
  if (req.options.action === 'create') {
    req.body = req.body || { };
    req.body.owner = req.user.id;
  }

  User.findOne(req.user.id)
    .populate('roles')
    .then(function (user) {
      if (!user) {
        return next('could not find user with id "' + req.user.id + '" in database');
      }

      req.owner = user;
      next();
    })
    .catch(next);
};
