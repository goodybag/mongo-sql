if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  var helpers = require('../../lib/query-helpers');
  var actionsHelpers = require('../../lib/action-helpers');
  var utils = require('../../lib/utils');

  helpers.register('action', function(actions, values, query){

    if ( !Array.isArray(actions) ) actions = [actions];

    return actions.map( function( action ){
      var output = "";

      for (var key in action){
        if (actionsHelpers.has(key)){
          output += actionsHelpers.get(key).fn(action[key], values, query);
        }
      }

      return output;
    }).join(', ');


  });

  return module.exports;
});