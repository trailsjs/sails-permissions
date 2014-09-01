describe('sails-permissions', function () {
  var sp = require('./');

  describe('Role', function () {
    var Role = sp.Role;

    describe('#grants()', function () {

    });

    describe('#on()', function () {

    });

    describe('#to()', function () {

    });

    describe('#grants().on().to()', function () {

      it('#grants("create").on("Account").to("admin")', function () {
        var granted = Role.grants('create').on('Account').to({ });

      });

    });

  });

});
