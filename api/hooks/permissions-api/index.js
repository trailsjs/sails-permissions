var _ = require('lodash');

module.exports = function (sails) {
  return {
    configure: function () {

    },
    initialize: function (next) {

      sails.after('hook:orm:loaded', function () {
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
            // FIXME https://github.com/balderdashy/waterline/issues/630
            sails.log.warn(error);
            initializeFixtures(next);
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
      sails.log('Creating permissions');
      return require('../../../config/fixtures/permission').create(roles, models);
    })
    .then(function (permissions) {
      var model = _.find(models, { name: 'User' });
      sails.log('Creating admin user');
      return require('../../../config/fixtures/user').create(roles, model, function (err, user) {
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
