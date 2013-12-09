define([], function(){
	var functions = {}; 

	functions.getPointOnCircle  = function( originX, originY, radius, angleDegree ){
		var angle = ( angleDegree - 90 )/180 * Math.PI; 
		var x = originX + radius * Math.cos( angle );
		var y = originY + radius * Math.sin( angle );
		return {
			x: x, 
			y: y
		}
	};
	functions.getRandomNumberBetween = function(min, max) {
	    return Math.random() * (max - min) + min;
	};
	functions.getGradiatedPropertyAtProgress = function( points, progress ){
		var fromObj = false; 
		var toObj = false; 
		var value = false;
		_.each( points, function( obj, index ){
			if ( value ) return; // if value found, done

			if ( progress === obj.position ){ // if on the head, obviously use that point
				value = obj.value;
			} else if ( progress > obj.position ){ // if you passed a points position, set to and from
				fromObj = points[ index ]; 					
				toObj = index <= points.length-1 ? points[ index + 1 ] : false;
			}
		});
		
		if ( ! value ){
			// check if one is set and not the other
			if ( toObj && !fromObj ){
				value = toObj.value;
			} else if ( fromObj && !toObj ){
				value = fromObj.value;
			}

		}
		// find the value between the two
		if ( ! value ){
			var valueProg = ( progress - fromObj.position )/(toObj.position - fromObj.position);
			if ( _.isNumber( fromObj.value )){
				value = fromObj.value + valueProg * (toObj.value - fromObj.value);
			} else if ( _.isArray( fromObj.value )){
				value = [];
				for( var i = 0; i < fromObj.value.length; i++ ){
					var from = fromObj.value[ i ];
					var to = toObj.value[ i ];
					value.push( Math.round( from + ( to - from ) * valueProg ) );
				}			
			}
		}
		return value;
	}
	return functions;
});