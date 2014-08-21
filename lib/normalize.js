
// When condition builder is checking sub-objects, one of the
// steps is to make sure we're not traversing a buffer
if ( typeof Buffer === 'undefined' ){
  window.Buffer = function(){};
  window.Buffer.isBuffer = function(){
    return false;
  };
}
