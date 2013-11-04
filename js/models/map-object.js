define([ 
	'underscore', 
	'backbone',
	'createjs',
], function( _, Backbone, createjs ){
	var MapObjectM = Backbone.Model.extend({
		default: {
			model: false, 
			view: false,
			v: 0,
			a: 0
		},
		nextPosition: function(){
			console.log( 'nextPos()');
		}
	});
	return MapObjectM; 
});		