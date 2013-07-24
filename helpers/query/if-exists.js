if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils   = require('../../lib/utils');

  helpers.register('ifExists', function(ifExists, values, query){
    return ifExists ? 'if exists' : null;
  });

  return module.exports;
});