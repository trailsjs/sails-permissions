/**
 * @module Model
 *
 * @description
 *   Abstract representation of a Waterline Model.
 */
module.exports = {
  autoPK: true,
  autoCreatedBy: false,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    name: {
      type: 'string',
      notNull: true,
      unique: true
    },
    identity: {
      type: 'string',
      notNull: true
    },
    attributes: {
      type: 'json'
    },
    permissions: {
      collection: 'Permission',
      via: 'model'
    }
  }
};
