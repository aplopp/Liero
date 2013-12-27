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
					type: 1
				});
			} else if ( x > 200 && x < 800 && y > 250 && y < 252 ){
				col.push({
					location: x + ', '+ y,
					color: [ 255,255,255, 255],
					type: 1
				});
			} else if ( x < 200 && y < 100 ){
				col.push({
					location: x + ', '+ y,
					color: [ 255,255,200, 255],
					type: 2
				});
			} else {
				col.push( false );
			}
		}
		layout.push( col );
	}	
	var types = [
		{ // 0
			blockShot: 1,
			blockPlayer: 1,
			destructible: 0,
			diggable: 0
		}
	];
	/**
	 * retrieve type attributes from type number
	 */
	function getType( typeNum ){
		return types[ typeNum ];
	}
	return {
		getType: getType,
		layout: layout,
		height: height,
		width: width
	}
});