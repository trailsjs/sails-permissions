// api/services/protocols/oauth.js

var _ = require('lodash');
var _super = require('sails-auth/api/services/protocols/oauth');

function protocols () { }

protocols.prototype = Object.create(_super);
_.extend(protocols.prototype, {

  // Extend with custom logic here by adding additional fields and methods,
  // and/or overriding methods in the superclass.

  /**
   * For example:
   *
   * foo: function (bar) {
   *   bar.x = 1;
   *   bar.y = 2;
   *   return _super.foo.call(this, bar);
   * }
   */
});

module.exports = new protocols();
