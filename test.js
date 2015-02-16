'use strict';

var path = require('path');
var assert = require('assert');
var SailsApp = require('sails').Sails;
var request = require('request');

describe('sails-permissions', function () {
  var authHeader = {
    Authorization: 'Basic YWRtaW5AZXhhbXBsZS5jb206YWRtaW4xMjM0',
  };
  var url = 'http://localhost:1337';
  var app = new SailsApp();
  var sails;

  var config = {
    hooks: {
      grunt: false
    }
  };

  before(function (done) {
    this.timeout(10000);
    app.lift(config, function (error, _sails) {
      if (error) {
        sails.log.error(error);
        return done(error);
      }
      sails = _sails;
      done();
    });
  });

  describe('Models', function () {
    var options = {
      url: url + '/model',
      json: true
    };
    it('should deny unauthenticated request', function (done) {
      request(options, function (err, res, body) {
        assert(_.isString(body.error));
        done(err);
      });
    });
    it('should return models to authenticated "admin" user', function (done) {
      var url = _.extend({ headers: authHeader }, options);
      request(url, function (err, res, models) {
        assert.ifError(models.error);
        assert.equal(models.length, 4);
        assert.equal(_.intersection(_.pluck(models, 'name'), [
          'Model',
          'Permission',
          'Role',
          'User'
        ]).length, 4);

        done(err || models.error);
      });

    });
  });

  describe('PermissionService', function () {
    it('should exist', function () {
      assert.ok(sails.services.permissionservice);
      assert.ok(global.PermissionService);
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

});
