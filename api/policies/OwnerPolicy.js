/**
 * Ensure that the 'owner' property of an Object is set upon creation.
 */
module.exports = function OwnerPolicy (req, res, next) {
  if (!req.user || !req.user.id) {
    req.logout();
    return res.send(500, new Error('req.user is not set'));
  }

  if (req.options.modelName === 'user') {
    req.body = req.body || { };
    req.body.id = req.user.id;
    req.query.id = req.user.id;

    if (!_.isEmpty(req.params.id) && req.params.id != req.user.id) {
      return res.send(400, 'you cannot query another user');
    }
  }
  else if (!req.options.ignoreOwnership) {
    req.body = req.body || { };
    req.body.owner = req.user.id;
    req.query.owner = req.user.id;
    req.params.owner = req.user.id;
  }

  next();
};
