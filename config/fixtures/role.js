var Promise = require('bluebird');
/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {
  return Promise.all([
    Role.findOrCreate({ name: 'admin' }, { name: 'admin' }),
    Role.findOrCreate({ name: 'registered' }, { name: 'registered' }),
    Role.findOrCreate({ name: 'public' }, { name: 'public' })
  ]);
};
