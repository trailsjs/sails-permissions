var Promise = require('bluebird');
/**
 * Creates database representations of the Model types.
 *
 * @public
 */
exports.createModels = function () {
  sails.log('sails-permissions: syncing waterline models');

  var models = _.compact(_.map(sails.models, function (model, name) {
    //var conf = controller._config;
    //var modelName = conf && conf.model && conf.model.name;
    //var model = sails.models[modelName || name];

    console.log('model.globalId', model.globalId)
    console.log('model.identity', model.identity)

    return model && model.globalId && model.identity && {
      name: model.globalId,
      identity: model.identity,
      attributes: _.omit(model.attributes, _.functions(model.attributes))
    };
  }));

  console.log('fixture models', models)

  return Promise.map(models, function (model) {
    return sails.models.model.findOrCreate({ name: model.name }, model);
  });
};
