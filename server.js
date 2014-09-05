var _ = require('lodash');
var rigger = require('sails-rigged');
var injector = require('sails-inject');
require('dotenv').load();

rigger.load(require.resolve('sails-authentication'), function (error, sa) {
  rigger.extend(sa, 'sails-permissions', function (error, sp) {
    console.log(sp);
  });
});

/*
injector.extend(module.filename, [
    require.resolve('sails-authentication')
  ], function (error, sails) {
    
    sails.load(config, function (error, sails) {
      console.log(sails);
    });

  });
  
*/
