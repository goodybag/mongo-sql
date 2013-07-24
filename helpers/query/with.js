if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var queryBuilder = require('../../lib/query-builder');

  helpers.register('with', function(withObj, values, query){
    var output = "with ";

    for (var key in withObj)
      output += '"' + key + '"' + ' as (' + queryBuilder(withObj[key], values) + ')';

    // If make sure withObj wasn't just an empty object
    return output != 'with ' ? output : '';
  });

  return module.exports;
});