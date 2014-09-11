/**
 * Query the User making the current request and set it on the req object.
 */
module.exports = function UserPolicy (req, res, next) {
  next();
};
