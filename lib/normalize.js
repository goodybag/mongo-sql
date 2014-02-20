if (typeof module === 'object' && typeof define !== 'function') {
  var define = function(factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require, exports, module){
  // When condition builder is checking sub-objects, one of the
  // steps is to make sure we're not traversing a buffer
  if ( typeof Buffer === 'undefined' ){
    window.Buffer = function(){};
    window.Buffer.isBuffer = function(){
      return false;
    };
  }
});