/**
 * Creates database representations of the Model types.
 *
 * @public
 */
exports.createModels = function () {
  sails.log.verbose('sails-permissions: syncing waterline models');

  var models = _.compact(_.map(sails.models, function (model, name) {
    return model && model.globalId && model.identity && {
      name: model.globalId,
      identity: model.identity,
      attributes: _.omit(model.attributes, _.functions(model.attributes))
    };
  }));

  return Promise.all(_.map(models, function (model) {
    return sails.models.model.findOrCreate({ name: model.name }, model);
  }));
};
