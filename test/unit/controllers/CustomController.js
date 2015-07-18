var assert = require('assert');
var request = require('supertest');

var adminAuth = {
  Authorization: 'Basic YWRtaW5AZXhhbXBsZS5jb206YWRtaW4xMjM0'
};

describe('CustomController', function () {
  var agent;
  before(function () {
    agent = request.agent(sails.hooks.http.app);

    sails.config.permissions.controllerMapping = {
      CustomController: 'Model'
    };
  });

  it('should be able to invoke custom controller action', function (done) {
    agent
      .get('/custom/test')
      .set('Authorization', adminAuth.Authorization)
      .expect(200)
      .end(function (err, res) {
        console.log(res.body);
        done();
      });

  });
});
