module.exports = function (sails) {
  return {
    configure: function () {
      sails.log('configuring sails-permissions...');
      if (!_.isObject(sails.config.permissions)) sails.config.permissions = { };

      // setup some necessary globals
      global.Promise = require('bluebird');
      global._ = require('lodash');
      _.mixin(require('congruence'));

    },
    initialize: function (next) {
      sails.after('hook:orm:loaded', function () {
        sails.log('initializing sails-permissions...');

        var models = _.filter(sails.controllers, function (controller, name) {
          var model = sails.models[name];
          return model && model.globalId && model.identity;
        });

        Model.find({ limit: 999 })
          .then(function (models) {
            var count = models ? models.length : 0;
            if (count < models.length) {
              sails.log('Expecting', models.length, 'models, found', count);
              sails.log('Installing fixtures');
              return initializeFixtures(next);
            }

            logModelOwnership(models);
            next();
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
function initializeFixtures (next) {
  var roles, models;

  sails.log('Creating models');
  require('../../../config/fixtures/model').createModels()
    .then(function (_models) {
      models = _models;
      return require('../../../config/fixtures/role').create();
    })
    .then(function (_roles) {
      roles = _roles;
      return require('../../../config/fixtures/permission').create(roles, models);
    })
    .then(function (permissions) {
      var model = _.find(models, { name: 'User' });
      return require('../../../config/fixtures/user').create(roles, model, function (err, user) {
        if (err) {
          sails.log.error(err);
          return next(err);
        }
        sails.log('admin user created. setting owner...');
        user.owner = user.id;
        user.save()
          .then(function (user) {
            sails.log('admin user done. next...');
            next();
          })
          .catch(function (error) {
            sails.log('admin user fail');
            sails.log.error(error);
            next(error);
          });
      });
    })
    .catch(function (error) {
      sails.log.error(error);
      next(error);
    });
}

/**
 * Log the models that do not support user ownership
 */
function logModelOwnership (models) {
  var ignoreModels = [
    'BackboneModel',
    'Model',
    'Role',
    'Passport',
    'Permission',
    'User'
  ];
  var missingOwner = _.filter(models, function (model) {
    return _.isUndefined(sails.models[model.identity].attributes.owner);
  });
  var warnings = _.difference(_.pluck(missingOwner, 'name'), ignoreModels);

  if (warnings.length) {
    sails.log.warn('the following models do not support ownership:', warnings);
  }
  sails.warn('these models do not support the permissions-api');
}
