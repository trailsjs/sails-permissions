/**
 * RolePolicy
 * @depends PermissionPolicy
 * @depends OwnerPolicy
 * @depends ModelPolicy
 *
 * Verify that User is satisfactorily related to the Object's owner.
 * By this point, we know we have some permissions related to the action and object
 * If they are 'owner' permissions, verify that the objects that are being accessed are owned by the current user
 */
module.exports = function(req, res, next) {
    // ownership is handled in the criteria policy.  this file is still here for backwards compatibility.
    next();
};
