'use strict';

global._ = require('lodash');
_.mixin(require('congruence'));

exports.Role = require('./lib/models/Role');
exports.Permission = require('./lib/models/Permission');
exports.Model = require('./lib/models/Model');
exports.User = require('./lib/models/User');
