/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://links.sailsjs.org/docs/config/bootstrap
 */
module.exports.bootstrap = function (next) {
  'use strict';

  var models = _.filter(sails.controllers, function (controller, name) {
    var model = sails.models[name];
    return model && model.globalId && model.identity;
  });

  Model.count()
    .then(function (count) {
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
};

/**
 * Install the application. Sets up default Roles, Users, Models, and
 * Permissions, and creates an admin user.
 */
function initializeFixtures (next) {
  var roles, models;

  sails.log('Creating models');
  require('./fixtures/model').createModels()
    .then(function (_models) {
      models = _models;
      sails.log('Creating roles');
      return require('./fixtures/role').create();
    })
    .then(function (_roles) {
      roles = _roles;
      sails.log('Creating permissions');
      return require('./fixtures/permission').create(roles, models);
    })
    .then(function (permissions) {
      var model = _.find(models, { name: 'User' });
      sails.log('Creating admin user');
      return require('./fixtures/user').create(roles, model, function (err, user) {
        if (err) return next(err);
        user.owner = user.id;
        user.save().then(function (user) {
          next();
        });
      });
    })
    .catch(function (error) {
      sails.log.error(error);
      next(error);
    });
}
