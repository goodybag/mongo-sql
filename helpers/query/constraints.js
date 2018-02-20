var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

var quoteList = function(vals){
  return vals.map(function(val){
    return utils.quoteObject(val)
  }).join(', ');
};

helpers.register('constraints', function(constraints, values, query){
  var output = [];

  for (var k in constraints) {
    switch(k) {
      case 'primaryKey':
        output.push('primary key (' + quoteList(constraints[k]) +')');
        break;
      case 'unique':
        output.push('unique (' + quoteList(constraints[k]) + ')');
        break;
    }
  }

  if (!output.length) return '';
  return ', ' + output.join(', ');
});
