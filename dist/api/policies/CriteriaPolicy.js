/**
 * CriteriaPolicy
 * @depends PermissionPolicy
 *
 * Verify that the User fulfills permission 'where' conditions and attribute blacklist restrictions
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var wlFilter = require('waterline-criteria');

module.exports = function (req, res, next) {
  var permissions = req.permissions;

  if (_lodash2['default'].isEmpty(permissions)) {
    return next();
  }

  var action = PermissionService.getMethod(req.method);

  var body = req.body || req.query;

  // if we are creating, we don't need to query the db, just check the where clause vs the passed in data
  if (action === 'create') {
    if (!PermissionService.hasPassingCriteria(body, permissions, body)) {
      return res.send(403, {
        error: 'Can\'t create this object, because of failing where clause'
      });
    }
    return next();
  }

  // set up response filters if we are not mutating an existing object
  if (!_lodash2['default'].contains(['update', 'delete'], action)) {

    // get all of the where clauses and blacklists into one flat array
    // if a permission has no criteria then it is always true
    var criteria = _lodash2['default'].compact(_lodash2['default'].flatten(_lodash2['default'].map(_lodash2['default'].pluck(permissions, 'criteria'), function (c) {
      if (c.length == 0) {
        return [{ where: {} }];
      }
      return c;
    })));

    if (criteria.length) {
      bindResponsePolicy(req, res, criteria);
    }
    return next();
  }

  PermissionService.findTargetObjects(req).then(function (objects) {

    // attributes are not important for a delete request
    if (action === 'delete') {
      body = undefined;
    }

    if (!PermissionService.hasPassingCriteria(objects, permissions, body, req.user.id)) {
      return res.send(403, {
        error: 'Can\'t ' + action + ', because of failing where clause or attribute permissions'
      });
    }

    next();
  })['catch'](next);
};

function bindResponsePolicy(req, res, criteria) {
  res._ok = res.ok;

  res.ok = _lodash2['default'].bind(responsePolicy, {
    req: req,
    res: res
  }, criteria);
}

function responsePolicy(criteria, _data, options) {
  var req = this.req;
  var res = this.res;
  var user = req.owner;
  var method = PermissionService.getMethod(req);
  var isResponseArray = _lodash2['default'].isArray(_data);

  var data = isResponseArray ? _data : [_data];

  // remove undefined, since that is invalid input for waterline-criteria
  data = data.filter(function (item) {
    return item !== undefined;
  });

  var permitted = data.reduce(function (memo, item) {
    criteria.some(function (crit) {
      var filtered = wlFilter([item], {
        where: {
          or: [crit.where || {}]
        }
      }).results;

      if (filtered.length) {

        if (crit.blacklist && crit.blacklist.length) {
          crit.blacklist.forEach(function (term) {
            delete item[term];
          });
        }
        memo.push(item);
        return true;
      }
    });
    return memo;
  }, []);

  if (isResponseArray) {
    return res._ok(permitted, options);
  } else if (permitted.length === 0) {
    sails.log.silly('permitted.length === 0');
    return res.send(404);
  } else {
    res._ok(permitted[0], options);
  }
}