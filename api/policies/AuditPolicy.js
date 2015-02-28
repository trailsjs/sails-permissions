var fnv = require('fnv-plus');
var _ = require('lodash');
var url = require('url');

module.exports = function (req, res, next) {
  var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  req.requestId = fnv.hash(new Date().valueOf() + ipAddress, 128).str();

  sails.models.requestlog.create({
    id: req.requestId,
    ipAddress: ipAddress,
    url: sanitizeRequestUrl(req),
    method: req.method,
    body: _.omit(req.body, 'password'),
    model: req.options.modelIdentity,
    user: req.user.id
  }).exec(_.identity);

  // persist RequestLog entry in the background; continue immediately
  next();
};

function sanitizeRequestUrl (req) {
  var requestUrl = url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl,
    query: req.query
  });

  return requestUrl.replace(/password=\w+&/i, 'password=<hidden>');
}
