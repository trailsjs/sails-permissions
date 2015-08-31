var assert = require('assert');
var request = require('supertest');

var adminAuth = {
  Authorization: 'Basic YWRtaW5AZXhhbXBsZS5jb206YWRtaW4xMjM0'
};

describe('PermissionController', function () {

  var agent;
  before(function(done) {

    agent = request.agent(sails.hooks.http.app);

    agent
      .post('/user')
      .set('Authorization', adminAuth.Authorization)
      .send({
        username: 'newuser1',
        email: 'newuser1@example.com',
        password: 'lalalal1234'
      })
      .expect(200, function (err) {

        if (err)
          return done(err);

        agent
          .post("/permission")
          .set('Authorization', adminAuth.Authorization)
          .send({
            model: 2,
            criteria: {
              where: {
                id: 1
              }
            },
            action: "delete",
            relation: "user",
            user: 2
          })
          .expect(201, function (err) {
            if (err)
              return done(err);

            agent
              .post('/auth/local')
              .send({
                identifier: 'newuser1',
                password: 'lalalal1234'
              })
              .expect(200)
              .end(function (err, res) {

                agent.saveCookies(res);

                return done(err);
              });
          });

      });

  });

  describe('Permission Controller', function () {

    describe('User with Registered Role', function () {

      describe('#find()', function () {

        it('should be able to read permissions', function (done) {

          agent
            .get('/permission')
            .expect(200)
            .end(function (err, res) {

              var permissions = res.body;

              assert.ifError(permissions.error);
              done(err || permissions.error);

            });

        });

      });

    });

    describe('User with Registered Role and granted to delete Permission 1', function () {
      describe("#delete()", function () {
        it('should be able to delete permission 1', function (done) {
          agent
            .delete("/permission/1")
            .expect(200)
            .end(function (err, res) {
                var permissions = res.body;

                assert.ifError(permissions.error);
                done(err || permissions.error);
            });
        });
      });
    });

  });


});
