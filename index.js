'use strict';

var injector = require('sails-inject-models');

module.exports = function (sails) {
  return {
    initialize: function (next) {
      injector.injectApp({
        sails: sails,
        module: module.id
      }, next);
    }
  };
};
