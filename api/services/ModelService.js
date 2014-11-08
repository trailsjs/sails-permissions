var pluralize = require('pluralize');

module.exports = {
  /**
   * Return the type of model acted upon by this request.
   */
  getTargetModelName: function (req) {
    if (_.isString(req.options.alias)) {
      sails.log.silly('singularizing', req.options.alias, 'to use as target model');
      return pluralize.singular(req.options.alias);
    }
    else {
      return req.options.model;
    }
  }
};
