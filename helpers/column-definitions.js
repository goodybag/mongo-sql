
var utils = require('../lib/utils');
var defs = require('../lib/column-def-helpers');
var conditional = require('../lib/condition-builder');

defs.add('type', function(type, values, query){
  return type;
});

defs.add('primaryKey', function(primaryKey, values, query){
  if ( !primaryKey ) return '';

  var out = 'primary key';

  if ( typeof primaryKey === 'string' ){
    out += ' ("' + primaryKey + '")';
  } else if ( Array.isArray( primaryKey ) ){
    out += ' ("' + primaryKey.join('", "') + '")';
  }

  return out;
});

defs.add('references', function(reference, values, query){
  var output = "references ";
  if (typeof reference == 'string')
    return output + '"' + reference + '"';

  output += '"' + reference.table + '"';

  if (reference.column)
    output += '("' + reference.column + '")';

  if (reference.onDelete)
    output += ' on delete ' + reference.onDelete;

  if (reference.onUpdate)
    output += ' on update ' + reference.onUpdate;

  if (reference.match)
    output += ' match ' + reference.match;

  return output;
});

defs.add('notNull', function(notNull, values, query){
  return notNull ? 'not null' : 'null';
});

defs.add('null', function($null, values, query){
  if ($null === true) return 'null';
  if ($null === false) return 'not null';
  return '';
});

defs.add('unique', function(unique, values, query){
  if (unique === true) return 'unique';

  if ( typeof unique === 'string' ) return 'unique ("' + unique + '")';

  if (Array.isArray(unique))
    return 'unique (' + unique.map(function(column){
      return utils.quoteObject(column);
    }).join(', ') + ')';

  return '';
});

defs.add('default', function(def, values, query){
  return def ? ('default ' + def) : '';
});

defs.add('check', function(check, values, query){
  return 'check (' + conditional(check, query.__defaultTable, values) + ')';
});

defs.add('noInherit', function(noInherit, values, query){
  if (noInherit) return 'no inherit';
  return '';
});
