/**
 * Creates default Role structure
 * + root
 * |-- public
 * |-- registered
 * |-- admin
 *
 * @public
 */
exports.create = function () {
  sails.log('Installing roles');
  var root;

  return Role
    .create({ name: 'root' })
    .then(function (_root) {
      root = _root;
      return [
        Role.create({ name: 'public', parents: [ root.id ] }),
        Role.create({ name: 'registered', parents: [ root.id ] }),
        Role.create({ name: 'admin', parents: [ root.id ] })
      ];
    })
    .spread(function (publicRole, registeredRole, adminRole) {
      return {
        root: root,
        public: publicRole,
        registered: registeredRole,
        admin: adminRole
      };
    });
};
