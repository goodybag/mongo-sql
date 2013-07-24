if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils   = require('../../lib/utils');

  helpers.register('ifNotExists', function(ifNotExists, values, query){
    return ifNotExists ? 'if not exists' : null;
  });

  return module.exports;
});