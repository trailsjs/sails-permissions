/**
 * Ensure that the 'owner' property of an Object is set upon creation.
 */
module.exports = function OwnerPolicy (req, res, next) {
  if (!req.user || !req.user.id) return next(new Error('req.user is not set'));

  if (req.options.modelName === 'user') {
    req.body = req.body || { };
    req.body.id = req.user.id;
    req.query.id = req.user.id;
  }
  else if (!req.options.ignoreOwnership) {
    req.body = req.body || { };
    req.body.owner = req.user.id;
    req.query.owner = req.user.id;
  }

  next();

  /*
  User.findOne(req.user.id)
    .populate('roles')
    .then(function (user) {
      if (!user) {
        return next(new Error('could not find user with id "' + req.user.id + '" in database'));
      }

      req.owner = user;
      next();
    })
    .catch(next);
  */
};
