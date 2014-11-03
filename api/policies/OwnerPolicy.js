/**
 * Ensure that the 'owner' property of an Object is set upon creation.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
module.exports = function OwnerPolicy (req, res, next) {
  if (!req.user || !req.user.id) next(new Error('req.user is not set'));

  req.owner = req.user.id;

  // set owner on newly created object
  if (req.options.action === 'create') {
    req.body = req.body || { };
    req.body.owner = req.owner;
  }

  next();
};
