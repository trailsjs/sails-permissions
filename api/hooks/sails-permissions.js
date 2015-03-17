var permissionPolicies = [
  'passport',
  'sessionAuth',
  'ModelPolicy',
  'OwnerPolicy',
  'PermissionPolicy',
  'RolePolicy'
];
module.exports = function (sails) {
  return {
    configure: function () {
      if (!_.isObject(sails.config.permissions)) sails.config.permissions = { };

      // setup some necessary globals
      // XXX is this really necessary here?
      global.Promise = require('bluebird');
      global._ = require('lodash');
      _.mixin(require('congruence'));

      sails.config.blueprints.populate = false;
    },
    initialize: function (next) {
      if (!validatePolicyConfig(sails)) {
        sails.log.error('One or more required policies are missing.');
        sails.log.error('Please see README for installation instructions: https://github.com/tjwebb/sails-permissions');
        return next(new Error('sails-permissions policies not correctly installed in sails.config.policies.'));
      }

      installModelOwnership(sails.models);

      sails.after('hook:orm:loaded', function () {
        Model.count()
          .then(function (count) {
            if (count == sails.models.length) return next();

            initializeFixtures().then(next);
          })
          .catch(function (error) {
            sails.log.error(error);
            next(error);
          });
      });
    }
  };
};

/**
 * Install the application. Sets up default Roles, Users, Models, and
 * Permissions, and creates an admin user.
 */
function initializeFixtures () {
  return require('../../config/fixtures/model').createModels()
    .bind({ })
    .then(function (models) {
      this.models = models;
      return require('../../config/fixtures/role').create();
    })
    .then(function (roles) {
      this.roles = roles;
      var userModel = _.find(this.models, { name: 'User' });
      return require('../../config/fixtures/user').create(this.roles, userModel);
    })
    .then(function () {
      return User.findOne({ email: sails.config.permissions.adminEmail });
    })
    .then(function (user) {
      //sails.log('admin user created. setting owner...');
      sails.log('sails-permissions: created admin user:', user);
      user.createdBy = user.id;
      user.owner = user.id;
      return user.save();
    })
    .then(function (admin) {
      return require('../../config/fixtures/permission').create(this.roles, this.models, admin);
    })
    .then(function (permissions) {
      return null;
    })
    .catch(function (error) {
      sails.log.error(error);
    });
}

function installModelOwnership (models) {
  _.each(models, function (model) {
    if (model.autoCreatedBy === false) return;

    _.defaults(model.attributes, {
      createdBy: {
        model: 'User',
        index: true,
        notNull: true
      },
      owner: {
        model: 'User',
        index: true
      }
    });
  });
}

function validatePolicyConfig (sails) {
  var policies = sails.config.policies;
  return _.all([
    _.isArray(policies['*']),
    _.intersection(permissionPolicies, policies['*']).length === permissionPolicies.length,
    policies.AuthController['*'] = true
  ]);
}
