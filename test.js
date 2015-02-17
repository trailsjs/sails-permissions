'use strict';

var path = require('path');
var assert = require('assert');
var SailsApp = require('sails').Sails;
var request = require('request');

describe('sails-permissions', function () {
  var adminAuth = {
    Authorization: 'Basic YWRtaW5AZXhhbXBsZS5jb206YWRtaW4xMjM0'
  };
  var registeredAuth = {
    Authorization: 'Basic bmV3dXNlcjp1c2VyMTIzNA=='
  };
  var newUser = {
    username: 'newuser',
    email: 'newuser@example.com',
    password: 'user1234'
  };
  var url = 'http://localhost:1337';
  var app = new SailsApp();
  var sails;

  var config = {
    hooks: {
      grunt: false
    },
    //log: { level: 'warn' }
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

  describe('PermissionService', function () {
    it('should exist', function () {
      assert.ok(sails.services.permissionservice);
      assert.ok(global.PermissionService);
    });
  });

  describe('Roles', function () {
    var newUserId = -1;
    var adminUserId = -1;
    describe('@admin', function () {
      it('should be ALLOWED to #read User', function (done) {
        var options = {
          method: 'GET',
          url: url + '/user',
          json: true,
          headers: adminAuth
        };
        request(options, function (err, res, users) {
          assert.ifError(err);
          assert.ifError(users.error);
          assert.equal(users[0].username, 'admin');
          adminUserId = users[0].id;
          done(err);
        });
      });
      it('should be ALLOWED to #create User', function (done) {
        var options = {
          method: 'POST',
          url: url + '/user',
          body: newUser,
          json: true,
          headers: adminAuth
        };
        request(options, function (err, res, user) {
          assert.ifError(err);
          assert.ifError(user.error);
          newUserId = user.id;
          assert.equal(user.username, 'newuser');
          done(err);
        });
      });
      it('should be ALLOWED to #read Model', function (done) {
        var options = {
          url: url + '/model',
          json: true,
          headers: adminAuth
        };
        request(options, function (err, res, models) {
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
    describe('@registered', function () {
      it('should be NOT ALLOWED to #create User', function (done) {
        var options = {
          method: 'POST',
          url: url + '/user',
          body: {
            username: 'newuser1',
            email: 'newuser1@example.com',
            password: 'lalalal1234'
          },
          json: true,
          headers: registeredAuth
        };
        request(options, function (err, res, user) {
          assert.ifError(err);
          assert(_.isString(user.error), JSON.stringify(user));
          done(err);
        });
      });
      it('should be NOT ALLOWED to #update User (username=admin)', function (done) {
        var options = {
          method: 'PUT',
          url: url + '/user/' + adminUserId,
          body: {
            email: 'crapadminemail@example.com',
          },
          json: true,
          headers: registeredAuth
        };
        request(options, function (err, res, user) {
          assert.ifError(err);
          assert(_.isString(user.error), JSON.stringify(user));
          done(err);
        });
      });
      it('should be ALLOWED to #update User (relation=owner)', function (done) {
        var options = {
          method: 'PUT',
          url: url + '/user/' + newUserId,
          body: {
            // the policy will insert owner: newUserId automatically
            email: 'newuserupdated@example.com'
          },
          json: true,
          headers: registeredAuth
        };
        request(options, function (err, res, user) {
          assert.ifError(err);
          assert.equal(user.email, 'newuserupdated@example.com');
          done(err);
        });
      });
    });
    describe('@public', function () {
      it('should be NOT ALLOWED to #read Model', function (done) {
        var options = {
          url: url + '/model',
          json: true,
          headers: registeredAuth
        };
        request(options, function (err, res, body) {
          assert(_.isString(body.error));
          done(err);
        });
      });
    });
  });

});
