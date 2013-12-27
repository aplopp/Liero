define( ['functions/mapTypeDefinitions'], function( mapTypes ){
	var width = 1000;
	var height = 500;
	var layout = [];
	for( var y = 0; y< height; y++){
		var col = [];
		for( var x = 0; x< width; x++){
			if ( x > 500 && y > 400 ){
				col.push({
					color: [ 115,96,83, 255],
					type: 2
				});
			} else if ( x > 200 && x < 800 && y > 250 && y < 252 ){
				col.push({
					color: [ 255,255,255, 255],
					type: 1
				});
			} else if ( x < 200 && y < 100 ){
				col.push({
					color: [ 255,255,200, 255],
					type: 1
				});
			} else {
				col.push( false );
			}
		}
		layout.push( col );
	}		
	return {
		layout: layout,
		height: height,
		width: width
	}
});