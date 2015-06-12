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
          var permissions = [{ where: {x:2}}];
          assert.equal(sails.services.permissionservice.checkWhereClause(objects, permissions), false);
          done();
      });

      it ('should return an array of items that don\'t match the given criteria, if the criteria has many values for the same key', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var permissions = [{where: {x:2}}, {where: {x:3}}];
          assert.equal(sails.services.permissionservice.checkWhereClause(objects, permissions), false);
          done();
      });

      it ('should return an array of items that don\'t match the given criteria, if the criteria has many values for the same key', function (done) {
          var objects = {x:2}; 
          var permissions = [{where: {x:2}}, {where: {x:3}}];
          assert(sails.services.permissionservice.checkWhereClause(objects, permissions));
          done();
      });

      it ('should return an empty array if there is no criteria', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          assert(sails.services.permissionservice.checkWhereClause(objects));
          done();
      });

      it ('should match without where clause and attributes', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var permissions = [{ attributes: ['x']}];
          assert(sails.services.permissionservice.checkWhereClause(objects, permissions));
          done();
      });

      it ('should match with where clause and attributes', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var permissions = [{ where: { x: { '>': 0} }, attributes: ['x']}];
          assert(sails.services.permissionservice.checkWhereClause(objects, permissions, {x: 5}));
          done();
      });

      it ('should fail with bad where clause and good attributes', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var permissions = [{ where: { x: { '<': 0} }, attributes: ['x']}];
          assert.equal(sails.services.permissionservice.checkWhereClause(objects, permissions, {x: 5}), false);
          done();
      });

      it ('should fail with good where clause and bad attributes', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var permissions = [{ where: { x: { '>': 0} }, attributes: ['y']}];
          assert.equal(sails.services.permissionservice.checkWhereClause(objects, permissions, {x: 5}), false);
          done();
      });

  });

  describe('#hasUnpermittedAttributes', function () {
    it ('should return false if all attributes are permitted', function (done) {
        attributes = { ok: 1, fine: 2 };
        whitelist = ["ok", "alright", "fine"]
        assert.equal(sails.services.permissionservice.hasUnpermittedAttributes(attributes, whitelist), false);
        done();
    });

    it ('should return true if any attributes are not permitted', function (done) {
        attributes = { ok: 1, fine: 2, whatever: 3 };
        whitelist = ["ok", "alright", "fine"]
        assert(sails.services.permissionservice.hasUnpermittedAttributes(attributes, whitelist));
        done();
    }); 

    it ('should return true if any attributes are not permitted', function (done) {
        attributes = { ok: 1, fine: 2, whatever: 3 };
        whitelist = ["ok", "alright", "fine"]
        assert(sails.services.permissionservice.hasUnpermittedAttributes(attributes, whitelist));
        done();
    }); 

    it ('should return false if attributes is empty', function (done) {
        attributes = {};
        whitelist = ["ok", "alright", "fine"]
        assert.equal(sails.services.permissionservice.hasUnpermittedAttributes(attributes, whitelist), false);
        done();
    }); 

    it ('should return true if whitelist is empty', function (done) {
        attributes = { ok: 1, fine: 2, whatever: 3 };
        whitelist = []
        assert.equal(sails.services.permissionservice.hasUnpermittedAttributes(attributes, whitelist), false);
        done();
    }); 

  });

  //TODO: add unit tests for #findTargetObjects()

  //TODO: add unit tests for #findModelPermissions()

});
