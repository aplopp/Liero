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
	}
	return functions;
});