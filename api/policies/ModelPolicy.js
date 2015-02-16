var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Query the Model that is being acted upon, and set it on the req object.
 */
module.exports = function ModelPolicy (req, res, next) {
  //sails.log('ModelPolicy()');
  req.options.modelIdentity = actionUtil.parseModel(req).identity;
  req.options.modelDefinition = sails.models[req.options.modelIdentity];

  if (_.isEmpty(req.options.modelIdentity)) {
    //sails.log('no model identity');
    return next();
  }

  // get the Model from the database which will allow us to relate to Roles
  // and Permissions
  Model.findOne({ identity: req.options.modelIdentity })
    .then(function (model) {
      if (!_.isObject(model)) {
        return next(new Error('Model definition not found: '+ req.options.modelIdentity));
      }

      req.model = model;
      if (req.options.modelDefinition.autoCreatedBy) {
        //req.query.model = model.id;
        _.isObject(req.body) && (req.body.model = model.id);
        //sails.log(
        //'OwnerPolicy hasOwnershipPolicy: false');
      }

      //sails.log('ModelPolicy req.model', req.model);
      next();
    })
    .catch(next);
};
