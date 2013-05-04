var valueBehaviors = require('./lib/value-behaviors');
var conditionalBehaviors = require('./lib/conditionals');

module.exports = require('./lib/query-builder');

module.exports.valueHelper = function(key, fn){
  valueBehaviors[key] = fn;
  return module.exports;
};

module.exports.conditionalHelper = function(key, fn){
  conditionalBehaviors[key] = fn;
  return module.exports;
};