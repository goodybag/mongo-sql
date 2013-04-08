var
  fs = require('fs')
;

module.exports = {
  requireDir: function(path, options){
    var defaults = {
      recursive: false
    , relativeToProcess: true
    , ignoreIndex: true
    };

    if (options){
      for (var key in defaults){
        if (!options.hasOwnProperty(key)) options[key] = defaults[key];
      }
    } else {
      options = defaults;
    }

    var modules = {};

    if (path.substring(0, 2) === "./")
      path = (options.relativeToProcess ? process.cwd() : __dirname) + path.substring(1);

    var files = fs.readdirSync(path);
    for (var i = files.length - 1, name, stat, isModule; i >= 0; i--){
      name = files[i];
      isModule = false;

      if (options.ignoreIndex && name === "index.js") continue;

      stat = fs.statSync(path + '/' + name);

      if (name.substring(name.length - 3) === ".js"){
        name = name.substring(0, name.length - 3);
        isModule = true;
      }
      else if (name.substring(name.length - 5) === ".json"){
        name = name.substring(0, name.length - 5);
        isModule = true;
      }

      if (options.recursive && stat.isDirectory())
        modules[name] = exports.requireDir(path + '/' + name, options);
      else if (isModule) modules[name] = require(path + '/' + name);
    }

    return modules;
  }

, quoteColumn: function(field, collection){
    var output = "", period;

    // They already quoted both and specified
    if (field.indexOf('"."') > -1)
      output += field;

    // They quoted collection, but not field
    else if ((period = field.indexOf('".')) > -1)
      output += field.substring(0, period + 2) + '"' + field.substring(period + 2) + '"';

    // Included collection, but didn't quote anything
    else if ((period = field.indexOf(".")) > -1)
      output += '"' + field.substring(0, period) + '"."' + field.substring(period + 1) + '"'

    // Didn't include collection, but did quote
    else if (field.indexOf('"') > -1 && collection)
      output += '"' + collection + '".' + field;

    // No collection, no quotes
    else if (collection)
      output += '"' + collection + '"."' + field + '"';

    // No collection, no quotes
    else
      output += '"' + field + '"';

    return output;
  }

, quoteValue: function(value){
    var num = parseInt(value), isNum = (typeof num == 'number' && (num < 0 || num > 0));
    return isNum ? value : "$$" + value + "$$";
  }

  /**
   * Returns a function that when called, will call the
   * passed in function with a specific set of arguments
   */
, with: function(fn){
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){ fn.apply({}, args); };
  }
};