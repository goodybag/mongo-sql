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

, quoteColumn: function(column){
    return '"' + column.split('.').join('"."') + '"';
  }

, quoteValue: function(value){
    var num = parseInt(value), isNum = (typeof num == 'number' && (num < 0 || num > 0));
    return isNum ? value : ("'" + value + "'");
  }
};