describe('sails-permissions', function () {
  var sp = require('./');

  describe('Permission', function () {
    describe('#permits()', function () {
      describe('@instance', function () {
        var permission;
        before(function (done) {
          permission = Permission.create({
          });
        });
        it('should return the correct owner if the action is permitted', function (done) {

        });
        it('should return null if no ownership relation permits the action', function (done) {

        });
      });
      describe('@static', function () {
        it('should return the correct owner if the action is permitted', function (done) {

        });
        it('should return null if no ownership relation permits the action', function (done) {

        });
      });

    });

  });

  describe.skip('Role', function () {
    var Role = sp.Role;

  });

});
