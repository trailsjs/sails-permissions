/**
 * Test starter - with this version of sails.js we can only start one sails server,
 * to solve this problem we use only one before All and after All to start and
 * stop the server
 */
var _ = require('lodash');
var Sails = require('sails');
var testingConfig = require('../config/env/testing');
var path = require('path');
var sails;

before(function(done) {
  this.timeout(30000);

  var config = _.extend(testingConfig, {
    appPath: path.resolve(__dirname, '..')
  })

  Sails.lift(config, function(err, server) {
    global.sails = server;

    if (err) {
      return done(err);
    }
    // here you can load fixtures, etc.
    done(err, sails);
  });

});

after(function(done) {
  global.sails.lower(done);
});
