/**
 * @module Model
 *
 * @description
 *   Abstract representation of an xTuple domain Model
 */
module.exports = {
  autoPK: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    name: {
      type: 'string',
      notNull: true
    },
    identity: {
      type: 'string',
      notNull: true
    },
    description: {
      type: 'string'
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
