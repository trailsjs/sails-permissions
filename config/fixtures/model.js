/**
 * Creates database representations of the Model types.
 *
 * @public
 */
exports.createModels = function () {
  sails.log('Installing Models');

  var models = _.compact(_.map(sails.controllers, function (controller, name) {
    var model = sails.models[name];
    return model && model.globalId && model.identity && {
      name: model.globalId,
      identity: model.identity,
      description: model.description,
      attributes: model.attributes
    };
  }));

  return Promise.map(models, function (model) {
      return Model.create(model);
    });
};
