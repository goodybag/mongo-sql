if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('returning', function(returning, values, query){
    var oldType = query.type;
    query.type = 'select';
    var output = "returning " + helpers.get('columns').fn(returning, values, query);
    query.type = oldType;
    return output;
  });

  return module.exports;
});
