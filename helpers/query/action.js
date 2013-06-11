var helpers = require('../../lib/query-helpers');
var actions = require('../../lib/action-helpers');
var utils = require('../../lib/utils');

helpers.register('action', function(action, values, query){
  var output = "";

  for (var key in action){
    if (actions.has(key)){
      output += actions.get(key).fn(action[key], values, query);
    }
  }

  return output;
});