define( function(){
	var types = [
		{ //  0
			blockShot: 0,
			blockPlayer: 0,
			destructible: 0,
			diggable: 0
		}, 
		{ // 1
			blockShot: 1,
			blockPlayer: 1,
			destructible: 0,
			diggable: 0
		},
		{ // 2
			blockShot: 1, 
			blockPlayer: 0,
			destructible: 1,
			diggable: 1
		}
	];
	return {
		get: function( i ){
			if ( i > 0 && i < types.length ){
				return types[i];
			}
			return false;
		}
	}
});