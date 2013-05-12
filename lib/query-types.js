var types = {};

module.exports.add = function(type, query){
  types[type] = query;
};

module.exports.get = function(type){
  return types[type];
};

module.exports.has = function(type){
  return types.hasOwnProperty(type);
};