if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');

  helpers.register('view', function(view, values, query){
    return '"' + view + '"';
  });

  return module.exports;
});