/**
* RequestLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

'use strict';

module.exports = {
  autoPK: false,
  autoCreatedBy: false,
  autoUpdatedAt: false,

  attributes: {
    id: {
      type: 'string',
      primaryKey: true
    },
    ipAddress: {
      type: 'string'
    },
    method: {
      type: 'string'
    },
    url: {
      type: 'string',
      url: true
    },
    body: {
      type: 'json'
    },
    user: {
      model: 'User'
    },
    model: {
      type: 'string'
    }
  }
};