/**
 * Creates database representations of the Model types.
 *
 * @public
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports.createModels = function () {
  sails.log.verbose('sails-permissions: syncing waterline models');

  var models = _lodash2['default'].compact(_lodash2['default'].map(sails.models, function (model, name) {
    return model && model.globalId && model.identity && {
      name: model.globalId,
      identity: model.identity,
      attributes: _lodash2['default'].omit(model.attributes, _lodash2['default'].functions(model.attributes))
    };
  }));

  return Promise.all(_lodash2['default'].map(models, function (model) {
    return sails.models.model.findOrCreate({ name: model.name }, model);
  }));
};