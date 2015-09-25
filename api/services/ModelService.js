var pluralize = require('pluralize');

module.exports = {
  /**
   * Return the type of model acted upon by this request.
   */
  getTargetModelName: function (req) {
    // TODO there has to be a more sails-y way to do this without including
    // external modules
    if (_.isString(req.options.alias)) {
      sails.log.silly('singularizing', req.options.alias, 'to use as target model');
      return pluralize.singular(req.options.alias);
    } else if (_.isString(req.options.model)) {
      return req.options.model;
    } else {
        return req.model && req.model.identity;
    }
  }
};
