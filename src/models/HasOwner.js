/**
 * @module HasOwner
 *
 * Models should extend this module to support object ownership.
 */
module.exports = {
  attributes: {
    owner: {
      model: 'User'
    }
  }
};
