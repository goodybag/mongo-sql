if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('distinct', function(distinct, values, query){
    if (typeof distinct != 'boolean') throw new Error('Invalid distinct type: ' + typeof distinct);

    return (distinct) ? 'distinct ': '';
  });

  return module.exports;
});
