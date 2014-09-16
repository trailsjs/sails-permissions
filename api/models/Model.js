/**
 * filename: <% filename %>
 * generator: <% generatorName %>
 * id: <% id %>
 * entity: <% entity %>
 *
 * @module Model
 *
 * @description
 *   Abstract representation of a Waterline Model.
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
    attributes: {
      type: 'json'
    },
    permissions: {
      collection: 'Permission',
      via: 'model',
      dominant: true
    }
  }
};
