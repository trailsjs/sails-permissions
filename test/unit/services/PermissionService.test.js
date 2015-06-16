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
          var permissions = [{ criteria: { where: {x:2}}}];
          assert.equal(sails.services.permissionservice.checkWhereClause(objects, permissions), false);
          done();
      });

      it ('should return an array of items that don\'t match the given criteria, if the criteria has many values for the same key', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var permissions = [{ criteria: {where: {x:2}}}, {criteria: {where: {x:3}}}];
          assert.equal(sails.services.permissionservice.checkWhereClause(objects, permissions), false);
          done();
      });

      it ('should return an array of items that don\'t match the given criteria, if the criteria has many values for the same key', function (done) {
          var objects = {x:2}; 
          var permissions = [{criteria: {where: {x:2}}}, {criteria: {where: {x:3}}}];
          assert(sails.services.permissionservice.checkWhereClause(objects, permissions));
          done();
      });

      it ('should return an empty array if there is no criteria', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          assert(sails.services.permissionservice.checkWhereClause(objects));
          done();
      });

      it ('should match without where clause and blacklist', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var permissions = [{ criteria: { blacklist: ['x']}}];
          assert(sails.services.permissionservice.checkWhereClause(objects, permissions));
          done();
      });

      it ('should match with where clause and attributes', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var permissions = [{ criteria: { where: { x: { '>': 0} }, blacklist: ['y']}}];
          assert(sails.services.permissionservice.checkWhereClause(objects, permissions, {x: 5}));
          done();
      });

      it ('should fail with bad where clause and good blacklist', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var permissions = [{criteria: { where: { x: { '<': 0} }, blacklist: ['y']}}];
          assert.equal(sails.services.permissionservice.checkWhereClause(objects, permissions, {x: 5}), false);
          done();
      });

      it ('should fail with good where clause and bad blacklist', function (done) {
          var objects = [{x:1}, {x:2}, {x:3}]; 
          var permissions = [{ criteria: { where: { x: { '>': 0} }, blacklist: ['x']}}];
          assert.equal(sails.services.permissionservice.checkWhereClause(objects, permissions, {x: 5}), false);
          done();
      });

  });

  describe('#hasUnpermittedAttributes', function () {
    it ('should return true if any of the attributes are in the blacklist', function (done) {
        var attributes = { ok: 1, fine: 2 };
        var blacklist = ["ok", "alright", "fine"]
        assert(sails.services.permissionservice.hasUnpermittedAttributes(attributes, blacklist));
        done();
    });

    it ('should return true if any attributes are not permitted', function (done) {
        var attributes = { ok: 1, fine: 2, whatever: 3 };
        var blacklist = ["ok", "alright", "fine"]
        assert(sails.services.permissionservice.hasUnpermittedAttributes(attributes, blacklist));
        done();
    }); 

    it ('should return false if none of the keys are in the blacklist', function (done) {
        var attributes = { ok: 1, fine: 2, whatever: 3 };
        var blacklist = ["notallowed"]
        assert.equal(sails.services.permissionservice.hasUnpermittedAttributes(attributes, blacklist), false);
        done();
    }); 

    it ('should return false if there are no attributes', function (done) {
        var attributes = {};
        var blacklist = ["ok", "alright", "fine"]
        assert.equal(sails.services.permissionservice.hasUnpermittedAttributes(attributes, blacklist), false);
        done();
    }); 

    it ('should return false if blacklist is empty', function (done) {
        var attributes = { ok: 1, fine: 2, whatever: 3 };
        var blacklist = []
        assert.equal(sails.services.permissionservice.hasUnpermittedAttributes(attributes, blacklist), false);
        done();
    }); 

  });

  describe ('role and permission helpers', function () {
    it ('should create a role', function (done) {
        sails.services.permissionservice.createRole({ name: 'fakeRole', permissions: [{model: 'Permission', action: 'delete', relation: 'role', }], users: ['newuser'] })
        .then(function (result) {
            done()
        });
    });

    it ('should create a permission', function (done) {
        sails.services.permissionservice.grant([{role: 'fakeRole', model: 'Permission', action: 'create', relation: 'role', criteria: { where: { x: 1}, blacklist: ['y'] }},
           {role: 'fakeRole', model: 'Role', action: 'update', relation: 'role', criteria: { where: { x: 1}, blacklist: ['y'] }}])
        .then(function (result) {
          done();
        });
    });

  });
  //TODO: add unit tests for #findTargetObjects()

  //TODO: add unit tests for #findModelPermissions()

});
