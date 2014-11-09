var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Query the Model that is being acted upon, and set it on the req object.
 */
module.exports = function ModelPolicy (req, res, next) {
  var modelName = actionUtil.parseModel(req).identity;

  if (_.contains(sails.config.permissions.ignoreModels, modelName)) {
    next();
  }

  Model.findOne({ identity: modelName })
    .then(function (model) {
      if (_.isObject(model)) {
        req.model = model;
        next();
      }
      else {
        next('Model definition not found: '+ modelName);
      }
    })
    .catch(next);
};
