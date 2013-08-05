/**
 * Query Helper: Joins
 */

if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var conditionBuilder = require('../../lib/condition-builder');
  var queryBuilder = require('../../lib/query-builder');
  var utils = require('../../lib/utils')

  var buildJoin = function(join, values, query){
    // Require a target
    if ( !join.target )
      throw new Error('Invalid join.target type `' + typeof join.target + '` for query helper `joins`');

    // Allow for strings or objects for join.on
    if ( !join.on || ( typeof join.on !== 'string' && typeof join.on !== 'object' ) )
      throw new Error('Invalid join.on type `' + typeof join.on + '` for query helper `joins`');

    var output = ( join.type ? ( join.type + ' ' ) : '' ) + "join ";

    if ( typeof join.target === 'object' ) output += '(' + queryBuilder( join.target, values ) + ') ';
    else output += '"' + join.target + '" ';

    if ( join.alias ) output += '"' + join.alias + '" ';

    if ( typeof join.on === 'string' ) output += 'on ' + join.on;
    else output += 'on ' + conditionBuilder( join.on, join.alias || join.target, values );

    return output;
  };

  helpers.register('joins', function(joins, values, query){
    if ( Array.isArray( joins ) ) return joins.map( buildJoin ).join(' ');

    if ( typeof joins === 'object' ) {
      return Object.keys( joins ).map(function( val ){
        // For objects, the key is the default alias and target
        if ( !joins[ val ].alias )  joins[ val ].alias = val;
        if ( !joins[ val ].target ) joins[ val ].target = val;

        return buildJoin( joins[ val ] );
      }).join(' ');
    }

    throw new Error('Invalid type `' + typeof joins + '` for query helper `joins`');
  });
});