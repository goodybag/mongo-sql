if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module) {
  var helpers = require('../../lib/query-helpers');
  var utils = require('../../lib/utils');

  helpers.register('partition', function(partition, values, query) {
    var clause = Array.isArray(partition) ? partition.join(', ') : (partition||'').toString();
    return clause ? 'partition by ' + clause : '';
  });
});
