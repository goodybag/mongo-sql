if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var HelperManager = require('./helper-manager');

  module.exports = new HelperManager({ cascade: true });

  return module.exports;
});