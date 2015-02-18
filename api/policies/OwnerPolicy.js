/**
 * Ensure that the 'owner' property of an Object is set upon creation.
 */
module.exports = function OwnerPolicy (req, res, next) {
  //sails.log('OwnerPolicy()');
  if (!req.user || !req.user.id) {
    req.logout();
    return res.send(500, new Error('req.user is not set'));
  }

  if (!req.options.modelDefinition.autoCreatedBy) {
    //sails.log('OwnerPolicy hasOwnershipPolicy: false');
    return next();
  }

  if ('POST' == req.method) {
    //req.body || (req.body = { });
    req.body.createdBy = req.user.id;
    //sails.log('OwnerPolicy req.body', req.body);
  }

  //sails.log('OwnerPolicy req.model', req.model);
  next();
};
