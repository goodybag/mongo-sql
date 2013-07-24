if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils   = require('../../lib/utils');

  helpers.register('cascade', function(cascade, values, query){
    return cascade ? 'cascade' : null;
  });

  return module.exports;
});