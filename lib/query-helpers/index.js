var helpers = {};

module.exports.register = function(name, fn){
  helpers[name] = fn;
};

module.exports.getHelpers = function(){
  var result = {};
  for (var key in helpers) result[key] = helpers[key];

  return result;
};

module.exports.get = function(name){
  return helpers[name];
};

module.exports.has = function(name){
  return helpers.hasOwnProperty(name);
};