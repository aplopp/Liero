define([ 'underscore', 'createjs'], function( _, createjs ){
	var functions = {}; 

	var noop = function(){}
	functions.jump = function( object, args, cb ){
		var settings = _.extend({
			height: 100, 
			rebound: .1, 
			duration: 500
		}, args );

		cb = cb || noop;
		var startY = object.y; 
		createjs.Tween.get( object )
			.to({ y: startY - settings.height }, settings.duration/2, createjs.Ease.getPowOut(2) )
			.to({ y: startY }, settings.duration/2, createjs.Ease.getPowIn(2) )
			.to({ y: startY - settings.height*settings.rebound }, settings.duration/2, createjs.Ease.getPowOut(2) )
			.to({ y: startY }, settings.duration/2, createjs.Ease.getPowIn(2) ).call( cb ); 				
	}
	return functions; 
});