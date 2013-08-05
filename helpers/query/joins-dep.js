if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
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

  return module.exports;
});