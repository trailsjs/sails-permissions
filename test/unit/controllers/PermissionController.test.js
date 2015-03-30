var assert = require('assert');
var request = require('supertest');

var adminAuth = {
  Authorization: 'Basic YWRtaW5AZXhhbXBsZS5jb206YWRtaW4xMjM0'
};

var agent
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

});


