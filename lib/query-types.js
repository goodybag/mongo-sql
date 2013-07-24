if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
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

  return module.exports;
});