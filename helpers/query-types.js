if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var queryTypes = require('../lib/query-types');

  queryTypes.add(
    'select'
  , '{with} select {columns} from {table} {tables} {join} {innerJoin} {leftJoin} {leftOuterJoin} {fullOuterJoin} {crossOuterJoin} {where} {order} {limit} {offset} {groupBy}'
  );

  queryTypes.add(
    'insert'
  , '{with} insert into {table} {values} {returning}'
  );

  queryTypes.add(
    'update'
  , '{with} update {table} {updates} {where} {returning}'
  );

  queryTypes.add(
    'delete'
  , '{with} delete from {table} {where} {returning}'
  );

  queryTypes.add(
    'remove'
  , '{with} delete from {table} {where} {returning}'
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
});