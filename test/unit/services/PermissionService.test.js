var assert = require('assert');

describe('Permission Service', function () {

  it('should exist', function () {

    assert.ok(sails.services.permissionservice);
    assert.ok(global.PermissionService);

  });

});
