/**
 * @module Permission
 *
 * @description
 *   The actions a Role is granted on a particular Model and its attributes
 */
module.exports = {

  description: [
    'Defines a particular `action` that a `Role` can perform on a `Model`.',
    'A `User` can perform an `action` on a `Model` by having a `Role` which',
    'grants the necessary `Permission`.'
  ].join(' '),

  attributes: {

    /**
     * The Model that this Permission applies to.
     */
    model: {
      model: 'Model',
      required: true
    },

    /**
     * id of particular object/record (of type 'model') that this Permission
     * applies to.
     *
     * TODO dormant. enable in future release
     */
    object: {
      type: 'integer',
      defaultsTo: -1,
      index: true
    },

    /**
     * attribute of model that this Permission governs.
     *
     * TODO dormant. enable in future release
     */
    attribute: {
      type: 'string',
      defaultsTo: null,
      index: true
    },

    action: {
      type: 'string',
      index: true,
      notNull: true,
      /**
       * TODO remove enum and support permissions based on all controller
       * actions, including custom ones
       */
      enum: [
        'create',
        'read',
        'update',
        'delete'
      ]
    },

    relation: {
      type: 'string',
      enum: [
        'role',
        'owner'
      ],
      defaultsTo: 'role',
      index: true
    },

    /**
     * The Role to which this Permission grants create, read, update, and/or
     * delete privileges.
     */
    role: {
      model: 'Role',
      required: true
    }
  },

  afterValidate: [
    function validateOwnerCreateTautology (permission, next) {
      if (permission.relation == 'owner' && permission.action == 'create') {
        next(new Error('Creating a Permission with relation=owner and action=create is tautological'));
      }
      next();
    }
  ]
};
