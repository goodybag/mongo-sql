if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module) {
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register( 'window', function(win, values, query) {
    var out = ['window'];

    if ( win.name ){
      out.push( utils.quoteObject( win.name ) )
    }

    if ( typeof win.as === 'object' ){
      out.push('as (');

      if ( win.as.existing ){
        out.push( utils.quoteObject( win.as.existing ) );
      } else {
        // Supported sub-types in window expression
        [
          'partition'
        , 'order'
        , 'groupBy'
        ].forEach( function( type ){
          if ( win.as[ type ] ){
            out.push( helpers.get( type ).fn( win.as[ type ], values, query ) );
          }
        });
      }

      out.push(')');
    }

    return out.join(' ');
  });
});
