/**
 * @module Permission
 *
 * @description
 *   The actions a Role is granted on a particular Model and its attributes
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

module.exports = {
  autoCreatedBy: false,

  description: ['Defines a particular `action` that a `Role` can perform on a `Model`.', 'A `User` can perform an `action` on a `Model` by having a `Role` which', 'grants the necessary `Permission`.'].join(' '),

  attributes: {

    /**
     * The Model that this Permission applies to.
     */
    model: {
      model: 'Model',
      required: true
    },

    action: {
      type: 'string',
      index: true,
      notNull: true,
      /**
       * TODO remove enum and support permissions based on all controller
       * actions, including custom ones
       */
      'enum': ['create', 'read', 'update', 'delete']
    },

    relation: {
      type: 'string',
      'enum': ['role', 'owner', 'user'],
      defaultsTo: 'role',
      index: true
    },

    /**
     * The Role to which this Permission grants create, read, update, and/or
     * delete privileges.
     */
    role: {
      model: 'Role'
    },

    // Validate manually
    //required: true
    /**
     * The User to which this Permission grants create, read, update, and/or
     * delete privileges.
     */
    user: {
      model: 'User'
      // Validate manually
    },

    /**
     * A list of criteria.  If any of the criteria match the request, the action is allowed.
     * If no criteria are specified, it is ignored altogether.
     */
    criteria: {
      collection: 'Criteria',
      via: 'permission'
    }
  },

  afterValidate: [function validateOwnerCreateTautology(permission, next) {
    if (permission.relation == 'owner' && permission.action == 'create') {
      next(new Error('Creating a Permission with relation=owner and action=create is tautological'));
    }

    if (permission.action === 'delete' && _lodash2['default'].filter(permission.criteria, function (criteria) {
      return !_lodash2['default'].isEmpty(criteria.blacklist);
    }).length) {
      next(new Error('Creating a Permission with an attribute blacklist is not allowed when action=delete'));
    }

    if (permission.relation == 'user' && permission.user === "") {
      next(new Error('A Permission with relation user MUST have the user attribute set'));
    }

    if (permission.relation == 'role' && permission.role === "") {
      next(new Error('A Permission with relation role MUST have the role attribute set'));
    }

    next();
  }]
};