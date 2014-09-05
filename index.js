/* global Model */

var injector = require('sails-inject');

module.exports = function (sails) {
  return {

    /**
     * Inject models into the sails.js app
     */
    configure: function (next) {
      injector.injectApp({
        sails: sails,
        module: module.id
      }, next);
    },

    /**
     * Setup fixtures
     */
    initialize: function (next) {
      sails.after('hook:orm:loaded', function () {
      });
    }
  };
};

