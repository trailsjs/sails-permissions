var pluralize = require('pluralize');

module.exports = {
  getTargetModelName: function (req) {
    if (_.isString(req.options.alias)) {
      return pluralize.singular(req.options.alias);
    }
    else {
      return req.options.model;
    }
  }
};
