/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on configuration, check out:
 * http://links.sailsjs.org/docs/config/globals
 */
module.exports.globals = {
	_: true,
	async: false,
	sails: true,
	services: true,
	models: true
};

global.Promise = require('bluebird');
global._ = require('lodash');
