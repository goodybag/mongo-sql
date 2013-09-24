if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils   = require('../../lib/utils');

  helpers.register('function', function(fn, values, query){
    return fn;
  });

  return module.exports;
});