var assert = require('assert');

describe('Permission Service', function () {

  it('should exist', function () {

    assert.ok(sails.services.permissionservice);
    assert.ok(global.PermissionService);

  });

  describe('#isForeignObject()', function () {

    it('should return true if object is not owned by the requesting user', function (done) {

      var objectNotOwnedByUser = { owner: 2 };
      var user = 1;

      assert.equal(sails.services.permissionservice.isForeignObject(user)(objectNotOwnedByUser), true);

      done();

    });

    it('should return false if object is owned by the requesting user', function (done) {

      var objectOwnedByUser = { owner: 1 };
      var user = 1;

      assert.equal(sails.services.permissionservice.isForeignObject(user)(objectOwnedByUser), false);

      done();
    });

  });

  describe('#hasForeignObjects()', function () {

    it('should return true if any object is not owned by the requesting user', function (done) {

      var objectOwnedByUser = { owner: 1 };
      var objectNotOwnedByUser = { owner: 2 };
      var user = { id: 1 };

      assert.equal(sails.services.permissionservice.hasForeignObjects([ objectNotOwnedByUser, objectOwnedByUser ], user), true);

      done();
    });

    it('should return false if all objects are owned by the requesting user', function (done) {

      var objectOwnedByUser = { owner: 1 };
      var objectOwnedByUser2 = { owner: 1 };
      var user = { id: 1 };

      assert.equal(sails.services.permissionservice.hasForeignObjects([ objectOwnedByUser2, objectOwnedByUser ], user), false);
      done();

    });

  });

  describe('#hasOwnershipPolicy()', function () {

    it('should return true if object supports ownership policy', function (done) {

      assert.equal(sails.services.permissionservice.hasOwnershipPolicy({ autoCreatedBy: true }), true);
      done();
    });

    it('should return false if object does not support ownership policy', function (done) {

      assert.equal(sails.services.permissionservice.hasOwnershipPolicy({ autoCreatedBy: false }), false);
      done();

    });

  });

  describe('#getMethod()', function () {

    it ('should return \'create\' if POST request', function(done) {

      assert.equal(sails.services.permissionservice.getMethod('POST'), 'create');
      done();

    });

    it ('should return \'update\' if PUT request', function(done) {

      assert.equal(sails.services.permissionservice.getMethod('PUT'), 'update');
      done();

    });

    it ('should return \'read\' if GET request', function(done) {

      assert.equal(sails.services.permissionservice.getMethod('GET'), 'read');
      done();

    });

    it ('should return \'delete\' if DELETE request', function(done) {

      assert.equal(sails.services.permissionservice.getMethod('DELETE'), 'delete');
      done();

    });

  });

  describe('#checkWhereClause()', function () {

      it ('should return an array of items that don\'t match the given criteria', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var criteria = {x:2};
          assert(sails.services.permissionservice.checkWhereClause(objects, criteria));
          done();
      });

      it ('should return an array of items that don\'t match the given criteria, if the criteria has many values for the same key', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var criteria = {x:[2,3]};
          assert(sails.services.permissionservice.checkWhereClause(objects, criteria));
          done();
      });

      it ('should return an array of items that don\'t match the given criteria, if the criteria has many values for the same key', function (done) {
          var objects = {x:2}; 
          var criteria = {x:[2,3]};
          assert.equal(sails.services.permissionservice.checkWhereClause(objects, criteria), false);
          done();
      });

      it ('should return an empty array if there is no criteria', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          assert.equal(sails.services.permissionservice.checkWhereClause(objects), false);
          done();
      })
  });

  //TODO: add unit tests for #findTargetObjects()

  //TODO: add unit tests for #findModelPermissions()

});
