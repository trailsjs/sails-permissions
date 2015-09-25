var assert = require('assert');
var request = require('supertest');

var adminAuth = {
  Authorization: 'Basic YWRtaW5AZXhhbXBsZS5jb206YWRtaW4xMjM0'
};

var registeredAuth = {
  Authorization: 'Basic bmV3dXNlcjp1c2VyMTIzNA=='
};

describe('Model Controller', function () {

  describe('User with Admin Role', function () {

    describe('#find()', function () {

      it('should be able to read models', function (done) {

        request(sails.hooks.http.app)
          .get('/model')
          .set('Authorization', adminAuth.Authorization)
          .expect(200)
          .end(function (err, res) {

            var models = res.body;

            assert.equal(models.length, 8);
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

  });

  describe('User with Public Role', function () {

    describe('#find()', function () {

      it('should not be able to read models', function (done) {

        request(sails.hooks.http.app)
          .get('/model')
          .expect(403)
          .end(function (err, res) {

            assert(_.isString(res.body.error));
            done(err);

          });
      });

    });

  });

});


