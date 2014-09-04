/**
 * Query the Model that is being acted upon, and set it on the req object.
 */
module.exports = function ModelPolicy (req, res, next) {
  var modelName = ModelService.getTargetModelName(req);

  Model.findOne({ name: modelName })
    .then(function (model) {
      if (_.isObject(model)) {
        req.locals.model = model;
        next();
      }
      else {
        next(new Error('Model definition not found in datastore: '+ modelName));
      }
    })
    .catch(next);
};
