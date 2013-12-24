define([ 
	'underscore', 
	'jquery',	
	'backbone',
	'createjs', 
	'views/map-object',
	'functions/color'
], function( _, $, Backbone, createjs, MapObjectV, ColorFunctions ){
	var ExplosionV = MapObjectV.extend({
		/** render the model to the canvas as a shape */
		render: function( changed ){
			if ( ! changed ){
				changed = this.model.attributes
			}
			// set up the shape
			if ( 
				_.has( changed, '_color' ) 
				|| _.has( changed, '_radius' )
			){			
				// draw
		 		this.shape.graphics
		 			.clear()
		 			.beginFill( this.model.get( '_color' ) )
		 			.drawCircle(0, 0, this.model.get( '_radius' ))
		 			.endFill();
		 	}
	
		 	return this.shape; 
		}
	}); 
	return ExplosionV;
});