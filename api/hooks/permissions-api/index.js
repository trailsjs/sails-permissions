module.exports = function (sails) {
  return {
    configure: function () {
      if (!_.isObject(sails.config.permissions)) sails.config.permissions = { };

      // setup some necessary globals
      global.Promise = require('bluebird');
      global._ = require('lodash');
      _.mixin(require('congruence'));

    },
    initialize: function (next) {
      sails.after('hook:orm:loaded', function () {
        var models = _.filter(sails.controllers, function (controller, name) {
          var model = sails.models[name];
          return model && model.globalId && model.identity;
        });

        Model.find({ limit: 999 })
          .then(function (found) {
            var count = found ? found.length : 0;
            if (count < models.length) {
              sails.log('Expecting', models.length, 'models, found', count);
              sails.log('Installing fixtures');
              initializeFixtures(next);
            }
            else {
              next();
            }
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
