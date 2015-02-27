var fnv = require('fnv-plus');
var _ = require('lodash');

module.exports = function (req, res, next) {
  var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  req.requestId = fnv.hash(new Date().valueOf() + ipAddress, 128).str();
  sails.log('req.requestId', req.requestId);

  sails.models.requestlog.create({
    id: req.requestId,
    ipAddress: ipAddress,
    url: (req.protocol + '://' + req.get('host') + req.originalUrl)
      .replace(/password=\w+&/i, 'password=<hidden>'),
    method: req.method,
    params: req.params,
    query: _.omit(req.query, 'password'),
    body: _.omit(req.body, 'password'),
    model: req.options.modelIdentity,
    user: req.user.id
  }).exec(_.identity);

  // persist RequestLog entry in the background; continue immediately
  next();

};
