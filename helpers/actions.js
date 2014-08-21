/**
 * Actions
 */

// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     action [, ... ]
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     RENAME [ COLUMN ] column_name TO new_column_name
// ALTER TABLE [ IF EXISTS ] [ ONLY ] name [ * ]
//     RENAME CONSTRAINT constraint_name TO new_constraint_name
// ALTER TABLE [ IF EXISTS ] name
//     RENAME TO new_name
// ALTER TABLE [ IF EXISTS ] name
//     SET SCHEMA new_schema

// where action is one of:

//     ADD [ COLUMN ] column_name data_type [ COLLATE collation ] [ column_constraint [ ... ] ]
//     DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]
//     ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type [ COLLATE collation ] [ USING expression ]
//     ALTER [ COLUMN ] column_name SET DEFAULT expression
//     ALTER [ COLUMN ] column_name DROP DEFAULT
//     ALTER [ COLUMN ] column_name { SET | DROP } NOT NULL
//     ALTER [ COLUMN ] column_name SET STATISTICS integer
//     ALTER [ COLUMN ] column_name SET ( attribute_option = value [, ... ] )
//     ALTER [ COLUMN ] column_name RESET ( attribute_option [, ... ] )
//     ALTER [ COLUMN ] column_name SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN }
//     ADD table_constraint [ NOT VALID ]
//     ADD table_constraint_using_index
//     VALIDATE CONSTRAINT constraint_name
//     DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]
//     DISABLE TRIGGER [ trigger_name | ALL | USER ]
//     ENABLE TRIGGER [ trigger_name | ALL | USER ]
//     ENABLE REPLICA TRIGGER trigger_name
//     ENABLE ALWAYS TRIGGER trigger_name
//     DISABLE RULE rewrite_rule_name
//     ENABLE RULE rewrite_rule_name
//     ENABLE REPLICA RULE rewrite_rule_name
//     ENABLE ALWAYS RULE rewrite_rule_name
//     CLUSTER ON index_name
//     SET WITHOUT CLUSTER
//     SET WITH OIDS
//     SET WITHOUT OIDS
//     SET ( storage_parameter = value [, ... ] )
//     RESET ( storage_parameter [, ... ] )
//     INHERIT parent_table
//     NO INHERIT parent_table
//     OF type_name
//     NOT OF
//     OWNER TO new_owner
//     SET TABLESPACE new_tablespace

// and table_constraint_using_index is:

//     [ CONSTRAINT constraint_name ]
//     { UNIQUE | PRIMARY KEY } USING INDEX index_name
//     [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

var actions = require('../lib/action-helpers');
var queryHelpers = require('../lib/query-helpers');
var utils = require('../lib/utils');

actions.add('renameTable', function(value, values, query){
  return 'rename to "' + value + '"';
});

actions.add('rename', function(value, values, query){
  return actions.get('renameTable').fn(value, values, query);
});

actions.add('renameConstraint', function(value, values, query){
  return (
    "rename constraint " +
    utils.quoteObject(value.from) +
    " to " +
    utils.quoteObject(value.to)
  );
});

actions.add('renameColumn', function(value, values, query){
  return (
    "rename column " +
    utils.quoteObject(value.from) +
    " to " +
    utils.quoteObject(value.to)
  );
});

actions.add('setSchema', function(value, values, query){
  return 'set schema "' + value + '"';
});

actions.add('addColumn', function(value, values, query){
  var output = ["add column"];

  output.push( utils.quoteObject(value.name) );
  output.push( value.type );

  output.push( queryHelpers.get('columnConstraint').fn(value, values, query) );

  return output.join(' ');
});

actions.add('dropColumn', function(value, values, query){
  if ( Array.isArray(value) ){
    return value.map( function( v ){
      return actions.get('dropColumn').fn( v, values, query );
    }).join(', ');
  }

  var output = ["drop column"];

  if (value.ifExists)
    output.push( 'if exists' );

  output.push( utils.quoteObject(value.name) );

  if (value.restrict)
    output.push( 'restrict' );

  else if (value.cascade)
    output.push( 'cascade' );

  return output.join(' ');
});

actions.add('alterColumn', function(value, values, query){
  if ( Array.isArray(value) ){
    return value.map( function( v ){
      return actions.get('alterColumn').fn( v, values, query );
    }).join(', ');
  }

  var output = ["alter column"];

  output.push( utils.quoteObject(value.name) );

  if (value.type)
    output.push( 'type ' + value.type );

  if (value.collation)
    output.push( 'collate ' + value.collation );

  if (value.using)
    output.push( 'using (' + value.using + ')' );

  if (value.default)
    output.push( 'set default ' + value.default );

  if (value.dropDefault)
    output.push( 'drop default' );

  if (value.notNull === true)
    output.push( 'set not null' );

  if (value.notNull === false)
    output.push( 'drop not null' );

  if (value.statistics)
    output.push( 'set statistics $' + values.push(value.statistics) );

  if (value.storage)
    output.push( 'set storage ' + value.storage );

  return output.join(' ');
});

actions.add( 'dropConstraint', function( value, values, query ){
  if ( !value ) return;

  var out = ['drop constraint'];

  if ( typeof value === 'object' ){
    if ( value.ifExists ) out.push('if exists');
    if ( value.name )     out.push('"' + value.name + '"');
    if ( value.cascade )  out.push('cascade');
    if ( value.restrict ) out.push('restrict');
  } else if ( typeof value === 'string' ){
    out.push('"' + value + '"');
  } else return;

  return out.join(' ');
});

actions.add( 'addConstraint', function( constraint, values, query ){
  return [
    'add constraint'
  , utils.quoteObject( constraint.name )
  , queryHelpers.get('columnConstraint').fn( constraint, values, query )
  ,
  ].join(' ');
});

// Single Parameter actions
[
  { name: 'enableReplicaTrigger', text: 'enable replica trigger' }
, { name: 'enableAlwaysTrigger',  text: 'enable always trigger' }
, { name: 'disableRule',          text: 'disable rule' }
, { name: 'enableRule',           text: 'enable rule' }
, { name: 'enableReplicaRule',    text: 'enable replica rule' }
, { name: 'enableAlwaysRule',     text: 'enable always rule' }
, { name: 'clusterOn',            text: 'cluster on' }
, { name: 'inherit',              text: 'inherit' }
, { name: 'noInherit',            text: 'no inherit' }
, { name: 'of',                   text: 'of' }
, { name: 'notOf',                text: 'not of' }
, { name: 'ownerTo',              text: 'owner to' }
, { name: 'setTableSpace',        text: 'set tablespace' }
].forEach(function(action){
  actions.add( action.name, function(value, values, query){
    return action.text + " " + utils.quoteObject(value);
  });
});

// Same text booleans
[
  { name: 'setWithoutCluster',  text: 'set without cluster' }
, { name: 'setWithOids',        text: 'set with oids' }
, { name: 'setWithoutOids',     text: 'set without oids' }
].forEach(function(action){
  actions.add( action.name, function(value, values, query){
    return value ? action.text : '';
  });
});
