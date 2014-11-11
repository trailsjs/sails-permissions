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
      installModelOwnership(sails.models);

      sails.after('hook:orm:loaded', function () {
        sails.log('initializing sails-permissions...');

        var sailsModels = _.filter(sails.controllers, function (controller, name) {
          var model = sails.models[name];
          return model && model.globalId && model.identity;
        });

        Model.find({ limit: 999 })
          .then(function (models) {
            var count = models ? models.length : 0;
            if (count < sailsModels.length) {
              sails.log('Expecting', sailsModels.length, 'models, found', count);
              sails.log('Installing fixtures');
              return initializeFixtures(next);
            }

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
  var missingOwner = _.filter(models, function (model) {
    return _.isUndefined(sails.models[model.identity].attributes.owner);
  });
  var warnings = _.difference(_.pluck(missingOwner, 'name'), ignoreModels);

  if (warnings.length) {
    sails.log.warn('these models do not support ownership, and are unusable by the permissions-api:', warnings);
  }
}

function installModelOwnership (models) {
  if (sails.config.permissions.enableOwnership === false) return;

  var ignoreModels = [
    'BackboneModel',
    'Model',
    'Role',
    'Passport',
    'Permission',
    'User'
  ];

  _.each(models, function (model) {
    if (model.enableOwnership === false) return;
    if (_.contains(ignoreModels, model.globalId)) return;

    sails.log('enabling ownership on', model.globalId);
    _.defaults(model.attributes, {
      owner: {
        model: 'User',
        index: true,
        notNull: true
      }
    });
  });
}
