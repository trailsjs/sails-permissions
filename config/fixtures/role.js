/**
 * Creates default Roles
 *
 * @public
 */
exports.create = function () {
  return Promise.all([
    Role.create({ name: 'admin' }),
    Role.create({ name: 'registered' }),
    Role.create({ name: 'public' })
  ]);
};
