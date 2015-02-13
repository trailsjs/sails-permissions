var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Query the Model that is being acted upon, and set it on the req object.
 */
module.exports = function ModelPolicy (req, res, next) {
  req.options.modelName = actionUtil.parseModel(req).identity;
  req.options.model = sails.models[req.options.modelName];

  //console.log('model globalId', actionUtil.parseModel(req).globalId);
  //console.log('ignoreOwnership list', sails.config.permissions.ignoreOwnership);

  if (_.contains(sails.config.permissions.ignoreOwnership, req.options.modelName) ||
      req.options.model.enableOwnership === false) {
    req.options.ignoreOwnership = true;
    return next();
  }

  Model.findOne({ identity: req.options.modelName })
    .then(function (model) {
      if (!_.isObject(model)) {
        return next(new Error('Model definition not found: '+ req.options.modelName));
      }

      req.model = model;
      next();
    })
    .catch(next);
};
