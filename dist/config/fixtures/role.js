/**
 * Creates default Roles
 *
 * @public
 */
'use strict';

exports.create = function () {
  return Promise.all([sails.models.role.findOrCreate({ name: 'admin' }, { name: 'admin' }), sails.models.role.findOrCreate({ name: 'registered' }, { name: 'registered' }), sails.models.role.findOrCreate({ name: 'public' }, { name: 'public' })]);
};