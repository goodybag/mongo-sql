var defaults = {
  cascade: false
, customValues: true
};

var HelperManager = function(){
  this.behaviors = {};
  this.behaviorOptions = {};

  return this;
};

HelperManager.prototype.getOptions = function(name){
  return this.behaviorOptions[name];
};

HelperManager.prototype.get = function(name){
  return this.behaviors[name];
};

HelperManager.prototype.has = function(name){
  return !!this.behaviors[name];
};

HelperManager.prototype.add = function(name, options, fn){
  if (typeof options == 'function'){
    fn = options;
    options = {};
  }

  this.behaviorOptions[name] = options || {};

  for (var key in defaults){
    if (!(key in this.behaviorOptions[name])) this.behaviorOptions[name][key] = defaults[key];
  }

  this.behaviors[name] = fn;

  return this;
};

module.exports.conditional = new HelperManager();
module.exports.value = new HelperManager();