var requirejs = require('requirejs');
requirejs(['./index'], function(builder){ console.log(builder); })
setTimeout(function(){ console.log("done"); }, 500);
