/**
 * Query the Model that is being acted upon, and set it on the req object.
 */
module.exports = function ModelPolicy (req, res, next) {
  var modelCache = sails.hooks['sails-permissions']._modelCache;

  if (_.isUndefined(req.options.model)) {
    req.options.model = sails.config.permissions.controllerMapping[req.options.controller];
  }

  req.model = modelCache[req.options.model];

  if (_.isObject(req.model) && !_.isUndefined(req.model.id)) {
    return next();
  }

  sails.log.warn('Model [', req.options.model, '] not found in model cache');

  // if the model is not found in the cache for some reason, get it from the database
  Model.findOne({ identity: req.options.model})
    .then(function (model) {
      if (!_.isObject(model)) {
        req.options.unknownModel = true;

        if (!sails.config.permissions.allowUnknownModelDefinition) {
          return res.negotiate({ error: 'Model definition not found: '+ req.options.model });
        }
        else {
          model = sails.models[req.options.model];
        }
      }

      req.model = model;
      next();
    })
    .catch(next);
};
