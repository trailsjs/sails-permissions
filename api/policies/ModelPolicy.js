var _ = require('lodash');

/**
 * Simplified version of sails/lib/hooks/blueprints/actionUtil
 * see: https://github.com/balderdashy/sails/blob/b4eed1775d01f436b263362180eb3f8447af1b87/lib/hooks/blueprints/actionUtil.js#L302
 */
function parseModel (req) {
  return req.options.model || req.options.controller
}

/**
 * Query the Model that is being acted upon, and set it on the req object.
 */
module.exports = function ModelPolicy (req, res, next) {
  var modelCache = sails.hooks.permissions._modelCache;
  req.options.modelIdentity = parseModel(req);

  if (_.isEmpty(req.options.modelIdentity)) {
    return next();
  }

  req.options.modelDefinition = sails.models[req.options.modelIdentity];
  req.model = modelCache[req.options.modelIdentity];

  if (_.isObject(req.model) && !_.isNull(req.model.id)) {
    return next();
  }

  sails.log.warn('Model [', req.options.modelIdentity, '] not found in model cache');

  // if the model is not found in the cache for some reason, get it from the database
  Model.findOne({ identity: req.options.modelIdentity })
    .then(function (model) {
      if (!_.isObject(model)) {
        req.options.unknownModel = true;

        model = sails.models[req.options.modelIdentity];
      }

      req.model = model;
      next();
    })
    .catch(next);
};
