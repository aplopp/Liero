define([ 'functions/ndarray'], function( ndarray ){
	var grid = [];
	function testBigArray( h, w ){
		if ( grid.length === 0 ){
			for( var y = 0, lenY = h; y < lenY; y++ ){
				grid[ y ] = [];
				for( var x = 0, lenX = w; x < lenX; x++ ){
					grid[ y ].push( -1 );
				}
			}
		}
		return grid.slice(0);
	}
	// for( var i = 0; i < 1000; i++ ){
	// 	testNDArray();
	// }
	var copy = testBigArray( 3, 3 );
	copy[1][1] = 1;
	console.log( grid, copy );
});
