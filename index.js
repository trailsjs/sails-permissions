'use strict';

var injector = require('sails-inject-models');

module.exports = function (sails) {
  return {
    initialize: function (next) {
      sails.log.verbose('sails-permissions: injecting models');

      injector.inject(sails, [
        { name: 'Role',       module: require('./lib/models/Role') },
        { name: 'Permission', module: require('./lib/models/Permission') },
        { name: 'User',       module: require('./lib/models/User') },
        { name: 'Model',      module: require('./lib/models/Model') }
      ], next);
    }
  };
};
