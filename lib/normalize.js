
// When condition builder is checking sub-objects, one of the
// steps is to make sure we're not traversing a buffer
if ( typeof Buffer === 'undefined' ){
  window.Buffer = function(){}; // eslint-disable-line no-undef
  window.Buffer.isBuffer = function(){ // eslint-disable-line no-undef
    return false;
  };
}
