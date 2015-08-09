/**
 * TODO - this is setting createdBy, not owner.
 * The comment below, and the name of this file/function is confusing to me
 * Ensure that the 'owner' property of an Object is set upon creation.
 */
module.exports = function OwnerPolicy (req, res, next) {
  //sails.log('OwnerPolicy()');
  if (!req.user || !req.user.id) {
    req.logout();
    return res.send(500, new Error('req.user is not set'));
  }

  /*
  sails.log('OwnerPolicy user', req.user);
  sails.log('OwnerPolicy method', req.method);
  sails.log('OwnerPolicy req.body', req.body);
  */

  if (req.options.modelDefinition.autoCreatedBy === false) {
    // sails.log('OwnerPolicy hasOwnershipPolicy: false');
    return next();
  }

  if ('POST' == req.method) {
    //req.body || (req.body = { });
    req.body.createdBy = req.user.id;
    req.body.owner = req.user.id;
  }

  //sails.log('OwnerPolicy req.model', req.model);
  next();
};
