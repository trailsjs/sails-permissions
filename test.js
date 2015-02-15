'use strict';

var path = require('path');
var assert = require('assert');
var SailsApp = require('sails').Sails;
var request = require('request');

describe('sails-permissions', function () {
  var sp = require('./');
  var app = new SailsApp();

  var config = {
    hooks: {
      grunt: false
    }
  };

  before(function (done) {
    this.timeout(30000);
    app.load(config, function (error, sails) {
      if (error) {
        console.error(error);
        return done(error);
      }
      app = sails;
      done();
    });

  });

  describe.skip('Permission', function () {
    describe('#permits()', function () {
      describe('@instance', function () {
        var permission;
        before(function (done) {
          done();
        });
        it('should return the correct owner if the action is permitted', function (done) {

          done();
        });
        it('should return null if no ownership relation permits the action', function (done) {

          done();
        });
      });
      describe('@static', function () {
        it('should return the correct owner if the action is permitted', function (done) {

          done();
        });
        it('should return null if no ownership relation permits the action', function (done) {

          done();
        });
      });

    });

  });

  describe.skip('Role', function () {
    var Role = sp.Role;

  });

});
