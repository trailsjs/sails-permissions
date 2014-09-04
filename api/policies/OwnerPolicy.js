/**
 * Ensure that the 'owner' property of an Object is set upon creation.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
module.exports = function OwnerPolicy (req, res, next) {
  if (req.options.action === 'create') {
    req.owner = req.user.id;
    sails.log('req.body', req.body);
  }
  next();
};
