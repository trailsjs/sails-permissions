/**
 * @module Permission
 *
 * @description
 *   The actions a Role is granted on a particular Model and its attributes
 */
module.exports = {
  autoPK: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {

    /**
     * The Model that this Permission applies to.
     */
    model: {
      model: 'Model',
      required: true,
    },

    /**
     * The Role that this Permission grants privileges to
     */
    role: {
      model: 'Role',
      via: 'permissions',
    },

    /**
     * Grant object. Defines the actions this permission grants on each
     * attribute of a particular model, as well as on the model itself.
     */
    grant: {
      type: 'json',
      defaultsTo: { }
    }
  },

  beforeValidate: function (permission, next) {
    var emitter = require('events').EventEmitter;
    var valid = _.similar(Permission.grantTemplate, permission.grant);
    valid.on('invalid:keys', function (error) {
      next(new Error('the grant object is missing a required key'));
    });
    valid.on('invalid:value', function (error) {
      next(new Error('grant key ' + error.key + ' is invalid'));
    });

    if (valid) return next();
  },

  grantTemplate: {
    create: _.isBoolean,
    read: _.isBoolean,
    update: _.isBoolean,
    delete: _.isBoolean,

    owner: _.isObject,
    role: _.isObject,
    others: _.isObject
  }
};
