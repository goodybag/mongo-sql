var helpers = require('../../lib/query-helpers');
var utils = require('../../lib/utils');

helpers.register('order', function(order, values, query){
  var output = "order by ";

  if (typeof order === 'string') return output + order;

  if (Array.isArray(order)) {
  	if (typeof order[0] === 'string') {
  		return output + order.join(', ');	
  	} else {
		for (var i in order) {
		  for (var key in order[i]){
			output += utils.quoteObject(key, query.__defaultTable) + ' ' + order[i][key] + ', ';
		  }
		}
		return output.substring(0, output.length - 2);
  	}
  	
  }

  for (var key in order){
    output += utils.quoteObject(key, query.__defaultTable) + ' ' + order[key] + ', ';
  }

  if (output === "order by ") return "";

  return output.substring(0, output.length - 2);
});
