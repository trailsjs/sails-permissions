var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * PermissionPolicy
 * @depends OwnerPolicy
 * @depends ModelPolicy
 *
 * In order to proceed to the controller, the following verifications
 * must pass:
 * 1. User is logged in (handled previously by sails-auth sessionAuth policy)
 * 2. User has Permission to perform action on Model
 * 3. User has Permission to perform action on Attribute (if applicable)
 * 4. User is satisfactorily related to the Object's owner (if applicable)
 *
 * This policy verifies #1-3 here, before any controller is invoked. However
 * it is not generally possible to determine ownership relationship until after
 * the object has been queried. Verification of #4 
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
module.exports = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next(new Error('request not authenticated; bailing out of Permissions policy'));
  }

  PermissionService.findPrivilegedRoles({
      model: req.model,
      method: req.method,
      user: req.user
    })
    .then(function (roles) {
      sails.log(roles);

      if (roles.length > 0) {
        next();
      }
    });
};

function bindResponsePolicy (req, res) {
  res._ok = res.ok;

  res.ok = _.bind(responsePolicy, {
    req: req,
    res: res
  });
}

function responsePolicy (_data, options) {
  sails.log('responsePolicy');
  var req = this.req;
  var res = this.res;
  var user = req.owner;
  var method = PermissionService.getMethod(req);

  var data = _.isArray(_data) ? _data : [_data];

  sails.log('data', _data);
  sails.log('options', options);

  // TODO search populated associations
  Promise.bind(this)
    .map(data, function (object) {
      return user.getOwnershipRelation(data);
    })
    .then(function (results) {
      sails.log('results', results);
      var permitted = _.filter(results, function (result) {
        return _.any(req.permissions, function (permission) {
          return permission.permits(result.relation, method);
        });
      });

      if (permitted.length === 0) {
        sails.log('permitted.length === 0');
        return res.send(404);
      }
      else if (_.isArray(_data)) {
        return res._ok(permitted, options);
      }
      else {
        res._ok(permitted[0], options);
      }
    });
}
