var helpers = require('./');
var conditionBuilder = require('../condition-builder');

var join = function(type, joins){
  var output = "", ons;
  for (var table in joins){
    ons = 0;

    output += ' ' + type + ' join "' + table + '" on ';
    output += conditionBuilder(joins[table], table);
  }
  return output;
};

helpers.register('joins', function(joins, values, query){
  var output = "";
  if (joins.join)          output += " " + join('',             joins.join);
  if (joins.innerJoin)     output += " " + join('inner',        joins.innerJoin);
  if (joins.leftJoin)      output += " " + join('left',         joins.leftJoin);
  if (joins.leftOuterJoin) output += " " + join('left outer',   joins.leftOuterJoin);
  if (joins.fullOuterJoin) output += " " + join('full outer',   joins.fullOuterJoin);
  if (joins.crossJoin)     output += " " + join('cross outer',  joins.crossJoin);

  return output;
});