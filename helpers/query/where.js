if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var conditionBuilder = require('../../lib/condition-builder');

  helpers.register('where', function(where, values, query){
    var output = conditionBuilder(where, query.__defaultTable, values);
    if (output.length > 0) output = 'where ' + output;
    return output;
  });

  return module.exports;
});