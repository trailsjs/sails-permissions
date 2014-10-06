var EventEmitter = require('events').EventEmitter;

/**
 * @module Permission
 *
 * @description
 *   The actions a Role is granted on a particular Model and its attributes
 */
module.exports = {
  attributes: {

    /**
     * The Model that this Permission applies to.
     */
    model: {
      model: 'Model',
      required: true,
      //unique: false
    },

    /**
     * The Role that this Permission grants privileges to
     */
    role: {
      model: 'Role',
      required: true,
      //unique: false
    },

    /**
     * Grant object. Defines the actions this permission grants on each
     * attribute of a particular model, as well as on the model itself.
     */
    grant: {
      type: 'json',
      defaultsTo: { }
    },

    /**
     * @param action.method
     * @param action.attribute
     */
    permits: function (action) {
      return _.find([ 'owner', 'role', 'others' ], function (ownership) {
        return this.grant[ownership][action.attribute][action.method];
      }, this);
    }
  },

  beforeValidate: function (permission, next) {
    _.defaults(permission.grant, {
      owner: { },
      role: { },
      others: { }
    });

    var emitter = new EventEmitter();
    var valid = _.similar(Permission.grantTemplate, permission.grant, emitter);
    emitter.on('invalid:keys', function (error) {
      next(new Error('the grant object is missing a required key'));
    });
    emitter.on('invalid:value', function (error) {
      next(new Error('grant key ' + error.key + ' is invalid'));
    });

    if (valid) return next();
  },

  grantTemplate: {
    owner: _.isObject,
    role: _.isObject,
    others: _.isObject
  }
};
