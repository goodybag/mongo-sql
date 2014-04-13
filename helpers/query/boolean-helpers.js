if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var bools = {
    orReplace:  'or replace'
  , temporary:  'temporary'
  , all:        'all'
  };

  Object.keys( bools ).forEach( function( key ){
    helpers.register( key, function( bool, values ){
      return bool ? bools[ key ] : '';
    });
  });

  return module.exports;
});