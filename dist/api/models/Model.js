/**
 * @module Model
 *
 * @description
 *   Abstract representation of a Waterline Model.
 */
'use strict';

module.exports = {
  description: 'Represents a Waterline collection that a User can create, query, etc.',

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