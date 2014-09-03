'use strict';

var assert = require('assert');
var rigger = require('sails-rigged');

describe('sails-permissions', function () {
  var sp = require('./');
  var sails;

  before(function (done) {
    this.timeout(10000);
    rigger.lift('xtuple-api', function (_sails) {
      sails = _sails;
      done();
    });

  });

  describe.skip('Permission', function () {
    describe('#permits()', function () {
      describe('@instance', function () {
        var permission;
        before(function (done) {
          permission = Permission.create({

          });
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
