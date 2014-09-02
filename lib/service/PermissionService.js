'use strict';

/**
 * @param grant {Object}
 * @param grant.ownership {Array} [all]  - owner, role, and others
 * @param grant.methods {Array} [all]    - create, read, update, and delete
 * @param grant.attributes {Array} [all] - the model attributes this permission applies to
 *
 * For any parameter, 'all' can be used as a shortcut to represent all of the
 * possible options.
 *
 * @see <http://en.wikipedia.org/wiki/File_system_permissions#Symbolic_notation>
 */
exports.createGrant = function createGrant (grant) {
  grant = _.defaults({
    ownership: [ 'owner', 'role', 'others' ],
    methods: [ 'create', 'read', 'update', 'delete' ]
  }, grant);



  //if (grant.attributes === 'all') grant.attributes = 
};

exports.getRequiredOwnership = function getRequiredOwnership (grant) {
};

exports.getOwnershipRelation = function getOwnershipRelation (role, user, owner) {
  if (user === owner) Promise.return('owner');

  
};
