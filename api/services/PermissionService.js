var distanceStringMap = {
  '0': 'owner',
  '1': 'role',
  '-1': 'others'
};

module.exports = {
  getDistanceString: function (distance) {
    if (!_.isNumber(distance)) {
      throw new Error('distance must be an integer, or NaN; instead, distance = ' + distance);
    }
    if (!_.has(distanceStringMap, distance)) {
      throw new Error('distance string map does not recognize "'+ distance +'" as a valid distance');
    }
    return distanceStringMap[distance];
  },

  /**
   * Query the ownership relationship between a user and an object.
   *
   * @returns {Integer}
   *  0   user is the the owner of the object, e.g. user = object.owner;
   *  1   user can reach the owner of the object via one Role
   *  -1 there is no Role subgraph that connects the user to object.owner
   */
  getOwnership: function (user, object) {
    return user.getOwnershipRelation
  }
};
