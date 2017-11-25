
var helpers = require('../../lib/query-helpers');
var bools = {
  orReplace: 'or replace',
  temporary: 'temporary',
  all: 'all'
};

Object.keys( bools ).forEach( function( key ) {
  helpers.register( key, function( bool ) {
    return bool ? bools[ key ] : '';
  });
});
