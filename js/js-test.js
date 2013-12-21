define([ 'functions/ndarray'], function( ndarray ){
	var x = ndarray( new Int32Array(16), [5, 5]);
	var y = x.hi(4,4).lo(1,1)
	for(var i=0; i<y.shape[0]; ++i) {
	  for(var j=0; j<y.shape[1]; ++j) {
	    y.set(i,j,1)
	  }
	}
	console.log( x.get( 3, 0 ));
});
