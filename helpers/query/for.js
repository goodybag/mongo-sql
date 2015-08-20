var helpers = require('../../lib/query-helpers');
var lockStrengths = [ 'update', 'share', 'no key update', 'key share' ];
var quote = function(val) {
  return val.indexOf('"') < 0 ? ['"', val, '"'].join('') : val;
};

helpers.register('for', function($for, values, query){
  if (typeof $for !== 'object') throw new Error('Invalid for type: ' + typeof $for);
  if (!$for.type || typeof $for.type !== 'string') throw new Error('For helper requires type');

  // handle type
  $for.type = $for.type.toLowerCase();
  if ( lockStrengths.indexOf($for.type) < 0 )
    throw new Error('Invalid type for locking clause, got: ' + $for.type);

  // handle tables
  if ( $for.table ) {
    if ( !Array.isArray($for.table) ) $for.table = [$for.table];
    $for.table = 'of ' + $for.table.map(quote).join(', ');
  } else {
    $for.table = '';
  }

  // handle nowait
  $for.noWait = $for.noWait === true ? 'nowait' : '';

  return [
    'for'
  , $for.type
  , $for.table
  , $for.noWait
  ].join(' ');
});
