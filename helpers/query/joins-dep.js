/**
 * These query helpers are now deprecated!
 * Please use query helper: joins
 */


var helpers = require('../../lib/query-helpers');
var conditionBuilder = require('../../lib/condition-builder');

var buildJoin = function(type, joins, values){
  var output = "";
  for (var table in joins){
    output += ' ' + type + ' join "' + table + '" on ';
    output += conditionBuilder(joins[table], table, values);
  }
  return output;
};

helpers.register('join', function(join, values, query){
  return " " + buildJoin('', join, values);
});

helpers.register('innerJoin', function(join, values, query){
  return " " + buildJoin('inner', join, values);
});

helpers.register('leftJoin', function(join, values, query){
  return " " + buildJoin('left', join, values);
});

helpers.register('leftOuterJoin', function(join, values, query){
  return " " + buildJoin('left outer', join, values);
});

helpers.register('fullOuterJoin', function(join, values, query){
  return " " + buildJoin('full outer', join, values);
});

helpers.register('crossOuterJoin', function(join, values, query){
  return " " + buildJoin('cross outer', join, values);
});
