var path = require('path');
var _ = require('lodash');
var rigger = require('sails-rigger');
var injector = require('sails-inject');
var SailsApp = require('sails').Sails;
require('dotenv').load();

rigger.extend([
  'sails-authentication'
]);
