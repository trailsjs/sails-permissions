/**
 * @module Permission
 *
 * @description
 *   The actions a Role is granted on a particular Model and its attributes
 */
module.exports = {
  autoCreatedBy: false,

  attributes: {

    /**
     * The Model that this Permission applies to.
     */
    model: {
      model: 'Model',
      required: true
    },

    /**
     * The Role that this Permission grants privileges to
     */
    role: {
      model: 'Role',
      required: true
    },

    create: {
      type: 'boolean',
      defaultsTo: false
    },
    read: {
      type: 'boolean',
      defaultsTo: false
    },
    update: {
      type: 'boolean',
      defaultsTo: false
    },
    delete: {
      type: 'boolean',
      defaultsTo: false
    },

    /**
     * @param ownership
     * @param method
     *
     * permission.grant is a permission mapping for a particular model, e.g.
     *  {
     *    owner: {
     *      '*': true
     *    },
     *    role: {
     *      '*': true,
     *      update: false
     *    },
     *    none: {
     *      // '*': false by default
     *    }
     *  }
     */
    permits: function (ownership, method) {
      /*
      var permittedOwnership = _.dot(this.grant, [ ownership, '*' ]);
      var permittedMethod = _.dot(this.grant, [ ownership, method ]);

      return permittedMethod || (permittedOwnership && permittedMethod !== false);
      */
    }
  },

  /**
   * Perform deep-validation of grant object
  afterValidate: function (permission, next) {
    _.isObject(permission.grant) || (permission.grant = { });

    _.defaults(permission.grant, {
      owner: { },
      role: { },
      none: { }
    });

    var emitter = new EventEmitter();
    var valid = _.similar(Permission.grantTemplate, permission.grant, emitter);
    emitter.once('invalid:keys', function (error) {
      next(new Error('the grant object is missing a required key'));
    });
    emitter.once('invalid:value', function (error) {
      next(new Error('grant key ' + error.key + ' is invalid'));
    });

    if (valid) return next();
  },

  grantTemplate: {
    owner: _.isObject,
    role: _.isObject,
    none: _.isObject
  }
   */
};
