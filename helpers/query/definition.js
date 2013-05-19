var helpers = require('../../lib/query-helpers');
var utils   = require('../../lib/utils');

helpers.register('definition', function(definition, values, query){
  if (typeof definition == 'string') return definition;

  var output = "";

  for (var k in definition){
    output += utils.quoteColumn(k);

    for (var j in definition[k]){
      switch (j){

        case 'type':
          output += ' ' + definition[k][j];
          break;

        case 'primaryKey':
          output += ' primary key';
          break;
        
        case 'references':
          output += ' references ' + definition[k][j];
          break;

        default: break;
      }
    }

    output +=  ", ";
  }

  return output.substring(0, output.length - 2);
});