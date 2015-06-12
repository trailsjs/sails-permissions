/**
 * CriteriaPolicy
 * @depends PermissionPolicy
 *
 * Verify that the User fulfills permission 'where' conditions and attribute access restrictions
 */
module.exports = function(req, res, next) {
  var permissions = req.permissions;

  if (_.isEmpty(permissions)) {
    return next();
  }

  var action = PermissionService.getMethod(req.method);

  var body = req.body || req.query;

  // if we are creating, we don't need to query the db, just check the where clause vs the passed in data
  if (action === 'create') {
    if (!PermissionService.checkWhereClause(body, permissions)) {
        return res.badRequest({ error: 'Can\'t create this object, because of failing where clause'});
    }
    return next();
  }
  
  PermissionService.findTargetObjects(req)
    .then(function(objects) {

      // we only care about attribute permissions for create and update
      // create is taken care of in the previous block
      if (_.contains(['delete', 'read'], action)) {
        body = undefined;
      }
    
      if (!PermissionService.checkWhereClause(objects, permissions, body)) {
        return res.badRequest({ error: 'Can\'t ' + action + ', because of failing where clause or attribute permissions'});
      }

      next();
    })
    .catch(next);
};
