var assert = require('assert');
var request = require('supertest');

var adminAuth = {
  Authorization: 'Basic YWRtaW5AZXhhbXBsZS5jb206YWRtaW4xMjM0'
};
var registeredAuth = {
  Authorization: 'Basic bmV3dXNlcjp1c2VyMTIzNA=='
};

describe('User Controller', function () {

  var adminUserId;
  var newUserId;

  describe('User with Admin Role', function () {

    describe('#find()', function () {

      it('should be able to read all users', function (done) {

        request(sails.hooks.http.app)
          .get('/user')
          .set('Authorization', adminAuth.Authorization)
          .expect(200)
          .end(function (err, res) {

            var users = res.body;

            assert.ifError(err);
            assert.ifError(users.error);
            assert.equal(users[0].username, 'admin');
            adminUserId = users[0].id;

            done(err);

          });
      });

    });

    describe('#create()', function () {

      it ('should be able to create a new user', function (done) {

        request(sails.hooks.http.app)
          .post('/user')
          .set('Authorization', adminAuth.Authorization)
          .send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'user1234'
          })
          .expect(200)
          .end(function(err, res) {

            var user = res.body;

            assert.ifError(err);
            assert.ifError(user.error);
            assert.equal(user.username, 'newuser');
            newUserId = user.id;

            done(err);

          });

      });

      it ('should return an error if a user already exists', function (done) {

        request(sails.hooks.http.app)
          .post('/user')
          .set('Authorization', adminAuth.Authorization)
          .send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'user1234'
          })
          .expect(500)
          .end(function(err) {
            done(err);
          });

      });

    });

  });

  describe('User with Registered Role', function () {

    describe('#create()', function () {

      it('should not be able to create a new user', function (done) {

        request(sails.hooks.http.app)
          .post('/user')
          .set('Authorization', registeredAuth.Authorization)
          .send({
            username: 'newuser1',
            email: 'newuser1@example.com',
            password: 'lalalal1234'
          })
          .expect(400)
          .end(function (err, res) {

            var user = res.body;

            assert.ifError(err);
            assert(_.isString(user.error), JSON.stringify(user));

            done(err);

          });

      });

    });

    describe('#update()', function () {

      it('should be able to update themselves', function (done) {

        request(sails.hooks.http.app)
          .put('/user/' + newUserId)
          .set('Authorization', registeredAuth.Authorization)
          .send({ email: 'newuserupdated@example.com' })
          .expect(200)
          .end(function (err, res) {

            var user = res.body;

            assert.ifError(err);
            assert.equal(user.email, 'newuserupdated@example.com');

            done(err);

          });

      });

      it('should not be able to update another user', function (done) {

        request(sails.hooks.http.app)
          .put('/user/' + adminUserId)
          .set('Authorization', registeredAuth.Authorization)
          .send({ email: 'crapadminemail@example.com' })
          .expect(400)
          .end(function (err, res) {

            var user = res.body;

            assert.ifError(err);
            assert(_.isString(user.error), JSON.stringify(user));

            done(err);

          });

      });

    });

  });

});


