define([ 
	'underscore', 
	'backbone',
	'createjs', 
	'models/map-object'
], function( _, Backbone, createjs, MapObjectM ){
	var PlayerM = Backbone.Model.extend({
		defaults: {
			// personal properties
			color: '#666',
			facing: 'left',
			aim: 0, // -45 to 90
			moving: 0, // -1, 0, or 1	
			bounce: .8, 
			x: 0, 
			y: 0, 
			prevX: 0,
			prevY: 0	
		},
		initialize: function(){
		},		
		validate: function( attrs, options ){
			if( attrs.aim < 0 || attrs.aim > 135 ){
				return 'Outside accepted limits for range'; 
			}
		}			
	}); 
	return PlayerM;
});