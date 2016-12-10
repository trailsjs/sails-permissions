/**
* SecurityLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

'use strict';

module.exports = {
  autoPK: false,
  autoUpdatedAt: false,
  autoCreatedAt: false,

  attributes: {
    request: {
      model: 'RequestLog',
      primaryKey: true
    }
  }
};