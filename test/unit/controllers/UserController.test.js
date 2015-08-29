var assert = require('assert');
var request = require('supertest');
var _ = require('lodash');

var adminAuth = {
  Authorization: 'Basic YWRtaW5AZXhhbXBsZS5jb206YWRtaW4xMjM0'
};
var registeredAuth = {
  Authorization: 'Basic bmV3dXNlcjp1c2VyMTIzNA=='
};
var newUserAuth = {
  Authorization: 'Basic bmV3dXNlcjp1c2VyMTIzNA=='
};

describe('User Controller', function() {

  var adminUserId;
  var newUserId;
  var roleId;
  var inactiveRoleId;

  describe('User with Admin Role', function() {

    describe('#find()', function() {

      it('should be able to read all users', function(done) {

        request(sails.hooks.http.app)
          .get('/user')
          .set('Authorization', adminAuth.Authorization)
          .expect(200)
          .end(function(err, res) {

            var users = res.body;

            assert.ifError(err);
            assert.ifError(users.error);
            assert.equal(users[0].username, 'admin');
            adminUserId = users[0].id;

            done(err);

          });
      });

      it('should be able to remove a user from a role', function(done) {
        var ok = Role.find({
          name: 'registered'
        });

        ok.then(function(role) {
            request(sails.hooks.http.app)
              .post('/user')
              .set('Authorization', adminAuth.Authorization)
              .send({
                username: 'abouttoberemoveduser',
                email: 'abouttoberemoveduser@example.com',
                password: 'user1234'
              })
              .expect(200)
              .end(function(err, res) {

                assert.ifError(err);
                var user = res.body;
                Role.findOne({
                    name: 'registered'
                  }).populate('users', {
                    id: user.id
                  })
                  .then(function(role) {
                    assert.equal(user.username, 'abouttoberemoveduser');
                    assert(_.contains(_.pluck(role.users, 'id'), user.id));

                    request(sails.hooks.http.app)
                      .delete('/role/' + role.id + '/users/' + user.id)
                      .set('Authorization', adminAuth.Authorization)
                      .expect(200)
                      .end(function(err, res) {
                        // the user id should not be in the list anymore
                        assert(!_.includes(_.pluck(res.users, 'id'), user.id));
                        done();
                      });
                  });

              });
          })
          .catch(done);

      });

    });

    describe('#create()', function() {

      it('should be able to create a new user', function(done) {

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

      it('should return an error if a user already exists', function(done) {

        request(sails.hooks.http.app)
          .post('/user')
          .set('Authorization', adminAuth.Authorization)
          .send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'user1234'
          })
          .expect(400)
          .end(function(err) {
            done(err);
          });

      });

      it('should be able to create a new role, and assign a new user to it', function(done) {

        request(sails.hooks.http.app)
          .post('/role')
          .set('Authorization', adminAuth.Authorization)
          .send({
            name: 'testrole',
            users: [newUserId]
          })
          .expect(201)
          .end(function(err, res) {
            roleId = res.body.id; // 4
            done(err);
          });
      });

      it('should be able to create a new permission for updating active roles', function(done) {
        request(sails.hooks.http.app)
          .get('/model?name=role')
          .set('Authorization', adminAuth.Authorization)
          .expect(200)
          .end(function(err, res) {

            // haha roleModel
            var roleModel = res.body[0];

            request(sails.hooks.http.app)
              .post('/permission')
              .set('Authorization', adminAuth.Authorization)
              .send({
                model: roleModel.id,
                action: 'update',
                role: roleId,
                createdBy: adminUserId,
                criteria: {
                  blacklist: ['id', 'stream'],
                  where: {
                    active: true
                  }
                }
              })
              .expect(201)
              .end(function(err, res) {
                done(err);
              });

          });
      });

      it('should be able to create a new permission for updating owned roles', function(done) {
        request(sails.hooks.http.app)
          .get('/model?name=role')
          .set('Authorization', adminAuth.Authorization)
          .expect(200)
          .end(function(err, res) {

            // haha roleModel
            var roleModel = res.body[0];

            request(sails.hooks.http.app)
              .post('/permission')
              .set('Authorization', adminAuth.Authorization)
              .send({
                model: roleModel.id,
                action: 'update',
                role: roleId,
                createdBy: adminUserId,
                criteria: {
                  blacklist: ['id']
                },
                relation: 'owner'
              })
              .expect(201)
              .end(function(err, res) {
                done(err);
              });

          });
      });

      it('should be able to create a new role and set it as inactive', function(done) {
        request(sails.hooks.http.app)
          .post('/role')
          .set('Authorization', adminAuth.Authorization)
          .send({
            name: 'inactiveRole',
            users: [newUserId],
            active: false
          })
          .expect(201)
          .end(function(err, res) {
            inactiveRoleId = res.body.id;
            done(err);
          });
      });

      it('should be able to create a read permission with a where clause for roles and a blacklist', function(done) {

        request(sails.hooks.http.app)
          .get('/model?name=role')
          .set('Authorization', adminAuth.Authorization)
          .expect(200)
          .end(function(err, res) {

            // haha roleModel
            var roleModel = res.body[0];

            request(sails.hooks.http.app)
              .post('/permission')
              .set('Authorization', adminAuth.Authorization)
              .send({
                model: roleModel.id,
                action: 'read',
                role: roleId,
                createdBy: adminUserId,
                criteria: {
                  where: {
                    active: true
                  },
                  blacklist: ['name', 'createdAt']
                }
              })
              .expect(201)
              .end(function(err, res) {
                done(err);
              });
          });
      });

      it('should be able to create a read permission with a where clause for a role that should filter out all results', function(done) {

        request(sails.hooks.http.app)
          .get('/model?name=permission')
          .set('Authorization', adminAuth.Authorization)
          .expect(200)
          .end(function(err, res) {

            var permissionModel = res.body[0];

            request(sails.hooks.http.app)
              .post('/permission')
              .set('Authorization', adminAuth.Authorization)
              .send({
                model: permissionModel.id,
                action: 'read',
                role: roleId,
                createdBy: adminUserId,
                criteria: {
                  where: {
                    id: {
                      '>': 99999
                    }
                  }
                }
              })
              .expect(201)
              .end(function(err, res) {
                done(err);
              });
          });
      });

    });


  });

  describe('User with Registered Role', function() {

    describe('#create()', function() {

      it('should not be able to create a new user', function(done) {

        request(sails.hooks.http.app)
          .post('/user')
          .set('Authorization', registeredAuth.Authorization)
          .send({
            username: 'newuser1',
            email: 'newuser1@example.com',
            password: 'lalalal1234'
          })
          .expect(400)
          .end(function(err, res) {

            var user = res.body;

            assert.ifError(err);
            assert(_.isString(user.error), JSON.stringify(user));

            done(err);

          });

      });

    });

    describe('#update()', function() {

      it('should be able to update themselves', function(done) {

        request(sails.hooks.http.app)
          .put('/user/' + newUserId)
          .set('Authorization', registeredAuth.Authorization)
          .send({
            email: 'newuserupdated@example.com'
          })
          .expect(200)
          .end(function(err, res) {

            var user = res.body;

            assert.ifError(err);
            assert.equal(user.email, 'newuserupdated@example.com');

            done(err);

          });

      });

      it('should be able to update role name', function(done) {
        // it should be able to do this, because an earlier test set up the role and permission for it
        request(sails.hooks.http.app)
          .put('/role/' + roleId)
          .set('Authorization', newUserAuth.Authorization)
          .send({
            name: 'updatedName'
          })
          .expect(200)
          .end(function(err, res) {
            assert.ifError(err);
            assert.equal(res.body.name, 'updatedName');
            done(err);

          });

      });

      it('should not be able to update role id', function(done) {
        // it should be able to do this, because an earlier test set up the role and permission for it
        request(sails.hooks.http.app)
          .put('/role/' + roleId)
          .set('Authorization', newUserAuth.Authorization)
          .send({
            id: 99
          })
          .expect(400)
          .end(function(err, res) {
            assert(res.body.hasOwnProperty('error'));
            assert.ifError(err);
            done(err);

          });

      });

      it('should not be able to update role name when role is inactive', function(done) {
        // attribute is ok but where clause fails
        request(sails.hooks.http.app)
          .put('/role/' + inactiveRoleId)
          .set('Authorization', newUserAuth.Authorization)
          .send({
            name: 'updatedInactiveName'
          })
          .expect(400)
          .end(function(err, res) {
            assert(res.body.hasOwnProperty('error'));
            assert.ifError(err);
            done(err);

          });
      });


      // this test depends on a previous test that set a permission with a particular where clause/blacklist
      it('should read only active roles, and should not have blacklisted attributes', function(done) {

        request(sails.hooks.http.app)
          .get('/role')
          .set('Authorization', newUserAuth.Authorization)
          .send({
            name: 'updatedInactiveName'
          })
          .expect(200)
          .end(function(err, res) {
            res.body.forEach(function(role) {
              assert(!role.hasOwnProperty('name'));
              assert(!role.hasOwnProperty('createdAt'));
              assert(role.active);
            });
            done(err);

          });
      });

      it('should have filtered out all of the permissions results', function(done) {

        request(sails.hooks.http.app)
          .get('/permission')
          .set('Authorization', newUserAuth.Authorization)
          .send({
            name: 'updatedInactiveName'
          })
          .expect(404)
          .end(function(err, res) {
            done(err);
          });
      });

      it('should not be able to update another user', function(done) {

        request(sails.hooks.http.app)
          .put('/user/' + adminUserId)
          .set('Authorization', registeredAuth.Authorization)
          .send({
            email: 'crapadminemail@example.com'
          })
          .expect(400)
          .end(function(err, res) {

            var user = res.body;

            assert.ifError(err);
            assert(_.isString(user.error), JSON.stringify(user));

            done(err);

          });

      });


      it('should not be able to read another user', function(done) {

        request(sails.hooks.http.app)
          .get('/user/' + adminUserId)
          .set('Authorization', registeredAuth.Authorization)
          .expect(400)
          .end(function(err, res) {
            var user = res.body;

            assert.ifError(err);
            assert(_.isString(user.error), JSON.stringify(user));

            done(err);

          });

      });

      it('should not be able to read all users', function(done) {

        request(sails.hooks.http.app)
          .get('/user/')
          .set('Authorization', registeredAuth.Authorization)
          .expect(200)
          .end(function(err, res) {
            var users = res.body;

            assert.ifError(err);
            assert(users.length == 1);

            done(err);

          });

      });

    });

  });

});
