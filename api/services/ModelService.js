var pluralize = require('pluralize');

module.exports = {
  /**
   * Return the type of model acted upon by this request.
   */
  getTargetModelName: function (req) {
    // TODO there has to be a more sails-y way to do this without including
    // external modules
    //
    // TODO if action is 'add' or 'remove' check to see if the user has read access on the relation
    if (_.isString(req.options.alias) && !_.contains(['add','remove','populate'],req.options.action) ) {
      sails.log.silly('singularizing', req.options.alias, 'to use as target model');
      return pluralize.singular(req.options.alias);
    }
    else {
      return req.options.model;
    }
  }
};
