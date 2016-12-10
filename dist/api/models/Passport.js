'use strict';

var _ = require('lodash');
var _super = require('sails-auth/api/models/Passport');

_.merge(exports, _super);
_.merge(exports, {

  autoCreatedBy: false

  // Extend with custom logic here by adding additional fields, methods, etc.

  /**
   * For example:
   *
   * foo: function (bar) {
   *   bar.x = 1;
   *   bar.y = 2;
   *   return _super.foo(bar);
   * }
   */
});