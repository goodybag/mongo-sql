
var queryTypes = require('../lib/query-types');

queryTypes.add( 'select', [
  '{with} select {expression} {distinct}'
, '{columns} {over} {table} {alias}'
, '{joins} {join} {innerJoin} {leftJoin} {leftOuterJoin} {fullOuterJoin} {crossOuterJoin}'
, '{where} {groupBy} {window} {order} {limit} {offset}'
].join(' '));

queryTypes.add(
  'insert'
, '{with} insert into {table} {columns} {values} {expression} {returning}'
);

queryTypes.add(
  'update'
, '{with} update {table} {values} {updates} {from} {where} {returning}'
);

queryTypes.add(
  'delete'
, '{with} delete from {table} {where} {returning}'
);

queryTypes.add(
  'remove'
, '{with} delete from {table} {alias} {where} {returning}'
);

queryTypes.add(
  'create-table'
, '{with} create table {ifNotExists} {table} ({definition})'
);

queryTypes.add(
  'drop-table'
, '{with} drop table {ifExists} {table} {cascade}'
);

queryTypes.add(
  'alter-table'
, 'alter table {ifExists} {only} {table} {action}'
);

queryTypes.add(
  'create-view'
, 'create {orReplace} {temporary} view {view} {columns} as {expression}'
);

queryTypes.add(
  'union'
, '{with} {queries}'
);

queryTypes.add(
  'intersect'
, '{with} {queries}'
);

queryTypes.add(
  'except'
, '{with} {queries}'
);

queryTypes.add('function', '{function}( {expression} )');
queryTypes.add('expression', '{expression}');
