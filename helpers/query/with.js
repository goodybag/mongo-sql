
var helpers = require('../../lib/query-helpers');
var queryBuilder = require('../../lib/query-builder');

helpers.register('with', function(withObj, values, query){
  if (typeof withObj != 'object') return '';

  // Avoid mutating objects by storing objSyntax names in this array.
  // Indices match up with the newly created withObj array
  var names = [];

  // Convert Object syntax to array syntax, pushing to names
  if ( !Array.isArray( withObj ) ){
    withObj = Object.keys( withObj ).map( function( name ){
      names.push( name );
      return withObj[ name ];
    });
  }

  var output = withObj.map( function( obj, i ){
    var name = 'name' in obj ? obj.name : names[ i ];

    if ( !name ) throw new Error('MoSQL.queryHelper.with requires property `name`');

    return '"' + name + '"' + ' as (' + queryBuilder( obj, values ) + ')';
  }).join(', ');

  return output ? ( 'with ' + output) : '';
});
