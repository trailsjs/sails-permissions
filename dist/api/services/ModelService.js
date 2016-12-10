'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var pluralize = require('pluralize');

module.exports = {
  /**
   * Return the type of model acted upon by this request.
   */
  getTargetModelName: function getTargetModelName(req) {
    // TODO there has to be a more sails-y way to do this without including
    // external modules
    if (_lodash2['default'].isString(req.options.alias)) {
      sails.log.silly('singularizing', req.options.alias, 'to use as target model');
      return pluralize.singular(req.options.alias);
    } else if (_lodash2['default'].isString(req.options.model)) {
      return req.options.model;
    } else {
      return req.model && req.model.identity;
    }
  }
};