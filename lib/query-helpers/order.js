var helpers = require('./');
var utils = require('../utils');

helpers.register('order', function(order, values, query){
  var output = "order by ";

  if (typeof order == 'string') return output + order;

  if (Array.isArray(order)) return output + order.join(', ');

  for (var key in order){
    output += utils.quoteColumn(key, query.__defaultTable) + ' ' + order[key] + ', ';
  }

  if (output == "order by ") return ""; 

  return output.substring(0, output.length - 2);;
});