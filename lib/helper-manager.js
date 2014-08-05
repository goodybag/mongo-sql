
var HelperManager = function(defaults){
  this.defaults = defaults || {};
  this.helpers = {};
  return this;
};

HelperManager.prototype.get = function(name){
  if (!this.has(name)) throw new Error('Cannot find helper: ' + name);
  return this.helpers[name];
};

HelperManager.prototype.has = function(name){
  return this.helpers.hasOwnProperty(name);
};

HelperManager.prototype.add = function(name, options, fn){
  if (typeof options == 'function'){
    fn = options;
    options = {};
  }

  options = options || {};

  for (var key in this.defaults){
    if (!(key in options)) options[key] = this.defaults[key];
  }

  this.helpers[name] = { fn: fn, options: options };

  return this;
};

HelperManager.prototype.register = function(name, options, fn){
  return this.add(name, options, fn);
};

module.exports = HelperManager;
