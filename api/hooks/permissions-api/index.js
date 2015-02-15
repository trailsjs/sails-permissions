module.exports = function (sails) {
  return {
    configure: function () {
      sails.log.info('configuring sails-permissions...');
      if (!_.isObject(sails.config.permissions)) sails.config.permissions = { };

      // setup some necessary globals
      // XXX is this really necessary here?
      global.Promise = require('bluebird');
      global._ = require('lodash');
      _.mixin(require('congruence'));
    },
    initialize: function (next) {
      installModelOwnership(sails.models);

      sails.after('hook:orm:loaded', function () {
        sails.log.info('initializing sails-permissions...');

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
  //sails.log('Initializing sails-permissions fixtures');
  return require('../../../config/fixtures/model').createModels()
    .bind({ })
    .then(function (models) {
      this.models = models;
      return require('../../../config/fixtures/role').create();
    })
    .then(function (roles) {
      this.roles = roles;
      return require('../../../config/fixtures/permission').create(this.roles, this.models);
    })
    .then(function (permissions) {
      var userModel = _.find(this.models, { name: 'User' });
      return require('../../../config/fixtures/user').create(this.roles, userModel);
    })
    .then(function (user) {
      sails.log('admin user created. setting owner...');
      user.createdBy = user.id;
      user.owner = user.id;
      return user.save();
    })
    .then(function (user) {
      return null;
    })
    .catch(function (error) {
      sails.log.error(error);
      next(error);
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
        index: true,
        notNull: true
      }
    });
  });
}
