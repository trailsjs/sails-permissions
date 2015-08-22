/**
 * Test starter - with this version of sails.js we can only start one sails server,
 * to solve this problem we use only one before All and after All to start and
 * stop the server
 */
var Sails = require('sails');
var ConfigOverrides = require('../config/env/testing');
var sails;

before(function(done) {

  this.timeout(30000);

  Sails.lift(ConfigOverrides, function(err, server) {
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
