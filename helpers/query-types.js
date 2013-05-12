var queryTypes = require('../lib/query-types');

queryTypes.add(
  'select'
, 'select {columns} from {table} {tables} {join} {innerJoin} {leftJoin} {leftOuterJoin} {fullOuterJoin} {crossOuterJoin} {where} {limit} {offset} {order} {groupBy}'
);

queryTypes.add(
  'insert'
, 'insert into {table} ({columns}) values ({values}) {returning}'
);

queryTypes.add(
  'update'
, 'update {table} {updates} {where} {returning}'
);

queryTypes.add(
  'delete'
, 'delete from {table} {where}'
);

queryTypes.add(
  'remove'
, 'delete from {table} {where}'
);