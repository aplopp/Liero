define( function(){
	var width = 1000;
	var height = 500;
	var layout = [];
	for( var y = 0; y< height; y++){
		var col = [];
		for( var x = 0; x< width; x++){
			if ( x > 500 && y > 400 ){
				col.push({
					location: x + ', '+ y,
					color: [ 255,255,255, 255],
					type: 1,
					blockShot: 1,
					blockPlayer: 1
				});
			} else {
				col.push({
					location: x + ', '+ y,
					color: [ 100, 100, 100, 255 ],
					type: 0,
					blockShot: 0,
					blockPlayer: 0
				});
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