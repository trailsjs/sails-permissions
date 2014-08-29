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
     * 'The Model that this Permission applies to.'
     */
    model: {
      model: 'Model',
      required: true,
    },

    /**
     * 'The Role that this Permission grants privileges to'
     */
    role: {
      model: 'Role',
      via: 'permissions',
    },
    /**
     * Grant object. Defines the actions this permission grants on each',
     * attribute of a particular model, as well as on the model itself.'
     */
    grant: {
      type: 'json',
      defaultsTo: { }
    }
  }
};
