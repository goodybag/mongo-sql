// [ CONSTRAINT constraint_name ]
// { NOT NULL |
//   NULL |
//   CHECK ( expression ) [ NO INHERIT ] |
//   DEFAULT default_expr |
//   UNIQUE index_parameters |
//   PRIMARY KEY index_parameters |
//   REFERENCES reftable [ ( refcolumn ) ] [ MATCH FULL | MATCH PARTIAL | MATCH SIMPLE ]
//     [ ON DELETE action ] [ ON UPDATE action ] }
// [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

var helpers     = require('../../lib/query-helpers');
var conditional = require('../../lib/condition-builder');
var columnDefs  = require('../../lib/column-def-helpers');
var utils       = require('../../lib/utils');

helpers.register('columnConstraint', function(constraint, values, query){
  var output = [];

  // Null/Not Null
  if (constraint.null)
    output.push( columnDefs.get('null').fn(constraint.null, values, query) );
  if (constraint.notNull)
    output.push( columnDefs.get('notNull').fn(constraint.notNull, values, query) );

  // Check
  if (constraint.check)
    output.push( columnDefs.get('check').fn(constraint.check, values, query) );

  // No Inherit
  if (constraint.noInherit)
    output.push( columnDefs.get('noInherit', true, values, query) );

  // Default expression
  if (constraint.default)
    output.push( columnDefs.get('default').fn(constraint.default, values, query) );

  // Unique
  if (constraint.unique)
    output.push( columnDefs.get('unique').fn(constraint.unique, values, query) );

  // Primary key
  if (constraint.primaryKey)
    output.push( columnDefs.get('primaryKey').fn(constraint.primaryKey, values, query) );

  // Reference
  if (constraint.references)
    output.push( columnDefs.get('references').fn(constraint.references, values, query) );

  // Foreign Key
  if (constraint.foreignKey){
    output.push(
      'foreign key (' + utils.quoteObject( constraint.foreignKey.column ) + ')'
    );

    output.push(
      columnDefs.get('references').fn(
        constraint.foreignKey.references, values, query
      )
    );
  }

  // Single word booleans
  [
    { name: 'deferrable',         text: 'deferrable' }
  , { name: 'notDeferrable',      text: 'not deferrable' }
  , { name: 'initiallyDeferred',  text: 'initially deferred' }
  , { name: 'initiallyImmediate', text: 'initially immediate' }
  ].forEach(function(item){
    if (constraint[item.name])
      output.push( item.text );
  });

  return output.join(' ');
});
