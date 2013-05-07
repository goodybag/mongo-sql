var types = {
  select: 'select {columns} from {table} {tables} {joins} {where} {limit} {offset} {order} {groupBy}'
, insert: 'insert into {table} ({columns}) values ({values}) {returning}'
, update: 'update {table} {updates} {where} {returning}'
, delete: 'delete from {table} {where}'
, remove: 'delete from {table} {where}'
};

module.exports.registerQueryType = function(type, query){
  types[type] = query;
};

module.exports.getQueryTypes = function(){
  var result = {};
  for (var key in types) result[key] = types[key];

  return result;
};

module.exports.get = function(type){
  return types[type];
};

module.exports.has = function(type){
  return types.hasOwnProperty(type);
};