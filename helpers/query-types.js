if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var queryTypes = require('../lib/query-types');

  queryTypes.add(
    'select'
  , '{with} select {distinct} {columns} {table} {alias} {joins} {join} {innerJoin} {leftJoin} {leftOuterJoin} {fullOuterJoin} {crossOuterJoin} {where} {groupBy} {order} {limit} {offset}'
  );

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

  [
    'array_to_json'
  , 'row_to_json'
  , 'array_agg'
  , 'array'
  , 'row_number'
  , 'rank'
  , 'dense_rank'
  , 'percent_rank'
  , 'cume_dist'
  , 'ntile'
  , 'lag'
  , 'lead'
  , 'first_value'
  , 'last_value'
  , 'nth_value'
  , 'max'
  , 'min'
  ].forEach(function(fn){
    queryTypes.add(fn, fn + '( {expression} )')
  });
});
